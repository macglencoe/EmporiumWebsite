import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  date,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import {
  caffeineType,
  cigarStrength,
  productType,
  tobaccoSaleForm,
} from './enums.js';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
};

export const products = pgTable(
  'products',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    type: productType('type').notNull(),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    brand: text('brand'),
    description: text('description'),
    imageUrl: text('image_url'),
    hidden: boolean('hidden').default(false).notNull(),
    published: boolean('published').default(false).notNull(),
    dateAdded: date('date_added'),
    version: integer('version').default(1).notNull(),
    ...timestamps,
    publishedAt: timestamp('published_at', { withTimezone: true }),
  },
  (table) => [
    unique('products_slug_unique').on(table.slug),
    check('products_slug_not_blank', sql`length(trim(${table.slug})) > 0`),
    check('products_name_not_blank', sql`length(trim(${table.name})) > 0`),
    check('products_description_length', sql`${table.description} is null or length(${table.description}) <= 2000`),
    check('products_version_positive', sql`${table.version} > 0`),
    index('products_type_idx').on(table.type),
    index('products_brand_idx').on(table.brand),
    index('products_visibility_idx').on(table.type, table.published, table.hidden),
    index('products_date_added_idx').on(table.dateAdded),
  ],
);

export const productImages = pgTable(
  'product_images',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    altText: text('alt_text'),
    sortOrder: integer('sort_order').default(0).notNull(),
    isPrimary: boolean('is_primary').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique('product_images_product_url_unique').on(table.productId, table.url),
    uniqueIndex('product_images_one_primary_per_product')
      .on(table.productId)
      .where(sql`${table.isPrimary}`),
    check('product_images_url_not_blank', sql`length(trim(${table.url})) > 0`),
    check('product_images_sort_order_nonnegative', sql`${table.sortOrder} >= 0`),
    index('product_images_product_idx').on(table.productId),
  ],
);

export const cigarDetails = pgTable('cigar_details', {
  productId: uuid('product_id')
    .primaryKey()
    .references(() => products.id, { onDelete: 'cascade' }),
  wrapper: text('wrapper'),
  binder: text('binder'),
  filler: text('filler'),
  flavorProfile: text('flavor_profile'),
  strength: cigarStrength('strength'),
  podcastLink: text('podcast_link'),
  edsPickAt: date('eds_pick_at'),
  tedsPickAt: date('teds_pick_at'),
  stickFiguresAt: date('stick_figures_at'),
});

export const cigarVariants = pgTable(
  'cigar_variants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    size: text('size'),
    barcode: text('barcode'),
    inStock: boolean('in_stock').default(false).notNull(),
    price: numeric('price', { precision: 10, scale: 2, mode: 'number' }),
    sortOrder: integer('sort_order').default(0).notNull(),
  },
  (table) => [
    check('cigar_variants_size_not_blank', sql`${table.size} is null or length(trim(${table.size})) > 0`),
    check('cigar_variants_barcode_not_blank', sql`${table.barcode} is null or length(trim(${table.barcode})) > 0`),
    check('cigar_variants_price_nonnegative', sql`${table.price} is null or ${table.price} >= 0`),
    check('cigar_variants_sort_order_nonnegative', sql`${table.sortOrder} >= 0`),
    index('cigar_variants_product_idx').on(table.productId),
    index('cigar_variants_barcode_idx').on(table.barcode),
  ],
);

export const tobaccoDetails = pgTable('tobacco_details', {
  productId: uuid('product_id')
    .primaryKey()
    .references(() => products.id, { onDelete: 'cascade' }),
  family: text('family'),
  saleForm: tobaccoSaleForm('sale_form'),
});

export const tobaccoComponents = pgTable(
  'tobacco_components',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    component: text('component').notNull(),
    sortOrder: integer('sort_order').default(0).notNull(),
  },
  (table) => [
    unique('tobacco_components_product_component_unique').on(
      table.productId,
      table.component,
    ),
    check('tobacco_components_component_not_blank', sql`length(trim(${table.component})) > 0`),
    check('tobacco_components_sort_order_nonnegative', sql`${table.sortOrder} >= 0`),
    index('tobacco_components_product_idx').on(table.productId),
  ],
);

export const pipeDetails = pgTable('pipe_details', {
  productId: uuid('product_id')
    .primaryKey()
    .references(() => products.id, { onDelete: 'cascade' }),
  material: text('material').notNull(),
  pipeType: text('pipe_type'),
});

export const caffeineDetails = pgTable('caffeine_details', {
  productId: uuid('product_id')
    .primaryKey()
    .references(() => products.id, { onDelete: 'cascade' }),
  roast: text('roast'),
  origin: text('origin'),
  type: caffeineType('type').notNull(),
});
