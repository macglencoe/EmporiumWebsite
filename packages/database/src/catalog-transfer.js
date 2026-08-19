import { and, asc, inArray, notInArray, sql } from 'drizzle-orm';

import {
  caffeineDetails,
  cigarDetails,
  cigarVariants,
  pipeDetails,
  productImages,
  products,
  tobaccoComponents,
  tobaccoDetails,
} from './schema/index.js';

const iso = (value) => value instanceof Date ? value.toISOString() : value ?? null;

export function toDatabaseRows(product) {
  const common = {
    id: product.id,
    type: product.type,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    description: product.description,
    imageUrl: product.imageUrl,
    hidden: product.hidden,
    published: product.published,
    dateAdded: product.dateAdded,
    version: product.version,
    publishedAt: product.published ? sql`now()` : null,
    updatedAt: sql`now()`,
  };
  const result = {
    product: common,
    images: product.imageUrl ? [{ productId: product.id, url: product.imageUrl, altText: product.name, sortOrder: 0, isPrimary: true }] : [],
    cigarDetails: [], cigarVariants: [], tobaccoDetails: [], tobaccoComponents: [], pipeDetails: [], caffeineDetails: [],
  };

  if (product.type === 'cigar') {
    result.cigarDetails.push({
      productId: product.id, wrapper: product.details.wrapper, binder: product.details.binder,
      filler: product.details.filler, flavorProfile: product.details.flavorProfile,
      strength: product.details.strength, podcastLink: product.details.podcastLink,
      edsPickAt: product.details.featured.edsPick, tedsPickAt: product.details.featured.tedsPick,
      stickFiguresAt: product.details.featured.stickFigures,
    });
    result.cigarVariants = product.variants.map((variant, sortOrder) => ({
      id: variant.id, productId: product.id, size: variant.size, barcode: variant.barcode,
      inStock: variant.inStock, price: variant.price, sortOrder,
    }));
  } else if (product.type === 'tobacco') {
    result.tobaccoDetails.push({ productId: product.id, family: product.details.family, saleForm: product.details.saleForm });
    result.tobaccoComponents = product.details.components.map((component, sortOrder) => ({ productId: product.id, component, sortOrder }));
  } else if (product.type === 'pipe') {
    result.pipeDetails.push({ productId: product.id, material: product.details.material, pipeType: product.details.pipeType });
  } else {
    result.caffeineDetails.push({ productId: product.id, roast: product.details.roast, origin: product.details.origin, type: product.details.caffeineType });
  }
  return result;
}

const flatten = (productsToImport) => productsToImport.map(toDatabaseRows).reduce((all, rows) => {
  all.products.push(rows.product);
  for (const key of ['images', 'cigarDetails', 'cigarVariants', 'tobaccoDetails', 'tobaccoComponents', 'pipeDetails', 'caffeineDetails']) all[key].push(...rows[key]);
  return all;
}, { products: [], images: [], cigarDetails: [], cigarVariants: [], tobaccoDetails: [], tobaccoComponents: [], pipeDetails: [], caffeineDetails: [] });

export async function importCatalog(database, catalog, { dryRun = false } = {}) {
  const rows = flatten(catalog);
  if (dryRun) return summarize(rows);
  if (!rows.products.length) throw new Error('Refusing to import an empty catalog');

  const ids = rows.products.map((row) => row.id);
  const statements = [
    database.insert(products).values(rows.products).onConflictDoUpdate({
      target: products.id,
      set: {
        type: sql`excluded.type`, slug: sql`excluded.slug`, name: sql`excluded.name`, brand: sql`excluded.brand`,
        description: sql`excluded.description`, imageUrl: sql`excluded.image_url`, hidden: sql`excluded.hidden`,
        published: sql`excluded.published`, dateAdded: sql`excluded.date_added`, version: sql`excluded.version`,
        updatedAt: sql`now()`, publishedAt: sql`coalesce(${products.publishedAt}, excluded.published_at)`,
      },
    }),
    database.delete(products).where(and(inArray(products.type, ['cigar', 'tobacco', 'pipe', 'caffeine']), notInArray(products.id, ids))),
    database.delete(productImages).where(inArray(productImages.productId, ids)),
    database.delete(cigarDetails).where(inArray(cigarDetails.productId, ids)),
    database.delete(cigarVariants).where(inArray(cigarVariants.productId, ids)),
    database.delete(tobaccoDetails).where(inArray(tobaccoDetails.productId, ids)),
    database.delete(tobaccoComponents).where(inArray(tobaccoComponents.productId, ids)),
    database.delete(pipeDetails).where(inArray(pipeDetails.productId, ids)),
    database.delete(caffeineDetails).where(inArray(caffeineDetails.productId, ids)),
  ];
  const insert = (table, values) => { if (values.length) statements.push(database.insert(table).values(values)); };
  insert(productImages, rows.images);
  insert(cigarDetails, rows.cigarDetails);
  insert(cigarVariants, rows.cigarVariants);
  insert(tobaccoDetails, rows.tobaccoDetails);
  insert(tobaccoComponents, rows.tobaccoComponents);
  insert(pipeDetails, rows.pipeDetails);
  insert(caffeineDetails, rows.caffeineDetails);
  await database.batch(statements);
  return summarize(rows);
}

