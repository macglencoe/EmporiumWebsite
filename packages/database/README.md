# `@emporium/database`

Server-only Neon and Drizzle infrastructure shared by the Emporium public and admin applications.

The package does not connect during import. Call `createDatabase()` with a server-side connection string or `createDatabaseFromEnvironment()` after validating the runtime environment. Never expose a database URL through a `NEXT_PUBLIC_` variable.

## Commands

Run these from the repository root:

```text
npm run db:generate
npm run db:migrate
npm run db:roles
npm run db:check
npm run db:branch:create -- preview-pr-123
```

`db:migrate` applies the ordered SQL files in `migrations`. `db:roles` creates idempotent, non-login capability roles. A Neon login role can be granted exactly one capability role for each deployment:

- public application: `emporium_reader`
- admin application: `emporium_writer`
- CI or migration operator: `emporium_migrator`

The reader can query only the `public_*` views, which filter out hidden and unpublished products. It cannot select from base tables.
