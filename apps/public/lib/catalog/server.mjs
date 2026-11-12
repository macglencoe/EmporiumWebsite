import { exportLegacyProduct } from '@emporium/domain';
import { exportPublicCatalog, findPublicProduct, listPublicSitemapSlugs } from '@emporium/database/catalog';
import fs from 'node:fs/promises';

export const PUBLIC_REVALIDATE_SECONDS = Number(process.env.PUBLIC_REVALIDATE_SECONDS || 3600);
export const PUBLIC_SITEMAP_CACHE_TAG = 'public-catalog-sitemap';
const TYPES = ['cigar', 'tobacco', 'pipe', 'caffeine'];
const PRODUCT_NAME_FIELDS = { cigar: 'Cigar Name', tobacco: 'Tobacco Name' };

export function dataSource(environment = process.env) {
  const value = environment.DATA_SOURCE || 'json';
  if (!['json', 'database'].includes(value)) throw new Error('DATA_SOURCE must be json or database');
  return value;
}

async function jsonCatalog(type) {
  const files = {
    cigar: 'consolidated_cigars.json',
    tobacco: 'tobacco.json',
    pipe: 'pipes.json',
    caffeine: 'caffeine.json',
  };
  const data = JSON.parse(await fs.readFile(new URL(`../../public/data/${files[type]}`, import.meta.url), 'utf8'));
  return data.filter((item) => !item.hidden);
}

function publicDatabaseUrl() {
  const connectionString = process.env.PUBLIC_DATABASE_URL;
  if (!connectionString) throw new Error('PUBLIC_DATABASE_URL is required when DATA_SOURCE=database');
  return connectionString;
}

export async function readPublicCatalog(type) {
  if (!TYPES.includes(type)) throw new Error(`Unsupported public product type: ${type}`);
  if (dataSource() === 'json') return jsonCatalog(type);
  return (await exportPublicCatalog(publicDatabaseUrl(), type)).map(exportLegacyProduct);
}

export async function readPublicProductPage(type, slug) {
  const nameField = PRODUCT_NAME_FIELDS[type];
  if (!nameField) throw new Error(`Unsupported public product page type: ${type}`);
  if (dataSource() === 'database') {
    const result = await findPublicProduct(publicDatabaseUrl(), type, slug);
    return result && { ...result, product: exportLegacyProduct(result.product) };
  }
  const catalog = await jsonCatalog(type);
  const index = catalog.findIndex((product) => product.slug === slug);
  if (index === -1) return null;
  const neighbor = (item) => item ? { slug: item.slug, name: item[nameField] } : null;
  return { product: catalog[index], prev: neighbor(catalog[index - 1]), next: neighbor(catalog[index + 1]) };
}

export async function readPublicSitemapSlugs() {
  if (dataSource() === 'database') return listPublicSitemapSlugs(publicDatabaseUrl());
  const [cigars, tobacco] = await Promise.all([jsonCatalog('cigar'), jsonCatalog('tobacco')]);
  return [
    ...cigars.map(({ slug }) => ({ type: 'cigar', slug })),
    ...tobacco.map(({ slug }) => ({ type: 'tobacco', slug })),
  ];
}

export async function publicCatalogProps(type) {
  return { props: { data: await readPublicCatalog(type) }, revalidate: PUBLIC_REVALIDATE_SECONDS };
}

export async function publicProductPaths(type) {
  if (dataSource() === 'database') return { paths: [], fallback: 'blocking' };
  const data = await readPublicCatalog(type);
  return { paths: data.map(({ slug }) => ({ params: { slug } })), fallback: 'blocking' };
}
