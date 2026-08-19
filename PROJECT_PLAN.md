# EmporiumWebsite Admin and Neon Migration Plan

## Purpose

Convert EmporiumWebsite from two divergent, branch-based Next.js applications into a monorepo containing:

- a public storefront and catalog in `apps/public`;
- a broader administrative interface in `apps/admin`;
- a shared Neon PostgreSQL database;
- shared domain, database, UI, and configuration packages.

The current production site must remain available throughout development. Product content will move from Git-managed static JSON files to Neon without combining the framework upgrade, visual redesign, and data migration into one release.

## Progress

- Phase 1 was completed on 2026-08-18.
- See [`docs/phase-1-reconciliation.md`](docs/phase-1-reconciliation.md) for findings and decisions.
- See [`docs/phase-1-file-disposition.csv`](docs/phase-1-file-disposition.csv) for the classification of all 142 paths changed between `main` and `cms`.

## Terminology

Use **admin** rather than **CMS** for new application, package, deployment, route, and documentation names.

- Application: `apps/admin`
- Package: `@emporium/admin`
- Intended domain: `admin.kingstreetemporium.com`
- Sign-in identity: one `store-admin`

The existing `cms` Git branch remains a historical source from which useful functionality will be selectively extracted. It will not be merged wholesale.

## Current State

### `main`

- Hosts the production public website.
- Uses Next.js 12 and the Pages Router.
- Imports catalog data from JSON during static generation.
- Requires a rebuild for new product routes and updated content.

### `cms`

- Contains the current administrative editing experience alongside a modified copy of the public application.
- Stages changes in browser `localStorage`.
- Compares local and Git commit SHAs for synchronization.
- Writes entire JSON files through the GitHub Contents API.
- Uses Git commits as publishing events, audit history, and version identifiers.
- Uses Vercel Blob for product images.
- Does not provide a dedicated, session-based admin sign-in.

### Legacy datasets

The migration baseline observed during planning is:

| Dataset | Records |
| --- | ---: |
| Cigars | 551 |
| Pipe tobacco | 70 |
| Pipes | 14 |
| Coffee and tea on production `main` | 27 |
| Coffee and tea on `cms` | 24 |

These counts are verification targets, not permanent business constraints.

Cigar and tobacco administration are in scope. Pipe and coffee/tea data must be represented in the database for the public application, but adding admin CRUD workflows for those product types is deferred to a future project.

## Reference Project

`OldMcDonaldsWebsite` is the structural reference for:

- npm workspaces;
- Turborepo task orchestration;
- separate public and admin Next.js applications;
- server-only, lazy Neon connection initialization;
- coordinated database URLs for preview applications;
- parameterized SQL, database constraints, and optimistic concurrency.

EmporiumWebsite will intentionally differ in several areas:

- Neon will be the authoritative catalog content store rather than only an operational store.
- Catalog content will not be split between Statsig, JSON, and Neon.
- Database schema, migrations, and common queries will be centralized.
- Draft publication and audit history will replace Git-based publishing.
- A single, secure `store-admin` sign-in will replace shared Basic Auth without adding unnecessary account management.

## Branch Strategy

Development occurs on the local integration branch:

```text
migration/admin-neon
```

Branch responsibilities:

```text
main
  Production site and production fixes

cms
  Read-only reference for extracting administrative features

migration/admin-neon
  Monorepo, admin, Neon, and public data-source migration
```

Do not merge `cms` into `migration/admin-neon`. Extract useful files and behavior deliberately.

Production fixes should originate from `main`:

1. Create `hotfix/<description>` from `main`.
2. Merge the verified fix into `main`.
3. Merge `main` into `migration/admin-neon`.

Optional milestone branches may be created from the integration branch:

```text
refactor/monorepo-scaffold
feat/domain-model
feat/neon-schema
feat/json-importer
feat/admin-auth
feat/admin-catalog
feat/public-database
```

## Target Repository Structure

```text
EmporiumWebsite/
├─ apps/
│  ├─ public/
│  │  ├─ pages/
│  │  ├─ components/
│  │  └─ public/
│  └─ admin/
│     ├─ pages/
│     ├─ components/
│     └─ middleware.ts
├─ packages/
│  ├─ database/
│  │  ├─ src/
│  │  │  ├─ client.js
│  │  │  ├─ schema/
│  │  │  ├─ queries/
│  │  │  ├─ commands/
│  │  │  └─ publishing/
│  │  └─ migrations/
│  ├─ domain/
│  │  ├─ cigars/
│  │  ├─ tobacco/
│  │  ├─ pipes/
│  │  ├─ caffeine/
│  │  └─ publishing/
│  ├─ ui/
│  └─ config/
├─ scripts/
│  ├─ import-json.js
│  ├─ verify-import.js
│  └─ export-database.js
├─ package.json
├─ package-lock.json
└─ turbo.json
```

