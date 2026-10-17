import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import { importLegacyCatalog } from '@emporium/domain';

import { prepareCatalogImport } from '../lib/catalog/import.mjs';

const source = JSON.parse(fs.readFileSync(new URL('../../public/public/data/tobacco.json', import.meta.url), 'utf8')).slice(0, 2);
const current = importLegacyCatalog('tobacco', source).products;

test('matching legacy JSON produces no changes', () => {
  const result = prepareCatalogImport({ type: 'tobacco', rows: source, mode: 'replace', catalog: current });
  assert.equal(result.valid, true);
  assert.deepEqual(result.counts, { create: 0, update: 0, delete: 0 });
});

test('merge updates records without deleting omitted products', () => {
  const changed = [{ ...source[0], description: 'Updated by import test' }];
  const result = prepareCatalogImport({ type: 'tobacco', rows: changed, mode: 'merge', catalog: current });
  assert.deepEqual(result.counts, { create: 0, update: 1, delete: 0 });
});

test('replace deletes selected-type records omitted from the upload', () => {
  const result = prepareCatalogImport({ type: 'tobacco', rows: [source[0]], mode: 'replace', catalog: current });
  assert.deepEqual(result.counts, { create: 0, update: 0, delete: 1 });
});

test('empty arrays are rejected', () => {
  assert.throws(() => prepareCatalogImport({ type: 'cigar', rows: [], mode: 'replace', catalog: [] }), /non-empty JSON array/);
});
