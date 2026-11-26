import assert from 'node:assert/strict';
import test from 'node:test';

import { auditCatalog, CATALOG_TABLES, EXPECTED_TABLES, EXPECTED_VIEWS } from '../lib/database/auditors.mjs';
import { auditPrivileges, parseHistoryQuery, readHistory, scanCatalog, scanHealth, scanPermissions, summarizeScan } from '../lib/database/server.mjs';
import { findingsCsv } from '../lib/database/tools.mjs';

const product = (id, extra = {}) => ({ id, type: 'cigar', slug: `product-${id}`, name: 'Example', brand: 'Brand', published: true, hidden: false, published_at: '2026-11-26T12:00:00Z', description: 'Description', image_url: 'https://example.test/image.jpg', ...extra });
const snapshot = (products, extra = {}) => ({ ...Object.fromEntries(CATALOG_TABLES.map((table) => [table, []])), products, ...extra });

function fakeSql(results) {
  const calls = [];
  const transactions = [];
  return {
    calls, transactions,
    query(text, params) { const query = { text, params }; calls.push(query); return query; },
    async transaction(queries, options) {
      transactions.push({ queries, options });
      const next = results.shift();
      if (next instanceof Error) throw next;
      return next;
    },
  };
}

test('duplicate candidates combine evidence and expose price conflicts without merging records', () => {
  const data = snapshot([product('a', { brand: 'J.C. Newman' }), product('b', { brand: 'J C Newman', description: 'Different' })], {
    cigar_variants: [
      { product_id: 'a', size: 'Toro', barcode: '001234', price: '10.00' },
      { product_id: 'b', size: 'Toro', barcode: '001234', price: '11.00' },
    ],
  });
  const original = structuredClone(data);
  const { findings } = auditCatalog('duplicates', data);
  assert.equal(findings.length, 1);
  assert.match(findings[0].evidence, /normalization/);
  assert.match(findings[0].evidence, /Shared barcode: 001234/);
  assert.match(findings[0].evidence, /prices differ/);
  assert.equal(findings[0].comparison[1].variants[0].price, '11.00');
  assert.equal(findings[0].severity, 'warning');
  assert.deepEqual(data, original);
});

test('blank names and barcodes do not create duplicate candidates; barcode zeroes are significant', () => {
  const { findings } = auditCatalog('duplicates', snapshot([product('a', { brand: null }), product('b', { brand: null })], {
    cigar_variants: [
      { product_id: 'a', barcode: '' }, { product_id: 'b', barcode: '' },
      { product_id: 'a', barcode: '00123' }, { product_id: 'b', barcode: '123' },
    ],
  }));
  assert.equal(findings.length, 0);
});

test('multiple variants on one product never make that product a duplicate of itself', () => {
  assert.equal(auditCatalog('duplicates', snapshot([product('a')], { cigar_variants: [{ product_id: 'a', barcode: '123' }, { product_id: 'a', barcode: '123' }] })).findings.length, 0);
});

test('quality distinguishes optional gaps from malformed references and preserves zero prices', () => {
  const { findings } = auditCatalog('quality', snapshot([product('a', { description: '', image_url: 'javascript:alert(1)' })], {
    cigar_details: [{ product_id: 'a', wrapper: 'Leaf', binder: 'Leaf', filler: 'Leaf', strength: 'Medium' }],
    cigar_variants: [{ product_id: 'a', size: 'Toro', barcode: '123', price: 0 }],
  }));
  assert.equal(findings.find((item) => item.rule === 'missing-content').severity, 'info');
  assert.equal(findings.find((item) => item.rule === 'image-url').severity, 'warning');
  assert.ok(!findings.some((item) => item.rule === 'incomplete-variant'));
});

test('integrity detects missing/wrong details, orphan records, repeated variants and publication gaps', () => {
  const { findings } = auditCatalog('integrity', snapshot([product('a', { published_at: null })], {
    pipe_details: [{ product_id: 'a' }, { product_id: 'gone' }],
    cigar_variants: [{ product_id: 'a', size: 'Toro', barcode: '123' }, { product_id: 'a', size: 'TORO', barcode: '123' }],
    product_images: [{ product_id: 'a', is_primary: true, url: 'https://example.test/other.jpg' }],
  }));
  for (const rule of ['detail-count', 'wrong-product-type', 'orphan-record', 'repeated-variant', 'publication-timestamp', 'primary-image']) assert.ok(findings.some((item) => item.rule === rule), rule);
});

test('catalog scan reads all states from a single read-only repeatable snapshot and checks visibility', async () => {
  const sql = fakeSql([[ [product('a', { hidden: true })], [], [{ product_id: 'a' }], [{ product_id: 'a', size: 'Toro' }], [], [], [], [], [{ id: 'a' }] ]]);
  const result = await scanCatalog('integrity', sql);
  assert.equal(sql.transactions.length, 1);
  assert.deepEqual(sql.transactions[0].options, { isolationLevel: 'RepeatableRead', readOnly: true });
  assert.ok(sql.calls.every(({ text }) => /^select \* from public\./.test(text)));
  assert.ok(result.findings.some((item) => item.rule === 'public-visibility'));
});

