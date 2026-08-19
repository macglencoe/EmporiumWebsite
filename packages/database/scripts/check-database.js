import { neon } from '@neondatabase/serverless';

import { requireDatabaseUrl } from './environment.js';

const sql = neon(requireDatabaseUrl());

const expectedTables = [
  'audit_events',
  'caffeine_details',
  'change_set_items',
  'change_sets',
  'cigar_details',
  'cigar_variants',
  'pipe_details',
  'product_images',
  'products',
  'tobacco_components',
  'tobacco_details',
];

const expectedViews = [
  'public_caffeine_details',
  'public_cigar_details',
  'public_cigar_variants',
  'public_pipe_details',
  'public_product_images',
  'public_products',
  'public_tobacco_components',
  'public_tobacco_details',
];

const tables = await sql.query(
  `select table_name
   from information_schema.tables
   where table_schema = 'public' and table_type = 'BASE TABLE'
   order by table_name`,
);
const views = await sql.query(
  `select table_name
   from information_schema.views
   where table_schema = 'public'
   order by table_name`,
);
const permissions = await sql.query(`
  select
    has_table_privilege('emporium_reader', 'public.products', 'select') as reader_base_table,
    has_table_privilege('emporium_reader', 'public.public_products', 'select') as reader_public_view,
    has_table_privilege('emporium_reader', 'public.products', 'insert') as reader_insert,
    has_table_privilege('emporium_writer', 'public.products', 'select,insert,update,delete') as writer_catalog,
    has_schema_privilege('emporium_writer', 'public', 'create') as writer_create,
    has_schema_privilege('emporium_migrator', 'public', 'create') as migrator_create
`);
const roles = await sql.query(`
  select rolname, rolcanlogin
  from pg_roles
  where rolname in ('emporium_reader', 'emporium_writer', 'emporium_migrator')
  order by rolname
`);

const actualTables = tables.map(({ table_name: name }) => name);
const actualViews = views.map(({ table_name: name }) => name);
const missingTables = expectedTables.filter((name) => !actualTables.includes(name));
const missingViews = expectedViews.filter((name) => !actualViews.includes(name));
const access = permissions[0];
const roleNames = roles.map(({ rolname }) => rolname);

if (missingTables.length || missingViews.length) {
  throw new Error(
    `Database objects are missing: ${[...missingTables, ...missingViews].join(', ')}`,
  );
}

if (
  roleNames.length !== 3 ||
  roles.some(({ rolcanlogin }) => rolcanlogin) ||
  access.reader_base_table ||
  !access.reader_public_view ||
  access.reader_insert ||
  !access.writer_catalog ||
  access.writer_create ||
  !access.migrator_create
) {
  throw new Error(`Database role verification failed: ${JSON.stringify(access)}`);
}

console.log(
  `Verified ${expectedTables.length} tables, ${expectedViews.length} public views, and 3 capability roles.`,
);
