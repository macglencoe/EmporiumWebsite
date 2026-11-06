import { createDatabase, importCatalog } from '@emporium/database';

import { requireDatabaseUrl } from './lib/environment.mjs';
import { counts, loadLegacyCatalog } from './lib/legacy-catalog.mjs';

const dryRun = process.argv.includes('--dry-run');
const catalog = loadLegacyCatalog();
if (!catalog.success) {
  console.error(JSON.stringify({ success: false, errors: catalog.errors }, null, 2));
  process.exitCode = 1;
} else {
  const summary = dryRun
    ? await importCatalog(null, catalog.products, { dryRun: true })
    : await importCatalog(createDatabase(requireDatabaseUrl()), catalog.products);
  console.log(JSON.stringify({ success: true, dryRun, counts: counts(catalog.products), databaseRows: summary, warningCount: catalog.warnings.length, warningCodes: Object.fromEntries([...new Set(catalog.warnings.map((warning) => warning.code))].sort().map((code) => [code, catalog.warnings.filter((warning) => warning.code === code).length])), sources: catalog.sources.map(({ type, path, checksum, stats }) => ({ type, path, checksum, stats })) }, null, 2));
}
