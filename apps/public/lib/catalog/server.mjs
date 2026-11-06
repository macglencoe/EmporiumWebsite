import { exportLegacyProduct } from '@emporium/domain';
import { exportPublicCatalog } from '@emporium/database/catalog';
import fs from 'node:fs/promises';

export const PUBLIC_REVALIDATE_SECONDS = Number(process.env.PUBLIC_REVALIDATE_SECONDS || 300);
const TYPES = ['cigar', 'tobacco', 'pipe', 'caffeine'];

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

async function databaseCatalog(type) {
  const connectionString = process.env.PUBLIC_DATABASE_URL;
  if (!connectionString) throw new Error('PUBLIC_DATABASE_URL is required when DATA_SOURCE=database');
  const products = await exportPublicCatalog(connectionString);
  return products.filter((product) => product.type === type).map(exportLegacyProduct);
}

export async function readPublicCatalog(type) {
  if (!TYPES.includes(type)) throw new Error(`Unsupported public product type: ${type}`);
  return dataSource() === 'database' ? databaseCatalog(type) : jsonCatalog(type);
}

export async function readPublicProduct(type, slug) {
  return (await readPublicCatalog(type)).find((product) => product.slug === slug) ?? null;
}

export async function publicCatalogProps(type) {
  return { props: { data: await readPublicCatalog(type) }, revalidate: PUBLIC_REVALIDATE_SECONDS };
}

export async function publicProductPaths(type) {
  if (dataSource() === 'database') return { paths: [], fallback: 'blocking' };
  const data = await readPublicCatalog(type);
  return { paths: data.map(({ slug }) => ({ params: { slug } })), fallback: 'blocking' };
}