function summarize(rows) {
  return Object.fromEntries(Object.entries(rows).map(([key, value]) => [key, value.length]));
}

export async function exportCatalog(database) {
  const [base, images, cigars, variants, tobaccos, components, pipes, caffeine] = await Promise.all([
    database.select().from(products).orderBy(asc(products.type), asc(products.slug)),
    database.select().from(productImages).orderBy(asc(productImages.productId), asc(productImages.sortOrder)),
    database.select().from(cigarDetails),
    database.select().from(cigarVariants).orderBy(asc(cigarVariants.productId), asc(cigarVariants.sortOrder)),
    database.select().from(tobaccoDetails),
    database.select().from(tobaccoComponents).orderBy(asc(tobaccoComponents.productId), asc(tobaccoComponents.sortOrder)),
    database.select().from(pipeDetails),
    database.select().from(caffeineDetails),
  ]);
  const one = (rows) => new Map(rows.map((row) => [row.productId, row]));
  const many = (rows) => rows.reduce((map, row) => map.set(row.productId, [...(map.get(row.productId) ?? []), row]), new Map());
  const cigarById = one(cigars), tobaccoById = one(tobaccos), pipeById = one(pipes), caffeineById = one(caffeine);
  const variantsById = many(variants), componentsById = many(components), imagesById = many(images);

  return base.map((row) => {
    const common = {
      id: row.id, type: row.type, slug: row.slug, name: row.name, brand: row.brand,
      description: row.description, imageUrl: row.imageUrl, hidden: row.hidden, published: row.published,
      dateAdded: row.dateAdded, version: row.version, createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt), publishedAt: iso(row.publishedAt),
    };
    const primary = (imagesById.get(row.id) ?? []).find((image) => image.isPrimary);
    if ((primary?.url ?? null) !== row.imageUrl) throw new Error(`Primary image mismatch for ${row.slug}`);
    if (row.type === 'cigar') {
      const detail = cigarById.get(row.id); if (!detail) throw new Error(`Missing cigar_details row for ${row.slug}`);
      return { ...common, details: { wrapper: detail.wrapper, binder: detail.binder, filler: detail.filler, flavorProfile: detail.flavorProfile, strength: detail.strength, podcastLink: detail.podcastLink, featured: { edsPick: detail.edsPickAt, tedsPick: detail.tedsPickAt, stickFigures: detail.stickFiguresAt } }, variants: (variantsById.get(row.id) ?? []).map(({ id, size, barcode, inStock, price }) => ({ id, size, barcode, inStock, price: price === null ? null : Number(price).toFixed(2) })) };
    }
    if (row.type === 'tobacco') { const detail = tobaccoById.get(row.id); if (!detail) throw new Error(`Missing tobacco_details row for ${row.slug}`); return { ...common, details: { family: detail.family, saleForm: detail.saleForm, components: (componentsById.get(row.id) ?? []).map((item) => item.component) } }; }
    if (row.type === 'pipe') { const detail = pipeById.get(row.id); if (!detail) throw new Error(`Missing pipe_details row for ${row.slug}`); return { ...common, details: { material: detail.material, pipeType: detail.pipeType } }; }
    const detail = caffeineById.get(row.id); if (!detail) throw new Error(`Missing caffeine_details row for ${row.slug}`);
    return { ...common, details: { roast: detail.roast, origin: detail.origin, caffeineType: detail.type } };
  });
}
