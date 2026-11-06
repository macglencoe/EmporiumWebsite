import { neon } from '@neondatabase/serverless';

import { requireDatabaseUrl } from './environment.js';

const sql = neon(requireDatabaseUrl());

const statements = [
  `
  do $$
  begin
    if not exists (select 1 from pg_roles where rolname = 'emporium_reader') then
      create role emporium_reader nologin;
    end if;
    if not exists (select 1 from pg_roles where rolname = 'emporium_writer') then
      create role emporium_writer nologin;
    end if;
    if not exists (select 1 from pg_roles where rolname = 'emporium_migrator') then
      create role emporium_migrator nologin;
    end if;
  end
  $$
  `,
  'revoke all on all tables in schema public from public',
  'revoke all on all sequences in schema public from public',
  'grant usage on schema public to emporium_reader, emporium_writer, emporium_migrator',
  'grant create on schema public to emporium_migrator',
  `grant select on
    public.public_products,
    public.public_product_images,
    public.public_cigar_details,
    public.public_cigar_variants,
    public.public_tobacco_details,
    public.public_tobacco_components,
    public.public_pipe_details,
    public.public_caffeine_details
  to emporium_reader`,
  'grant select, insert, update, delete on all tables in schema public to emporium_writer',
  'grant usage, select on all sequences in schema public to emporium_writer',
  'grant all privileges on all tables in schema public to emporium_migrator',
  'grant all privileges on all sequences in schema public to emporium_migrator',
  `alter default privileges in schema public
    grant select, insert, update, delete on tables to emporium_writer`,
  `alter default privileges in schema public
    grant usage, select on sequences to emporium_writer`,
  `alter default privileges in schema public
    grant all privileges on tables to emporium_migrator`,
  `alter default privileges in schema public
    grant all privileges on sequences to emporium_migrator`,
];

for (const statement of statements) {
  await sql.query(statement);
}

console.log('Database capability roles are configured.');