Use npm workspaces and Turborepo from the start. Keep the existing Next.js architecture during the initial monorepo and data migration. Upgrade Next.js and React only after the database cutover is stable.

## Deployment Architecture

Use separate Vercel projects for the two applications.

| Project | Application | Database access |
| --- | --- | --- |
| Public website | `apps/public` | Read-only |
| Admin interface | `apps/admin` | Read/write |

Intended production domains:

- `www.kingstreetemporium.com`
- `admin.kingstreetemporium.com`

During development:

- the existing Vercel project continues deploying `main`;
- new public and admin preview projects deploy the integration branch;
- both preview applications point to the same development Neon branch;
- preview applications never receive production database credentials;
- production continues using static JSON until cutover.

Use a development Neon branch such as:

```text
dev/admin-neon-migration
```

## Target Data Model

The relational model should keep filterable, searchable, unique, and financial fields typed. Do not store the entire product catalog solely as JSONB.

### Core tables

```text
products
product_images
cigar_details
cigar_variants
tobacco_details
tobacco_components
pipe_details
caffeine_details
change_sets
change_set_items
audit_events
admin_auth configuration or credentials, if authentication is stored locally
```

### Common product fields

```text
id
type
slug
name
brand
description
image_url
hidden
published
date_added
version
created_at
updated_at
published_at
```

### Important database rules

- Product slugs are unique.
- Non-null barcodes are unique where appropriate.
- Prices are nonnegative numeric values.
- Product variants use foreign keys with deliberate delete behavior.
- Published and hidden status is enforced in public queries.
- Common catalog filters have indexes.
- Writes use optimistic version checks.
- Publishing multiple changes is transactional.

## Shared Domain Model

Create canonical validation and mapping code in `packages/domain`.

Normalize legacy JSON field names internally:

| Legacy field | Canonical field |
| --- | --- |
| `Cigar Name` | `name` |
| `Cigar Brand` | `brand` |
| `Date Added` | `dateAdded` |
| `Strength_Profile` | `strength` |
| `In_Stock` | `inStock` |
| `Price` | `price` |
| `Sizes` | `variants` |

The domain package owns:

- validation schemas;
- slug creation and validation;
- product-type definitions;
- legacy JSON mapping;
- admin form validation;
- change-set validation;
- public result contracts.

Database columns should use conventional names. Legacy field names should survive only at compatibility boundaries during migration.

## Draft and Publishing Model

Preserve the useful review behavior of the existing admin interface without using Git or browser storage as the database.

### Change sets

```text
change_sets
- id
- status: draft | published | discarded
- title or message
- created_at
- published_at

change_set_items
- id
- change_set_id
- product_id, nullable for new products
- operation: create | update | delete
- base_version
- payload jsonb
```

### Audit history

```text
audit_events
- id
- action
- entity_type
- entity_id
- before jsonb
- after jsonb
- change_set_id
- created_at
```

### Publish flow

1. Staff creates or opens a draft change set.
2. Product edits are stored in `change_set_items`.
3. The admin interface displays before-and-after differences.
4. Publication validates the complete change set.
5. Each `base_version` is checked for concurrent edits.
6. All product changes are applied in one transaction.
7. Product versions are incremented.
8. Audit events record the operation, timestamp, and before/after states.
9. The change set is marked published.
10. A signed request invalidates affected public pages.

Failed publication must leave public data unchanged.

## Authentication and Authorization

The admin interface is expected to be used primarily from one store tablet. Use one `store-admin` identity rather than individual employee accounts or role-based access control.

Minimum requirements:

- one normal admin sign-in page;
- a strong password or, preferably, a passkey registered to the store tablet;
- a recovery credential stored securely off-device;
- revocable server-side sessions in secure, HTTP-only cookies;
- failed-attempt rate limiting and temporary lockout;
- authentication checks inside every mutation endpoint;
- explicit logout and credential-rotation procedures;
- a documented lost-tablet and replacement-tablet procedure;
- no database or Blob credentials exposed to browser code;
- no-store caching on sensitive responses.

Do not use browser HTTP Basic Auth as the primary production mechanism. A session-based login provides controlled expiration, logout, recovery, and credential rotation without the overhead of multiple accounts.

Audit history will identify operations as performed by `store-admin`. It will preserve timestamps and before/after values, but it is not intended to attribute changes to individual employees.

## Public Data Strategy

Database-backed does not require every public request to be uncached.

Use:

