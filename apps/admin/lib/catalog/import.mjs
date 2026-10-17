import { exportLegacyProduct, importLegacyCatalog, productSchema } from '@emporium/domain';

const same = (left, right) => JSON.stringify(exportLegacyProduct(left)) === JSON.stringify(exportLegacyProduct(right));

function preserveIdentity(incoming, existing) {
  if (!existing) return productSchema.parse(incoming);
  const common = {
    ...incoming,
    id: existing.id,
    version: existing.version,
    createdAt: existing.createdAt,
    updatedAt: existing.updatedAt,
    publishedAt: existing.publishedAt,
  };
  if (incoming.type !== 'cigar') return productSchema.parse(common);
  const byBarcode = new Map(existing.variants.filter(({ barcode }) => barcode).map((variant) => [variant.barcode, variant.id]));
  return productSchema.parse({
    ...common,
    variants: incoming.variants.map((variant, index) => ({
      ...variant,
      id: byBarcode.get(variant.barcode) || existing.variants[index]?.id || variant.id,
    })),
  });
}

export function prepareCatalogImport({ type, rows, mode, catalog }) {
  if (!['cigar', 'tobacco'].includes(type)) throw new Error('Choose cigars or pipe tobacco.');
  if (!['merge', 'replace'].includes(mode)) throw new Error('Choose merge or replace mode.');
  if (!Array.isArray(rows) || rows.length === 0) throw new Error('The import file must contain a non-empty JSON array.');

  const parsed = importLegacyCatalog(type, rows, { source: 'admin upload' });
  if (!parsed.success) return { valid: false, errors: parsed.errors, warnings: parsed.warnings, stats: parsed.stats };

  const selected = catalog.filter((product) => product.type === type);
  const selectedBySlug = new Map(selected.map((product) => [product.slug, product]));
  const otherSlug = new Set(catalog.filter((product) => product.type !== type).map((product) => product.slug));
  const conflicts = parsed.products.filter((product) => otherSlug.has(product.slug));
  if (conflicts.length) return {
    valid: false,
    errors: conflicts.map((product) => ({ code: 'SLUG_CONFLICT', slug: product.slug, message: `Slug ${product.slug} belongs to another catalog type.` })),
    warnings: parsed.warnings,
    stats: parsed.stats,
  };

  const incomingSlugs = new Set(parsed.products.map((product) => product.slug));
  const changes = parsed.products.map((product) => {
    const existing = selectedBySlug.get(product.slug) ?? null;
    const payload = preserveIdentity(product, existing);
    if (!existing) return { operation: 'create', existing: null, payload };
    return same(payload, existing) ? null : { operation: 'update', existing, payload };
  }).filter(Boolean);
  if (mode === 'replace') {
    for (const existing of selected) if (!incomingSlugs.has(existing.slug)) changes.push({ operation: 'delete', existing, payload: null });
  }

  const counts = changes.reduce((result, change) => ({ ...result, [change.operation]: result[change.operation] + 1 }), { create: 0, update: 0, delete: 0 });
  return {
    valid: true,
    changes,
    counts,
    warnings: parsed.warnings,
    stats: parsed.stats,
    currentCount: selected.length,
    uploadedCount: parsed.products.length,
    backup: selected.map(exportLegacyProduct),
    preview: changes.slice(0, 100).map(({ operation, existing, payload }) => ({ operation, slug: payload?.slug ?? existing.slug, name: payload?.name ?? existing.name })),
  };
}
