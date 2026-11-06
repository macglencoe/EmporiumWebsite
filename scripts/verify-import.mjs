import assert from 'node:assert/strict';

import { productSchema } from '@emporium/domain';
import { createDatabase, exportCatalog, importCatalog } from '@emporium/database';

import { requireDatabaseUrl } from './lib/environment.mjs';
import { comparable, counts, loadLegacyCatalog } from './lib/legacy-catalog.mjs';

const source = loadLegacyCatalog();
if (!source.success) throw new Error(`Legacy validation failed with ${source.errors.length} errors`);
const database = createDatabase(requireDatabaseUrl());
const before = await exportCatalog(database);
before.forEach((product) => productSchema.parse(product));
const normalize = (catalog) => catalog.map(comparable).sort((left, right) => `${left.type}:${left.slug}`.localeCompare(`${right.type}:${right.slug}`));
assert.deepEqual(normalize(before), normalize(source.products), 'Database catalog differs from normalized legacy source');
const beforeCounts = counts(before);
assert.equal(new Set(before.map((product) => product.slug)).size, before.length, 'Product slugs are not unique');

await importCatalog(database, source.products);
const after = await exportCatalog(database);
assert.deepEqual(normalize(after), normalize(before), 'A repeated import changed normalized catalog data');
assert.deepEqual(counts(after), beforeCounts, 'A repeated import changed record counts');
console.log(JSON.stringify({ success: true, counts: beforeCounts, warningCount: source.warnings.length, idempotent: true }, null, 2));
