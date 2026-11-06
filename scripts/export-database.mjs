import fs from 'node:fs';
import path from 'node:path';

import { exportLegacyCatalog, productSchema } from '@emporium/domain';
import { createDatabase, exportCatalog } from '@emporium/database';

import { requireDatabaseUrl } from './lib/environment.mjs';

const outputFlag = process.argv.indexOf('--output');
if (outputFlag === -1 || !process.argv[outputFlag + 1]) throw new Error('Usage: npm run export:database -- --output <directory>');
const outputDirectory = path.resolve(process.argv[outputFlag + 1]);
const catalog = await exportCatalog(createDatabase(requireDatabaseUrl()));
catalog.forEach((product) => productSchema.parse(product));
fs.mkdirSync(outputDirectory, { recursive: true });
const filenames = { cigar: 'consolidated_cigars.json', tobacco: 'tobacco.json', pipe: 'pipes.json', caffeine: 'caffeine.json' };
for (const [type, filename] of Object.entries(filenames)) {
  const legacy = exportLegacyCatalog(catalog.filter((product) => product.type === type));
  fs.writeFileSync(path.join(outputDirectory, filename), `${JSON.stringify(legacy, null, 2)}\n`, { flag: 'wx' });
}
console.log(`Exported ${catalog.length} products to ${outputDirectory}`);
