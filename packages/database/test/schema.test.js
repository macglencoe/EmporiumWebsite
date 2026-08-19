import assert from 'node:assert/strict';
import test from 'node:test';

import { getTableName } from 'drizzle-orm';

import {
  adminAuthEvents,
  adminCredentials,
  adminSessions,
  auditEvents,
  caffeineDetails,
  changeSetItems,
  changeSets,
  cigarDetails,
  cigarVariants,
  pipeDetails,
  productImages,
  products,
  tobaccoComponents,
  tobaccoDetails,
} from '../src/schema/index.js';

test('exports the complete relational schema', () => {
  const tables = [
    adminAuthEvents,
    adminCredentials,
    adminSessions,
    products,
    productImages,
    cigarDetails,
    cigarVariants,
    tobaccoDetails,
    tobaccoComponents,
    pipeDetails,
    caffeineDetails,
    changeSets,
    changeSetItems,
    auditEvents,
  ].map(getTableName);

  assert.deepEqual(tables, [
    'admin_auth_events',
    'admin_credentials',
    'admin_sessions',
    'products',
    'product_images',
    'cigar_details',
    'cigar_variants',
    'tobacco_details',
    'tobacco_components',
    'pipe_details',
    'caffeine_details',
    'change_sets',
    'change_set_items',
    'audit_events',
  ]);
});

test('database clients are initialized lazily', async () => {
  const databaseModule = await import('../src/index.js');

  assert.equal(typeof databaseModule.createDatabase, 'function');
  assert.equal(typeof databaseModule.createDatabaseFromEnvironment, 'function');
});
