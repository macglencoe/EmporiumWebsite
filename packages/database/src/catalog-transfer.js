import { and, asc, inArray, notInArray, sql } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';

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
const dateOnly = (value) => value instanceof Date ? value.toISOString().slice(0, 10) : value ?? null;

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
  return assembleCatalog(base, images, cigars, variants, tobaccos, components, pipes, caffeine);
}

const camelize = (row) => Object.fromEntries(Object.entries(row).map(([key, value]) => [key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()), value]));

const publicRelations = [
  ['images', 'public_product_images'],
  ['cigars', 'public_cigar_details', 'cigar'],
  ['variants', 'public_cigar_variants', 'cigar'],
  ['tobaccos', 'public_tobacco_details', 'tobacco'],
  ['components', 'public_tobacco_components', 'tobacco'],
  ['pipes', 'public_pipe_details', 'pipe'],
  ['caffeine', 'public_caffeine_details', 'caffeine'],
];
const publicSnapshot = { isolationLevel: 'RepeatableRead', readOnly: true };

function publicCatalogQueries(query, type, slug) {
  const params = type === undefined ? [] : [type];
  if (slug !== undefined) params.push(slug);
  const filter = params.length === 0 ? '' : params.length === 1 ? ' where type = $1' : ' where type = $1 and slug = $2';
  const scope = filter ? ` where product_id in (select id from public_products${filter})` : '';
  return [
    ['base', query.query(`select * from public_products${filter}`, params)],
    ...publicRelations
      .filter(([, , relationType]) => !type || !relationType || type === relationType)
      .map(([key, view]) => [key, query.query(`select * from ${view}${scope}`, params)]),
  ];
}

function assemblePublicCatalog(queries, results) {
  const { base, images, cigars = [], variants = [], tobaccos = [], components = [], pipes = [], caffeine = [] } =
    Object.fromEntries(queries.map(([key], index) => [key, results[index].map(camelize)]));
  base.sort((a, b) => a.type.localeCompare(b.type) || a.slug.localeCompare(b.slug));
  for (const rows of [images, variants, components]) {
    rows.sort((a, b) => a.productId.localeCompare(b.productId) || a.sortOrder - b.sortOrder);
  }
  return assembleCatalog(base, images, cigars, variants, tobaccos, components, pipes, caffeine);
}

export async function exportPublicCatalog(connectionString, type) {
  if (!connectionString) throw new Error('A public Neon connection string is required');
  const query = neon(connectionString);
  const queries = publicCatalogQueries(query, type);
  const results = await query.transaction(queries.map(([, statement]) => statement), publicSnapshot);
  return assemblePublicCatalog(queries, results);
}

function publicNeighborQuery(query, type, slugs) {
  // Public slugs use lowercase ASCII letters, digits, and hyphens. C collation
  // keeps their ordering consistent with the catalog's JavaScript sort.
  return query`
    select previous.slug as previous_slug, previous.name as previous_name,
           following.slug as next_slug, following.name as next_name
    from unnest(${slugs}::text[]) as anchor(slug)
    left join lateral (
      select slug, name from public_products
      where type = ${type} and slug collate "C" < anchor.slug collate "C"
      order by slug collate "C" desc limit 1
    ) as previous on true
    left join lateral (
      select slug, name from public_products
      where type = ${type} and slug collate "C" > anchor.slug collate "C"
      order by slug collate "C" limit 1
    ) as following on true
  `;
}

export async function findPublicNeighborSlugs(connectionString, type, slugs) {
  if (!slugs.length) return [];
  const rows = await publicNeighborQuery(neon(connectionString), type, slugs);
  return [...new Set(rows.flatMap((row) => [row.previous_slug, row.next_slug]).filter(Boolean))];
}

export async function findPublicProduct(connectionString, type, slug) {
  const query = neon(connectionString);
  const queries = publicCatalogQueries(query, type, slug);
  const results = await query.transaction([
    ...queries.map(([, statement]) => statement),
    publicNeighborQuery(query, type, [slug]),
  ], publicSnapshot);
  const [product] = assemblePublicCatalog(queries, results);
  if (!product) return null;
  const [{ previous_slug, previous_name, next_slug, next_name }] = results[queries.length];
  return {
    product,
    prev: previous_slug ? { slug: previous_slug, name: previous_name } : null,
    next: next_slug ? { slug: next_slug, name: next_name } : null,
  };
}

export async function listPublicSitemapSlugs(connectionString) {
  const query = neon(connectionString);
  return query`
    select type, slug from public_products
    where type in ('cigar', 'tobacco')
    order by type, slug collate "C"
  `;
}

function assembleCatalog(base, images, cigars, variants, tobaccos, components, pipes, caffeine) {
  const one = (rows) => new Map(rows.map((row) => [row.productId, row]));
  const many = (rows) => rows.reduce((map, row) => map.set(row.productId, [...(map.get(row.productId) ?? []), row]), new Map());
  const cigarById = one(cigars), tobaccoById = one(tobaccos), pipeById = one(pipes), caffeineById = one(caffeine);
  const variantsById = many(variants), componentsById = many(components), imagesById = many(images);

  return base.map((row) => {
    const common = {
      id: row.id, type: row.type, slug: row.slug, name: row.name, brand: row.brand,
      description: row.description, imageUrl: row.imageUrl, hidden: row.hidden, published: row.published,
      dateAdded: dateOnly(row.dateAdded), version: row.version, createdAt: iso(row.createdAt), updatedAt: iso(row.updatedAt), publishedAt: iso(row.publishedAt),
    };
    const primary = (imagesById.get(row.id) ?? []).find((image) => image.isPrimary);
    if ((primary?.url ?? null) !== row.imageUrl) throw new Error(`Primary image mismatch for ${row.slug}`);
    if (row.type === 'cigar') {
      const detail = cigarById.get(row.id); if (!detail) throw new Error(`Missing cigar_details row for ${row.slug}`);
      return { ...common, details: { wrapper: detail.wrapper, binder: detail.binder, filler: detail.filler, flavorProfile: detail.flavorProfile, strength: detail.strength, podcastLink: detail.podcastLink, featured: { edsPick: dateOnly(detail.edsPickAt), tedsPick: dateOnly(detail.tedsPickAt), stickFigures: dateOnly(detail.stickFiguresAt) } }, variants: (variantsById.get(row.id) ?? []).map(({ id, size, barcode, inStock, price }) => ({ id, size, barcode, inStock, price: price === null ? null : Number(price).toFixed(2) })) };
    }
    if (row.type === 'tobacco') { const detail = tobaccoById.get(row.id); if (!detail) throw new Error(`Missing tobacco_details row for ${row.slug}`); return { ...common, details: { family: detail.family, saleForm: detail.saleForm, components: (componentsById.get(row.id) ?? []).map((item) => item.component) } }; }
    if (row.type === 'pipe') { const detail = pipeById.get(row.id); if (!detail) throw new Error(`Missing pipe_details row for ${row.slug}`); return { ...common, details: { material: detail.material, pipeType: detail.pipeType } }; }
    const detail = caffeineById.get(row.id); if (!detail) throw new Error(`Missing caffeine_details row for ${row.slug}`);
    return { ...common, details: { roast: detail.roast, origin: detail.origin, caffeineType: detail.type } };
  });
}