- server-only Neon queries;
- ISR for catalogs and product pages;
- `fallback: "blocking"` while using the Pages Router;
- targeted, signed revalidation after publication;
- server-side pagination and filtering when warranted.

Publishing should invalidate at least:

- the affected product URL;
- the relevant catalog page;
- affected filter or brand pages;
- the homepage when featured or new-arrival content changes;
- sitemap data when routes change.

Use a temporary server-side feature flag during migration:

```text
DATA_SOURCE=json
DATA_SOURCE=database
```

## Image Strategy

Retain Vercel Blob for product images.

- Consolidate the duplicate upload and deletion APIs.
- Validate MIME type and size on the server.
- Use collision-resistant paths based on product IDs.
- Store image metadata and URLs in Neon.
- Upload a replacement before removing the existing image.
- Delete old images only after a successful database operation.
- Check for other references before deleting shared images.
- Record image changes in the audit history.

## Implementation Phases

### Phase 1: Reconcile the existing branches

- Inventory features unique to `main` and `cms`.
- Classify CMS-branch files as retained admin functionality, retained shared presentation, experiment, duplicate, or generated artifact.
- Identify public assets that must not be lost.
- Document relevant deployment settings and environment-variable names.
- Preserve legacy JSON as migration fixtures.

**Exit criteria:** every important CMS feature and public change has an explicit disposition, and current production remains deployable.

### Phase 2: Establish the monorepo

- Add root npm workspaces and Turborepo.
- Move the public application into `apps/public` without behavioral changes.
- Extract and rename the administrative application into `apps/admin`.
- Create initial shared UI and configuration packages.
- Add independent development, build, lint, and test commands.
- Configure workspace transpilation and output tracing.

**Exit criteria:** both applications run and build independently from the repository root, without requiring Neon.

### Phase 3: Create the shared domain model

- Reconcile actual JSON, JSON Schema, UI Schema, and component expectations.
- Create canonical product validators and types.
- Centralize slug generation.
- Create legacy import and export mappings.
- Replace the design need for `_clientId` and `new-slug` with stable UUIDs and normal updates.

**Exit criteria:** every existing record validates or produces a documented migration warning.

### Phase 4: Add Neon and database migrations

- Add the Neon serverless client.
- Add Drizzle and Drizzle Kit.
- Create the shared server-only database connection.
- Define the relational schema.
- Add ordered, checked-in migrations.
- Create read-only, writer, and migration-owner database roles.
- Configure preview database branching.

**Exit criteria:** a fresh database can be created entirely from repository migrations and access roles are verified.

### Phase 5: Import and verify legacy JSON

- Build an idempotent transactional importer.
- Preserve slugs, prices, barcodes, stock status, images, descriptions, and featured dates.
- Produce warnings for malformed or ambiguous data.
- Create a database-to-JSON exporter.
- Compare normalized exports with the legacy files.

**Exit criteria:** record and variant counts match, slugs are unique, reruns do not duplicate data, and a complete recovery export can be produced.

### Phase 6: Add admin authentication

- Add the single `store-admin` sign-in and server-side session.
- Protect routes and mutation endpoints.
- Add failed-attempt rate limiting, logout, and credential rotation.
- Configure and test the off-device recovery method.
- Document the lost-tablet and replacement-tablet procedure.
- Verify session revocation and expiration.

**Exit criteria:** anonymous users cannot access protected data or operations, the store can revoke a lost tablet, and admin access can be recovered without weakening production security.

### Phase 7: Replace Git-based admin operations

Replace:

| Existing mechanism | Replacement |
| --- | --- |
| Git JSON read | Neon query |
| `localStorage` working arrays | Database-backed drafts |
| `_clientId` | Product UUID |
| Git SHA comparison | Product version comparison |
| Whole-file write | Product-level change-set item |
| Git commit | Publish transaction |
| Commit history | Audit and change-set history |
| Deployment wait | Public revalidation |

Retain add, edit, hide, delete, barcode search, image handling, schema-driven forms, slug preview, diff review, export, and destructive-action confirmations.

**Exit criteria:** admin publishing no longer requires `GITHUB_TOKEN`, drafts work across devices, concurrent edits cannot silently overwrite each other, and publication is atomic.

### Phase 8: Consolidate image handling

- Replace overlapping image endpoints with one module.
- Apply authorization and server validation.
- Store metadata in Neon.
- Make upload, replacement, and deletion failure-safe.

**Exit criteria:** image lifecycle operations are authorized, consistent, and do not destroy the current image on partial failure.

### Phase 9: Convert the public application

Convert data sources in this order:

1. Cigars
2. Pipe tobacco
3. Pipes
4. Coffee and tea
5. Featured products and new arrivals
6. Filter landing pages
7. Sitemap generation