function privilegeRows(role, capability) {
  return [...EXPECTED_TABLES, ...EXPECTED_VIEWS].map((relation) => ({
    role, relation, login: false, schema_usage: true, schema_create: capability === 'migrator',
    can_select: capability !== 'reader' || EXPECTED_VIEWS.includes(relation),
    can_insert: capability !== 'reader', can_update: capability !== 'reader', can_delete: capability !== 'reader',
    can_truncate: capability === 'migrator', can_reference: capability === 'migrator', can_trigger: capability === 'migrator',
  }));
}

test('permissions verify each DML privilege separately and reject reader leaks on every expected relation', () => {
  for (const capability of ['reader', 'writer', 'migrator']) assert.deepEqual(auditPrivileges(privilegeRows(`emporium_${capability}`, capability), `emporium_${capability}`, capability), []);
  const reader = privilegeRows('emporium_reader', 'reader');
  reader.find((row) => row.relation === 'admin_sessions').can_select = true;
  assert.match(auditPrivileges(reader, 'emporium_reader', 'reader')[0].evidence, /admin_sessions/);
  const writer = privilegeRows('emporium_writer', 'writer');
  writer[0].can_delete = false;
  assert.match(auditPrivileges(writer, 'emporium_writer', 'writer')[0].evidence, /incomplete/);
  writer[0].can_delete = true; writer[0].schema_create = true;
  assert.match(auditPrivileges(writer, 'emporium_writer', 'writer')[0].evidence, /CREATE/);
  assert.equal(auditPrivileges([], 'missing', 'reader').length, 1);
});

test('permissions inspect configured logins and report unavailable public configuration', async () => {
  const roles = ['reader', 'writer', 'migrator'].flatMap((capability) => privilegeRows(`emporium_${capability}`, capability));
  const sql = fakeSql([[roles, privilegeRows('app_login', 'writer')]]);
  const result = await scanPermissions(sql, null);
  assert.deepEqual(result.findings.map(({ rule }) => rule), ['public-login-unconfigured']);
  assert.match(sql.calls[1].text, /current_user/);
  const publicSql = fakeSql([new Error('unreachable')]);
  const retrySql = fakeSql([[roles, privilegeRows('app_login', 'writer')]]);
  assert.ok((await scanPermissions(retrySql, publicSql)).findings.some((item) => item.rule === 'public-login-unverified'));
});

test('health distinguishes unverified migrations from missing schema and pending migrations', async () => {
  const objects = [...EXPECTED_TABLES.map((name) => ({ name, kind: 'r' })), ...EXPECTED_VIEWS.map((name) => ({ name, kind: 'v' }))];
  const migrations = [{ when: 123, tag: 'first' }, { when: 456, tag: 'second' }];
  const unavailable = await scanHealth(migrations, fakeSql([[objects], new Error('permission denied')]));
  assert.deepEqual(unavailable.findings.map(({ rule }) => rule), ['migration-unverified']);
  const pending = await scanHealth(migrations, fakeSql([[objects.filter(({ name }) => name !== 'products')], [[{ created_at: '123' }]]]));
  assert.ok(pending.findings.some((item) => item.rule === 'missing-tables'));
  assert.match(pending.findings.find((item) => item.rule === 'pending-migrations').evidence, /second/);
});

test('history validates filters and preserves microseconds for stable keyset pagination', async () => {
  const id = '11111111-1111-4111-8111-111111111111';
  const cursor = { at: '2026-11-26T12:00:00.123456Z', id };
  assert.deepEqual(parseHistoryQuery({ action: 'delete', search: ' abc ', cursor: JSON.stringify(cursor) }), { action: 'delete', search: 'abc', cursor });
  for (const query of [{ action: 'drop' }, { search: ['bad'] }, { search: 'a'.repeat(161) }, { cursor: 'null' }, { cursor: JSON.stringify({ at: 'bad', id }) }]) assert.throws(() => parseHistoryQuery(query));
  const rows = Array.from({ length: 26 }, (_, index) => ({ id: `${id}-${index}`, created_at: cursor.at }));
  const sql = fakeSql([[rows]]);
  const result = await readHistory({ action: 'delete', search: "'; drop table products; --", cursor }, sql);
  assert.equal(result.events.length, 25);
  assert.equal(JSON.parse(result.nextCursor).at, cursor.at);
  assert.ok(!sql.calls[0].text.includes('drop table'));
  assert.equal(sql.calls[0].params[2], cursor.at);
  assert.match(sql.calls[0].text, /e\.before->>'id'/);
  assert.match(sql.calls[0].text, /order by e.created_at desc, e.id desc limit 26/);
});

test('reports count severities and CSV quotes multiline evidence and prevents formula injection', () => {
  const findings = [{ severity: 'warning', rule: 'duplicate', title: '=HYPERLINK("x")', evidence: 'line one\nline "two"', products: [{ id: 'a', slug: 'example' }] }];
  assert.deepEqual(summarizeScan({ checkedAt: 'now', findings }).counts, { error: 0, warning: 1, info: 0 });
  const csv = findingsCsv(findings);
  assert.ok(csv.includes('"\'=HYPERLINK(""x"")"'));
  assert.ok(csv.includes('"line one\nline ""two"""'));
});
