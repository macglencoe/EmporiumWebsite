import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const adminCredentials = pgTable('admin_credentials', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  credentialVersion: integer('credential_version').default(1).notNull(),
  failedAttempts: integer('failed_attempts').default(0).notNull(),
  lockedUntil: timestamp('locked_until', { withTimezone: true }),
  passwordChangedAt: timestamp('password_changed_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  check('admin_credentials_username_not_blank', sql`length(trim(${table.username})) > 0`),
  check('admin_credentials_version_positive', sql`${table.credentialVersion} > 0`),
  check('admin_credentials_failed_attempts_nonnegative', sql`${table.failedAttempts} >= 0`),
]);

export const adminSessions = pgTable('admin_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  credentialId: uuid('credential_id').notNull().references(() => adminCredentials.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  credentialVersion: integer('credential_version').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
}, (table) => [
  check('admin_sessions_version_positive', sql`${table.credentialVersion} > 0`),
  index('admin_sessions_credential_idx').on(table.credentialId),
  index('admin_sessions_expiry_idx').on(table.expiresAt),
]);

export const adminAuthEvents = pgTable('admin_auth_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  actor: text('actor').default('store-admin').notNull(),
  action: text('action').notNull(),
  metadata: text('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  check('admin_auth_events_actor_not_blank', sql`length(trim(${table.actor})) > 0`),
  check('admin_auth_events_action_not_blank', sql`length(trim(${table.action})) > 0`),
  index('admin_auth_events_created_idx').on(table.createdAt),
]);
