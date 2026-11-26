import { neon } from '@neondatabase/serverless';

import { adminDatabaseUrl } from '../catalog/server.mjs';
import { AUDIT_ACTIONS } from './tools.mjs';
import { auditCatalog, CATALOG_TABLES, EXPECTED_TABLES, EXPECTED_VIEWS } from './auditors.mjs';

const snapshotOptions = { isolationLevel: 'RepeatableRead', readOnly: true };
const connection = () => {
  const url = adminDatabaseUrl();
  if (!url) throw new Error('Database is not configured');
  return neon(url);
};
const finding = (severity, rule, title, evidence) => ({ id: rule, severity, rule, title, evidence, products: [] });

export function summarizeScan(result) {
  return { status: 'complete', checkedAt: result.checkedAt, counts: Object.fromEntries(['error', 'warning', 'info'].map((severity) => [severity, result.findings.filter((item) => item.severity === severity).length])) };
}

export async function scanCatalog(tool, sql = connection()) {
  // Raw rows expose missing/mismatched details instead of filling domain defaults.
  const tables = [...CATALOG_TABLES, ...(tool === 'integrity' ? ['public_products'] : [])];
  const rows = await sql.transaction(tables.map((table) => sql.query(`select * from public.${table}`)), snapshotOptions);
  const snapshot = Object.fromEntries(tables.map((table, index) => [table, rows[index]]));
  const result = auditCatalog(tool, snapshot);
  if (tool === 'integrity') {
    const expected = new Set(snapshot.products.filter((product) => product.published && !product.hidden).map(({ id }) => id));
    const visible = new Set(snapshot.public_products.map(({ id }) => id));
    const unexpected = [...visible].filter((id) => !expected.has(id));
    const missing = [...expected].filter((id) => !visible.has(id));
    if (unexpected.length || missing.length) result.findings.push(finding('error', 'public-visibility', 'Public product visibility disagrees with catalog flags', `Unexpected public IDs: ${unexpected.join(', ') || 'none'}. Missing public IDs: ${missing.join(', ') || 'none'}.`));
  }
  return result;
}

export async function scanHealth(migrations, sql = connection()) {
  const started = Date.now();
  const [objects] = await sql.transaction([sql.query(`
    select c.relname as name, c.relkind as kind from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind in ('r','p','v')
  `)], snapshotOptions);
  const checks = [{ label: 'Connection', value: `Connected; metadata query completed in ${Date.now() - started} ms.` }];
  const findings = [];
  for (const [label, names, kinds] of [['tables', EXPECTED_TABLES, ['r', 'p']], ['views', EXPECTED_VIEWS, ['v']]]) {
    const missing = names.filter((name) => !objects.some((object) => object.name === name && kinds.includes(object.kind)));
    checks.push({ label: `Expected ${label}`, value: `${names.length - missing.length} / ${names.length} present` });
    if (missing.length) findings.push(finding('error', `missing-${label}`, `Expected ${label} are missing`, missing.join(', ')));
  }
  try {
    const [applied] = await sql.transaction([sql.query('select created_at from drizzle.__drizzle_migrations order by created_at')], snapshotOptions);
    const timestamps = new Set(applied.map((row) => Number(row.created_at)));
    const pending = migrations.filter((entry) => !timestamps.has(entry.when));
    const known = new Set(migrations.map((entry) => entry.when));
    const unknown = applied.filter((row) => !known.has(Number(row.created_at)));
    checks.push({ label: 'Migration journal', value: `${migrations.length - pending.length} / ${migrations.length} repository migration timestamps recorded. SQL hashes are not compared.` });
    if (pending.length) findings.push(finding('error', 'pending-migrations', 'Repository migrations are not recorded', pending.map(({ tag }) => tag).join(', ')));
    if (unknown.length) findings.push(finding('warning', 'unknown-migrations', 'Database has migrations outside this checkout', `${unknown.length} migration timestamps are not in the repository journal.`));
  } catch {
    checks.push({ label: 'Migration journal', value: 'Not verified. The journal is unavailable to this connection.' });
    findings.push(finding('info', 'migration-unverified', 'Migration status could not be verified', 'The admin role may lack access to drizzle.__drizzle_migrations. Verify with the migration operator; this tool does not request broader privileges.'));
  }
  return { checks, findings };
}

const privilegeQuery = (sql, configuredLogin = false) => sql.query(`
  select r.rolname as role, r.rolcanlogin as login, c.relname as relation,
    has_schema_privilege(r.oid, n.oid, 'USAGE') as schema_usage,
    has_schema_privilege(r.oid, n.oid, 'CREATE') as schema_create,
    has_table_privilege(r.oid, c.oid, 'SELECT') as can_select,
    has_table_privilege(r.oid, c.oid, 'INSERT') as can_insert,
    has_table_privilege(r.oid, c.oid, 'UPDATE') as can_update,
    has_table_privilege(r.oid, c.oid, 'DELETE') as can_delete,
    has_table_privilege(r.oid, c.oid, 'TRUNCATE') as can_truncate,
    has_table_privilege(r.oid, c.oid, 'REFERENCES') as can_reference,
    has_table_privilege(r.oid, c.oid, 'TRIGGER') as can_trigger
  from pg_roles r cross join pg_class c join pg_namespace n on n.oid = c.relnamespace
  where ${configuredLogin ? 'r.rolname = current_user' : "r.rolname in ('emporium_reader','emporium_writer','emporium_migrator')"}
    and n.nspname = 'public' and c.relkind in ('r','p','v')
`);

