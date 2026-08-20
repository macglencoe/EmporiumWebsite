import { randomUUID } from 'node:crypto';

import { exportLegacyProduct, importLegacyProduct, productSchema } from '@emporium/domain';
import { createDatabase, exportCatalog, getActiveDraft } from '@emporium/database';

export const adminDatabaseUrl = () => process.env.ADMIN_DATABASE_URL || process.env.DATABASE_URL;
export const adminDatabase = () => createDatabase(adminDatabaseUrl());

export async function readCatalog(types = []) {
  const catalog = await exportCatalog(adminDatabase());
  return types.length ? catalog.filter((product) => types.includes(product.type)) : catalog;
}

export function legacyEnvelope(product) {
  return { id: product.id, type: product.type, slug: product.slug, version: product.version, legacy: exportLegacyProduct(product) };
}

export async function buildDraftPayload({ type, legacy, productId = null, draftItemId = null }) {
  if (!['cigar', 'tobacco'].includes(type)) throw new Error('Only cigar and tobacco administration is enabled');
  const mapped = importLegacyProduct(type, legacy);
  if (!mapped.success) return { errors: mapped.errors };
  const catalog = await readCatalog([type]);
  const existing = productId ? catalog.find((product) => product.id === productId) : null;
  if (productId && !existing) return { notFound: true };
  const draft = await getActiveDraft(adminDatabase());
  const draftItem = draftItemId ? draft?.items.find((item) => item.id === draftItemId && item.operation === 'create') : null;
  if (draftItemId && !draftItem) return { draftNotFound: true };
  let payload = mapped.data;
  if (existing) {
    payload = { ...payload, id: existing.id, version: existing.version, createdAt: existing.createdAt, updatedAt: existing.updatedAt, publishedAt: existing.publishedAt };
    if (type === 'cigar') payload.variants = payload.variants.map((variant, index) => ({ ...variant, id: existing.variants[index]?.id || randomUUID() }));
  }
  if (draftItem) {
    payload = { ...payload, id: draftItem.payload.id, version: draftItem.payload.version, createdAt: draftItem.payload.createdAt, updatedAt: draftItem.payload.updatedAt, publishedAt: draftItem.payload.publishedAt };
    if (type === 'cigar') payload.variants = payload.variants.map((variant, index) => ({ ...variant, id: draftItem.payload.variants[index]?.id || randomUUID() }));
  }
  payload = productSchema.parse(payload);
  const occupied = new Map(catalog.filter((product) => product.id !== payload.id).map((product) => [product.slug, product.id]));
  for (const item of draft?.items ?? []) if (item.payload && item.draftKey !== (draftItem?.draftKey || payload.id)) occupied.set(item.payload.slug, item.draftKey);
  if (occupied.has(payload.slug)) return { slugConflict: true };
  return { payload, existing, draftItem, warnings: mapped.warnings };
}

export async function describeDraft() {
  const database = adminDatabase(); const draft = await getActiveDraft(database);
  if (!draft) return null;
  const catalog = await exportCatalog(database); const byId = new Map(catalog.map((product) => [product.id, product]));
  return {
    ...draft,
    items: draft.items.map((item) => {
      const before = item.productId ? byId.get(item.productId) ?? null : null;
      return { ...item, before, beforeLegacy: before ? exportLegacyProduct(before) : null, afterLegacy: item.payload ? exportLegacyProduct(item.payload) : null };
    }),
  };
}
