# Phase 4: Neon database foundation

Phase 4 was completed on 2026-08-19 against the development Neon project `king-street-emporium`. Neither application reads from or writes to Neon yet.

## Delivered

- A server-only `@emporium/database` workspace with lazy Neon initialization.
- Drizzle schema definitions and ordered, checked-in SQL migrations.
- Eleven relational tables for catalog data, drafts, publication, and audit history.
- Eight security-barrier `public_*` views that expose only published, non-hidden products.
- Idempotent `emporium_reader`, `emporium_writer`, and `emporium_migrator` capability roles.
- A live verification command for schema objects and grants.
- An optional Neon API script for creating isolated preview branches with read-write endpoints.
- The workspace Node requirement is now 20 or newer because the current Neon serverless driver requires a post-Node-18 runtime.

The capability roles are intentionally `NOLOGIN` group roles. When application-specific Neon login roles are created for deployments, grant each login exactly one capability:

```sql
grant emporium_reader to <public_login_role>;
grant emporium_writer to <admin_login_role>;
grant emporium_migrator to <migration_login_role>;
```

This avoids checking database passwords into source control and keeps deployment identity creation separate from portable schema migrations.

## Schema decisions carried forward from Phase 3

- Cigar variant size is nullable because eight legacy variants are missing it.
- Barcode has an index but is not unique because three duplicate legacy barcode values need reconciliation.
- Price is `numeric(10,2)`, nullable, and constrained to nonnegative values.
- Pipe material is required, matching all validated legacy records.
- Product slug is unique, product version must be positive, and child records cascade deliberately with product deletion.

## Commands

```text
npm run db:generate
npm run db:migrate
npm run db:roles
npm run db:check
```

`db:migrate` and `db:roles` are idempotent. On the development database, they were each run twice and `db:check` verified 11 tables, 8 public views, and 3 capability roles after both runs.

To create a preview branch after adding a project-scoped Neon API key and project ID to the local or CI environment:

```text
npm run db:branch:create -- preview-pr-123
```

Set `NEON_PARENT_BRANCH_ID` to choose the development branch as the parent. The command creates a copy-on-write branch and a read-write endpoint, and prints only non-secret resource identifiers. Retrieve deployment connection strings through Neon or a future Vercel integration rather than writing them to tracked files.

## Fresh database procedure

1. Create or select an empty Neon branch and set its owner connection as `DATABASE_URL`.
2. Run `npm run db:migrate`.
3. Run `npm run db:roles`.
4. Run `npm run db:check`.
5. Create deployment login roles outside source control and grant the appropriate capability roles.

The next phase can now import legacy JSON transactionally without changing production behavior.