Keep JSON and database sources available behind the server-side feature flag until comparison tests pass.

**Exit criteria:** database-backed pages match legacy behavior, new products appear without a full rebuild, and hidden or unpublished products return 404.

### Phase 10: Production cutover

- Freeze legacy admin publishing briefly.
- Export the final Git/JSON state.
- Run the final production import.
- Verify counts and representative records.
- Enable production database reads for the new public deployment.
- Enable production database writes for the admin deployment.
- Exercise create, edit, rename, hide, publish, delete, image replacement, barcode lookup, and concurrent editing.
- Move production domains only after verification.

**Exit criteria:** Neon is authoritative, public updates no longer require source-control commits, and rollback has been tested.

### Phase 11: Remove legacy infrastructure

After an observation period:

- remove GitHub file-writing and commit-polling endpoints;
- remove `GITHUB_TOKEN`;
- remove SHA synchronization and local origin/temp datasets;
- remove CMS-only identifiers;
- archive runtime JSON as migration fixtures or backups;
- update remaining CMS terminology to admin;
- delete the old `cms` branch only after all useful work is accounted for.

### Phase 12: Modernize Next.js separately

After the data migration is stable:

- upgrade Next.js and React;
- adopt the App Router incrementally;
- use route handlers or server actions where beneficial;
- add modern cache tags and invalidation;
- improve server-side catalog search, filtering, and pagination.

## Testing Strategy

### Domain tests

- Validation rules
- Legacy field mapping
- Slug generation and conflicts
- Price and barcode conversion
- Draft payload validation

### Database tests

- Migrations from an empty database
- Unique constraints and foreign keys
- Public visibility rules
- Publish transaction rollback
- Optimistic version conflicts
- Database-role permissions

### Import tests

- Expected record counts
- Variant counts
- Idempotency
- Normalized JSON round trips
- Malformed-record reporting

### Admin end-to-end tests

- Sign-in, logout, session expiration, and recovery
- Failed-attempt rate limiting
- Lost-tablet session revocation
- Create, edit, hide, delete, and rename
- Draft persistence
- Diff review and publication
- Concurrent edits
- Image lifecycle

### Public end-to-end tests

- Catalogs and product pages
- Filters, sorting, search, and navigation
- Hidden and unpublished records
- Targeted revalidation
- Sitemap output
- 404 behavior

## Cutover and Rollback

Use a blue-green deployment:

1. Keep the existing public Vercel project serving production from `main`.
2. Build new public and admin projects from the migration branch.
3. Test both against a shared development Neon branch.
4. Create and import the production Neon database.
5. Verify the new public deployment on its Vercel URL.
6. Freeze legacy publishing and perform the final import.
7. Merge the migration branch into `main`.
8. Move the production public domain to the verified new deployment.
9. Attach the admin domain.
10. Retain the old public deployment and final JSON export during the observation period.

If database-backed production fails:

1. Move the public domain back to the previous Vercel project or deployment.
2. Disable admin publishing.
3. Switch the public data source back to JSON where applicable.
4. Export Neon changes for reconciliation.
5. Diagnose and repair without losing the legacy production state.

## Recommended Delivery Sequence

1. Branch reconciliation report
2. Monorepo scaffold
3. Public app relocation without behavior change
4. Admin extraction and terminology change
5. Shared domain schemas and legacy mappers
6. Neon schema and migrations
7. Importer, exporter, and verification report
8. Authentication and authorization
9. Cigar admin operations
10. Tobacco admin operations; pipe and caffeine admin CRUD remain deferred
11. Change-set publication and audit history
12. Public cigar database reads
13. Remaining public database reads
14. Production cutover
15. Legacy Git/JSON cleanup
16. Next.js modernization

## First Milestone

The first milestone ends after the importer and verification work:

- the monorepo exists;
- public and admin applications build independently;
- the current public application still behaves as before;
- the shared domain and database packages exist;
- a Neon preview database can be created from migrations;
- legacy JSON can be imported and verified;
- production behavior has not changed.

This provides a reversible foundation before either application depends on Neon in production.

## Definition of Completion

The migration is complete when:

- `apps/public` and `apps/admin` are the maintained applications;
- Neon is the sole authoritative product-data store;
- the admin interface has a secure, recoverable `store-admin` sign-in;
- drafts, publication, conflicts, and audit history are database-backed;
- public catalog updates do not require Git commits or full deployments;
- Vercel Blob image operations are consolidated and authorized;
- production rollback and database export procedures are documented and tested;
- legacy Git-writing and browser-dataset code is removed;
- the old `cms` branch is no longer required for reference.
