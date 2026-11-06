# `@emporium/domain`

Shared catalog contracts for the public and admin applications. This package is database-independent and can be used by forms, API handlers, importers, database commands, and public queries.

## Responsibilities

- Canonical discriminated product schemas for cigars, tobacco, pipes, and caffeine products
- Admin-input, public-result, change-set, and change-set-item validation
- Central slug creation, validation, and collision handling
- Deterministic UUIDs for idempotent legacy imports
- Legacy JSON import/export compatibility mappings
- Catalog-level checks for duplicate slugs and barcodes

Canonical objects never contain legacy display keys, `_clientId`, or `new-slug`. Existing route slugs are preserved during import. A generated stable UUID becomes product identity, so later name and slug changes are ordinary updates rather than record replacement.

## Commands

From the repository root:

```powershell
npm run validate:legacy
npm run test --workspace=@emporium/domain
```

The validator checks both application snapshots. Use the JSON output when detailed warning objects are needed:

```powershell
node packages/domain/scripts/validate-legacy-data.js --json
```