export function auditPrivileges(rows, role, capability, { login = false, label = role } = {}) {
  const selected = rows.filter((row) => row.role === role);
  if (!selected.length) return [finding('error', `role-${label}`, 'Required role or relations are unavailable', label)];
  const issues = [];
  if (!login && selected.some((row) => row.login)) issues.push('capability role allows direct login');
  if (selected.some((row) => !row.schema_usage)) issues.push('schema USAGE is missing');
  if (selected.some((row) => row.schema_create !== (capability === 'migrator'))) issues.push('schema CREATE does not match the intended capability');
  const tables = new Map(selected.map((row) => [row.relation, row]));
  const writeKeys = ['can_insert', 'can_update', 'can_delete', 'can_truncate', 'can_reference', 'can_trigger'];
  for (const name of [...EXPECTED_TABLES, ...EXPECTED_VIEWS]) {
    const row = tables.get(name);
    if (!row) { issues.push(`${name}: missing relation`); continue; }
    if (capability === 'reader') {
      if (row.can_select !== EXPECTED_VIEWS.includes(name) || writeKeys.some((key) => row[key])) issues.push(`${name}: reader access differs from SELECT on public views only`);
    } else {
      if (EXPECTED_TABLES.includes(name) && ['can_select', 'can_insert', 'can_update', 'can_delete'].some((key) => !row[key])) issues.push(`${name}: catalog DML privileges are incomplete`);
      if (capability === 'writer' && ['can_truncate', 'can_reference', 'can_trigger'].some((key) => row[key])) issues.push(`${name}: writer has privileges beyond SELECT, INSERT, UPDATE, DELETE`);
    }
  }
  return issues.length ? [finding('error', `privileges-${label}`, `Access mismatch: ${label}`, issues.join('; '))] : [];
}

export async function scanPermissions(sql = connection(), publicSql = process.env.PUBLIC_DATABASE_URL ? neon(process.env.PUBLIC_DATABASE_URL) : null) {
  const [roles, admin] = await sql.transaction([privilegeQuery(sql), privilegeQuery(sql, true)], snapshotOptions);
  const findings = [];
  const checks = [];
  for (const capability of ['reader', 'writer', 'migrator']) {
    const role = `emporium_${capability}`;
    const issues = auditPrivileges(roles, role, capability);
    findings.push(...issues);
    checks.push({ label: role, value: issues.length ? 'Access mismatch detected' : 'Expected capability privileges verified' });
  }
  findings.push(...auditPrivileges(admin, admin[0]?.role, 'writer', { login: true, label: 'configured admin connection' }));
  checks.push({ label: 'Admin login', value: 'Effective privileges checked against writer requirements, including inherited access.' });
  if (publicSql) {
    try {
      const [rows] = await publicSql.transaction([privilegeQuery(publicSql, true)], snapshotOptions);
      findings.push(...auditPrivileges(rows, rows[0]?.role, 'reader', { login: true, label: 'configured public connection' }));
      checks.push({ label: 'Public login', value: 'Effective privileges checked against reader requirements, including inherited access.' });
    } catch {
      findings.push(finding('warning', 'public-login-unverified', 'Public login could not be checked', 'The configured public database connection could not complete its privilege query.'));
    }
  } else findings.push(finding('info', 'public-login-unconfigured', 'Public login was not checked', 'PUBLIC_DATABASE_URL is not configured in this admin deployment. Capability role checks cover the admin database only.'));
  return { checks, findings };
}

export function parseHistoryQuery(query) {
  const action = query.action || '';
  const search = query.search || '';
  if (typeof action !== 'string' || (action && !AUDIT_ACTIONS.includes(action)) || typeof search !== 'string' || search.length > 160) throw new Error('Invalid history filter');
  let cursor = null;
  if (query.cursor) {
    if (typeof query.cursor !== 'string' || query.cursor.length > 220) throw new Error('Invalid history cursor');
    try { cursor = JSON.parse(query.cursor); } catch { throw new Error('Invalid history cursor'); }
    if (!cursor || typeof cursor.at !== 'string' || !Number.isFinite(Date.parse(cursor.at)) || typeof cursor.id !== 'string' || !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(cursor.id)) throw new Error('Invalid history cursor');
  }
  return { action, search: search.trim(), cursor };
}

export async function readHistory({ action, search, cursor }, sql = connection()) {
  const [rows] = await sql.transaction([sql.query(`
    select e.id, e.action, e.actor, e.product_id, e.change_set_id, e.before, e.after,
      to_char(e.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') as created_at,
      cs.message, cs.status as publication_status, cs.published_at,
      coalesce(p.name, e.after->>'name', e.before->>'name') as product_name,
      coalesce(p.slug, e.after->>'slug', e.before->>'slug') as product_slug,
      coalesce(p.type::text, e.after->>'type', e.before->>'type') as product_type
    from audit_events e left join change_sets cs on cs.id = e.change_set_id
      left join products p on p.id = e.product_id
    where ($1 = '' or e.action::text = $1)
      and ($2 = '' or strpos(lower(concat_ws(' ', p.name, p.slug, e.product_id::text,
        e.after->>'name', e.before->>'name', e.after->>'slug', e.before->>'slug',
        e.after->>'id', e.before->>'id', cs.message, e.change_set_id::text)), lower($2)) > 0)
      and ($3::timestamptz is null or (e.created_at, e.id) < ($3::timestamptz, $4::uuid))
    order by e.created_at desc, e.id desc limit 26
  `, [action, search, cursor?.at || null, cursor?.id || null])], snapshotOptions);
  const events = rows.slice(0, 25);
  const last = events[events.length - 1];
  return { events, nextCursor: rows.length > 25 ? JSON.stringify({ at: last.created_at, id: last.id }) : null, checkedAt: new Date().toISOString() };
}
