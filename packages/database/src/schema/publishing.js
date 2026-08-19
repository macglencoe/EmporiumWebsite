import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { products } from './catalog.js';
import {
  auditAction,
  changeOperation,
  changeSetStatus,
} from './enums.js';

export const changeSets = pgTable(
  'change_sets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    status: changeSetStatus('status').default('draft').notNull(),
    message: text('message'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
  },
  (table) => [
    check('change_sets_message_not_blank', sql`${table.message} is null or length(trim(${table.message})) > 0`),
    index('change_sets_status_updated_idx').on(table.status, table.updatedAt),
  ],
);

export const changeSetItems = pgTable(
  'change_set_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    changeSetId: uuid('change_set_id')
      .notNull()
      .references(() => changeSets.id, { onDelete: 'cascade' }),
    productId: uuid('product_id').references(() => products.id, {
      onDelete: 'restrict',
    }),
    operation: changeOperation('operation').notNull(),
    baseVersion: integer('base_version'),
    payload: jsonb('payload'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check(
      'change_set_items_shape',
      sql`(
        (${table.operation} = 'create' and ${table.productId} is null and ${table.baseVersion} is null and ${table.payload} is not null)
        or (${table.operation} = 'update' and ${table.productId} is not null and ${table.baseVersion} > 0 and ${table.payload} is not null)
        or (${table.operation} = 'delete' and ${table.productId} is not null and ${table.baseVersion} > 0 and ${table.payload} is null)
      )`,
    ),
    index('change_set_items_change_set_idx').on(table.changeSetId),
    index('change_set_items_product_idx').on(table.productId),
  ],
);

export const auditEvents = pgTable(
  'audit_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    changeSetId: uuid('change_set_id').references(() => changeSets.id, {
      onDelete: 'set null',
    }),
    productId: uuid('product_id').references(() => products.id, {
      onDelete: 'set null',
    }),
    actor: text('actor').default('store-admin').notNull(),
    action: auditAction('action').notNull(),
    before: jsonb('before'),
    after: jsonb('after'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check('audit_events_actor_not_blank', sql`length(trim(${table.actor})) > 0`),
    index('audit_events_change_set_idx').on(table.changeSetId),
    index('audit_events_product_created_idx').on(table.productId, table.createdAt),
  ],
);
