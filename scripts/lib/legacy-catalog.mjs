import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { importLegacyCatalog } from '@emporium/domain';

export const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export const legacySources = [
  { type: 'cigar', path: 'apps/public/public/data/consolidated_cigars.json' },
  { type: 'tobacco', path: 'apps/public/public/data/tobacco.json' },
  { type: 'pipe', path: 'apps/public/public/data/pipes.json' },
  { type: 'caffeine', path: 'apps/public/public/data/caffeine.json' },
];

export function loadLegacyCatalog() {
  const results = legacySources.map((source) => {
    const absolutePath = path.join(repositoryRoot, source.path);
    const contents = fs.readFileSync(absolutePath, 'utf8');
    const rows = JSON.parse(contents);
    const result = importLegacyCatalog(source.type, rows, { source: source.path });
    return { ...source, checksum: createHash('sha256').update(contents).digest('hex'), ...result };
  });
  const errors = results.flatMap((result) => result.errors);
  const products = results.flatMap((result) => result.products);
  const slugs = new Map();
  for (const product of products) {
    if (slugs.has(product.slug)) errors.push({ code: 'DUPLICATE_SLUG_ACROSS_TYPES', slug: product.slug, message: `Slug is shared by ${slugs.get(product.slug)} and ${product.type}` });
    else slugs.set(product.slug, product.type);
  }
  return { success: errors.length === 0, products, errors, warnings: results.flatMap((result) => result.warnings), sources: results };
}

export function counts(products) {
  const result = { products: products.length, cigar: 0, tobacco: 0, pipe: 0, caffeine: 0, cigarVariants: 0, tobaccoComponents: 0 };
  for (const product of products) {
    result[product.type] += 1;
    if (product.type === 'cigar') result.cigarVariants += product.variants.length;
    if (product.type === 'tobacco') result.tobaccoComponents += product.details.components.length;
  }
  return result;
}

export function comparable(product) {
  return { ...product, createdAt: null, updatedAt: null, publishedAt: null };
}
