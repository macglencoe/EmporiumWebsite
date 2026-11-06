# Phase 1 Reconciliation Report

## Status

**Phase 1 complete:** 2026-08-18
**Integration branch:** `migration/admin-neon`

This report reconciles the production `main` branch with the active `cms` branch before the monorepo and Neon migration. It records what must be retained, extracted, replaced, deferred, or discarded. The row-by-row classification is in [phase-1-file-disposition.csv](./phase-1-file-disposition.csv).

## Executive Summary

The two branches are separate application snapshots and should not be merged wholesale.

- `main` remains the authoritative public application.
- `cms` is an actively used administrative application and is the authoritative source for existing admin behavior.
- All currently exposed web-admin capabilities are in daily use and must be retained through the migration.
- Cigar and tobacco administration are in scope.
- Pipe and coffee/tea administration are explicitly deferred; their current public browsing behavior remains in scope.
- Git and the committed JSON files remain the production content source until cutover.
- Potential tablet-only drafts do not block development. Before the final import, staff must publish them, editing must be briefly frozen, and the final committed JSON must be imported.
- Public components and assets deleted on `cms` must not be removed from the new public app.
- Admin behavior should be extracted from `cms`, while Git transport, static admin route generation, and browser-only draft storage are replaced in later phases.

## Operational Decisions

The following decisions were confirmed during Phase 1:

| Question | Decision |
| --- | --- |
| Is the current CMS deployment active? | Yes; store staff actively use it. |
| Which admin features must be preserved? | All current web-admin features are used regularly. |
| Could unpublished tablet drafts exist? | Yes. Preserve the current workflow until cutover and perform a final publish/freeze/import. |
| Are pipes and coffee/tea intended to become editable? | Yes eventually, but not in this project. |
| Production source of truth during development | Git-managed JSON on `main` and the active CMS workflow. |
| New application terminology | `admin`, not `cms`. |
| Authentication scope | One secure `store-admin` sign-in, not individual staff accounts. |

### Tablet draft safeguard

Unpublished changes exist only in browser `localStorage` and cannot be recovered from Git. Until cutover:

- do not clear site data on the store tablet;
- avoid replacing or resetting the tablet without exporting or publishing drafts;
- publish changes regularly where operationally practical;
- do not retire the current CMS deployment early;
- at cutover, publish outstanding drafts before the final JSON import.

A pre-cutover checklist must explicitly verify that the admin diff/submit screen is clean after the last publication.

## Branch Baseline

| Item | Value |
| --- | --- |
| `main` commit | `63e5fc72dd79ac2748bd48d8fde920444a9285cf` |
| `cms` commit | `435d3635b41277ce08b89b43c4a7bd1830ac8623` |
| Merge base | `7a1a01c07ac92321fc88a0636e0f5143a3087b26` |
| Commits unique to `main` | 358 |
| Commits unique to `cms` | 552 |
| Tracked files on `main` | 123 |
| Tracked files on `cms` | 172 |
| Files changed between branch heads | 142 |

The branches have enough independent history and cross-cutting changes that a direct merge would combine public redesign decisions, admin behavior, deleted assets, experimental files, and generated output with no reliable ownership boundary.

## Build Baseline

Both branch snapshots were installed with `npm ci` and built using Node 22.13.0 and npm 10.9.2.

| Snapshot | Result | Generated pages | Dependency audit |
| --- | --- | ---: | ---: |
| `main` | Successful production build | 644 | 73 vulnerabilities: 14 low, 21 moderate, 33 high, 5 critical |
| `cms` | Successful production build | 1,906 | 75 vulnerabilities: 15 low, 22 moderate, 33 high, 5 critical |

Existing build conditions recorded for later work:

- `next.config.js` contains an invalid root-level `getStaticProps` option.
- Both builds emit many malformed double-slash route warnings.
- Catalog payloads exceed Next.js's 128 kB page-data warning threshold.
- The admin build statically generates product, edit, and delete pages for nearly the entire catalog.
- The admin build logs complete product objects, creating extremely noisy logs and potentially exposing catalog details in build output.
- Browser compatibility metadata and several dependencies are outdated.
- Dependency remediation and framework modernization belong to later phases unless a vulnerability blocks deployment.

The successful builds establish that both current snapshots are extractable. Warnings are baseline defects, not Phase 1 regressions.

## Public Feature Inventory

The public application should begin from `main`.

| Area | Current capability | Disposition |
| --- | --- | --- |
| Homepage | Featured content, new arrivals, brand and store presentation | Keep from `main`; later replace JSON reads with public database queries. |
| Cigars | Catalog, filters, sorting, pagination, brand/size/strength/wrapper pages, product pages | Keep from `main`; preserve behavior during data-source conversion. |
| Pipe tobacco | Catalog, brand/component/family pages, product pages | Keep from `main`; preserve behavior during data-source conversion. |
| Pipes | Catalog, brand/material/type pages | Keep from `main`; review the `cms` pipe-detail route as a possible public enhancement. |
| Coffee and tea | Catalog, origin and roast pages | Keep from `main`; administration is deferred. |
| Store content | About, contact, privacy, location/contact utilities | Keep from `main`; selectively review later `cms` presentation changes. |
| Age verification | Public modal loaded through `_app` | Keep from `main`; it was deleted on `cms`. |
| Search/filter landing links | Generated query links | Keep behavior but repair malformed double-slash URLs later. |
| SEO | Static sitemap generation | Regenerate from the public app; do not manually merge generated XML. |
| Compatibility routes | Legacy pages such as `about-us`, `contact-us`, and other small redirect-like pages | Keep until their production purpose is verified. |

## Active Admin Feature Inventory

The target `apps/admin` application must retain the following behavior from `cms`.

| Capability | Current implementation | Target treatment |
| --- | --- | --- |
| Admin dashboard | Git commit history, issue lookup, deployment/version information, wiki links | Retain a useful dashboard, replacing Git synchronization status with database publication/audit status. |
| Cigar catalog management | Admin-aware catalog with filters, change status, schema rendering, and toolbar actions | Extract into `apps/admin`. |
| Cigar create/edit/delete | Static routes, schema forms, `localStorage` drafts | Preserve UX; replace static paths and browser-only storage with database records and drafts. |
| Tobacco catalog management | Admin-aware catalog with change status | Extract into `apps/admin`. |
| Tobacco create/edit/delete | Static routes, schema forms, `localStorage` drafts | Preserve UX; replace storage and routing implementation. |
| Barcode search | Barcode scanning/search plus barcodeless results | Extract into `apps/admin`; query typed variant rows in Neon later. |
| Dense cigar view | Compact operational catalog | Extract into `apps/admin`. |
| Draft comparison | Origin/temp arrays merged by client IDs | Preserve review behavior; replace with change sets and stable database IDs. |
| Submit/publish | JSON diff, confirmation, Git commit to configured branches | Preserve review and confirmation; replace with a transactional publish operation. |
| Export | Browser export of cigar and tobacco datasets plus metadata | Preserve; export authoritative database data after cutover. |
| Image upload/delete | Vercel Blob through multiple API endpoints | Preserve Vercel Blob; consolidate into one authenticated server API. |
| Suggestions/schema-driven inputs | UI schemas, schema mapper, input widgets, suggestions | Extract and reconcile into shared domain validation and admin form configuration. |
| Data refresh/version detection | Git commit polling and SHA comparison | Replace with database versions and publication history. |
| Confirmation audio | `areyousure.mp3` on the submit screen | Retain during extraction because it is referenced by an active workflow; reassess only during an explicit UX change. |

### Explicitly deferred admin work

The current admin snapshot only browses pipe and caffeine data; it does not provide equivalent production-ready CRUD workflows for them. Creating pipe and coffee/tea administration is out of scope for this migration. The database model should leave room for it, but Phase 7 only has to deliver cigar and tobacco administration.

## Integration and Data-Flow Inventory

### GitHub coupling

The active admin workflow uses:

- `GITHUB_TOKEN`;
- GitHub commit-list endpoints;
- the GitHub Contents API for whole-file reads and writes;
- branch selection through public environment variables;
- Git SHAs as synchronization and deployment markers;
- GitHub issue lookup for dashboard information.

Relevant endpoints:

- `pages/api/commits.js`
- `pages/api/getCommits.js` — duplicate/unreferenced
- `pages/api/files/[...path].js`
- `pages/api/getIssue.js`

These endpoints should be extracted only long enough to keep the current deployment operational. They do not belong in the final admin app.

### Browser storage coupling

Sixteen source files reference `localStorage`. It currently holds:

- temporary cigar and tobacco arrays;
- origin cigar and tobacco arrays;
- client-generated IDs;
- loaded Git SHA and commit-message metadata.

This storage is the reason tablet-only unpublished changes can exist. Its behavior maps to database-backed drafts and change sets.

### Vercel Blob coupling

Four files import `@vercel/blob`. There are three overlapping image API routes:

- `pages/api/images.js`
- `pages/api/uploadImage.js`
- `pages/api/deleteImage.js`

`pages/api/images.js` is the actively consumed combined endpoint. The other two have no discovered source consumers and should be retired during consolidation.

### Environment-variable names

No values were read or recorded.

Public `main`:

- `SITE_URL`

Active `cms`:

- `BLOB_READ_WRITE_TOKEN`
- `GITHUB_TOKEN`
- `NEXT_PUBLIC_BASE_BRANCH`
- `NEXT_PUBLIC_COMMIT_MESSAGE_PREFIX`
- `NEXT_PUBLIC_COMMIT_TO`
- `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`
- `SITE_URL`
- `VERCEL_GIT_COMMIT_MESSAGE`
- `VERCEL_GIT_COMMIT_SHA`

The `NEXT_PUBLIC_*` branch and commit variables are legacy workflow configuration. They should disappear when Neon publication replaces Git synchronization.

## Data Reconciliation

### Branch agreement

| File | Comparison |
| --- | --- |
| `consolidated_cigars.json` | Identical on `main` and `cms` |
| `tobacco.json` | Identical on `main` and `cms` |
| `pipes.json` | Identical on `main` and `cms` |
| `cigarsizes.json` | Identical on `main` and `cms` |
| `caffeine.json` | Different |

The `cms` copy of `caffeine.json` removes:

- Cultivate Sumatra
- Cultivate Honduras
- Cultivate Decaf

Because `main` is the production public source and caffeine administration is out of scope, retain the `main` records unless a later business review explicitly removes them.

### Catalog metrics

| Metric | Value |
| --- | ---: |
| Cigars | 551 |
| Cigar variants/size entries | 750 |
| Hidden cigars | 3 |
| Cigars with stored image URLs | 0 |
| Tobacco products | 70 |
| Pipes | 14 |
| Coffee and tea products on `main` | 27 |
| Coffee and tea products on `cms` | 24 |
| Duplicate cigar slugs | 0 |
| Duplicate barcode values | 3 |
| Cigar variants missing a size label | 8 |
| Non-numeric populated cigar prices | 0 |

The earlier 24-item caffeine baseline came from `cms`; reconciliation establishes that production `main` contains 27 and is authoritative.

### Schema drift

The strict cigar schema does not declare five fields present in actual records and in the UI schema:

- `hidden`
- `featured_Eds_Pick`
- `featured_Teds_Pick`
- `featured_StickFigures`
- `image`

Because the strict schema also sets `additionalProperties: false`, valid production records cannot satisfy it as written. Phase 3 must build the canonical schema from actual production data plus intended UI behavior rather than adopting either schema file unchanged.

### Duplicate barcode review

Three barcode values occur on more than one variant:

| Barcode | First product | Second product |
| --- | --- | --- |
| `843182122111` | `arturo-fuente-don-carlos-eye-of-the-bull` | `arturo-fuente-eye-of-the-bull` |
| `843182122630` | `arturo-fuente-hemingway-signature-maduro` | `arturo-fuente-signature-maduro` |
| `7460644702709` | `la-flor-dominicana-cabinet-oscuro-l-300` | `la-flor-dominicana-l300-natural` |

Do not add a database uniqueness constraint to barcode values until these duplicates are reviewed. Some may be duplicate product records; others may represent legitimate shared codes or data-entry errors.

### Missing variant labels

Eight cigar variants have no `Size` value. They occur under:

- `esteban-carrera-cashmere` — two variants
- `esteban-carrera-esteban-carrera-mr-brownstone`
- `j-c-newman-decision-550`
- `j-c-newman-don-jose-granada`
- `j-c-newman-don-jose-grandee`
- `joya-de-nicaragua-robusta`
- `gurkha-volition-america-maduro`

The importer must report rather than silently discard these variants. Data cleanup can occur before a non-null size constraint is enforced.

## Asset Reconciliation

The `cms` branch deletes public assets still consumed by `main`:

| Asset | Production consumer |
| --- | --- |
| `arturo-fuente-stack.jpg` | Cigar catalog |
| `double-ligeros.jpg` | Cigar catalog |
| `humidor-side.jpg` | Cigar catalog and new arrivals |
| `chupa-cabras.jpg` | Brand showcase |
| `premium-cigars.jpg` | Featured section |
| `tobacco-jars.jpg` | Tobacco catalog |
| `tobacco-tins.jpg` | Tobacco catalog |
| `website-bg.jpg` | About page |

These assets must remain in `apps/public/public`.

The `cms` branch also deletes public components still imported by `main`, including age verification, basic content sections, brand cards/showcase, cigar cards, staff content, and title presentation. Their deletion is not transferable to the public app.

Admin-only asset findings:

- Keep `areyousure.mp3` during extraction because `pages/submit.js` references it.
- No source reference was found for `a_a_a.mp3` or `areyousure.jpg`; classify them as discard candidates.
- Regenerate sitemap XML rather than merging it.
- Do not carry committed `cli/__pycache__` output into the monorepo.

## Dependency Reconciliation

Admin-specific dependencies added on `cms` include:

- `@vercel/blob`
- `browser-image-compression`
- `formidable`
- `diff`
- `@hookform/resolvers`
- `react-hook-form`
- `zod`

These should move to the smallest owning workspace rather than the monorepo root.

The branches also use incompatible Tailwind major versions:

- `main`: Tailwind 4-related packages
- `cms`: Tailwind 3.4

Do not force a styling upgrade during extraction. Each app may temporarily own its working configuration until shared configuration is proven safe.

## File Disposition Summary

All 142 changed paths are classified in the CSV.

| Disposition | Files |
| --- | ---: |
| Keep from `main` | 26 |
| Extract directly into admin | 28 |
| Split public and admin behavior | 22 |
| Rebuild for monorepo configuration | 10 |
| Keep public from `main`, selectively review CMS change | 10 |
| Archive or defer developer tooling | 15 |
| Extract, then replace Git/localStorage implementation | 6 |
| Replace GitHub integration | 4 |
| Extract domain schemas | 4 |
| Extract with review | 3 |
| Discard | 3 |
| Retire duplicate endpoints | 2 |
| Discard unreferenced assets | 2 |
| Extract shared domain behavior | 2 |
| Other single-purpose review/extraction categories | 5 |

The CSV is a migration aid, not permission to bulk-copy or bulk-delete files. “Extract” means preserve behavior while placing it in the correct target and adapting imports.

## Target Ownership Map

### `apps/public`

Start from `main` and retain:

- public pages and compatibility routes;
- public components;
- age verification;
- production imagery and fonts;
- catalog display behavior;
- store information;
- SEO configuration.

Selectively consider `cms` public improvements only after the baseline move is complete.

### `apps/admin`

Extract from `cms`:

- dashboard concepts;
- cigar and tobacco catalogs;
- CRUD forms and routes;
- barcode and dense views;
- draft diff and submit UX;
- export;
- image management;
- toolbars and admin navigation;
- schema-driven form widgets.

Do not carry public marketing pages into admin merely because the current CMS snapshot contains them.

### `packages/domain`

Seed from, but do not blindly copy:

- cigar and tobacco UI schemas;
- strict schema files;
- schema mapper;
- suggestions;
- slug behavior;
- legacy field-name mappings;
- validation and coercion behavior.

### `packages/database`

Later replace:

- GitHub file reads/writes;
- commit polling;
- SHA conflict detection;
- browser-only draft persistence;
- client-generated identity.

### Developer tooling and archives

The Python CLI, batch launchers, broken-cigar fixture, and schema-default script may contain useful diagnostic ideas, but they are not required to reproduce the daily web-admin workflow. Preserve them outside runtime applications until their value is reviewed; do not make them monorepo dependencies by default.

## Risk Register

| Priority | Risk | Mitigation |
| --- | --- | --- |
| High | Tablet-only drafts are lost before cutover | Keep current CMS live, do not clear site data, publish regularly, and require a clean final diff before import. |
| High | A direct branch merge deletes public assets/components | Build public from `main` and use the file-disposition inventory for selective extraction. |
| High | Admin behavior is lost while replacing Git | Treat all existing web-admin features as acceptance requirements and change transport independently from UX. |
| High | Schema constraints reject real production data | Build Phase 3 schemas from actual data, report anomalies, and add constraints incrementally. |
| Medium | Duplicate barcodes break proposed uniqueness | Review the three duplicate values before adding a unique index. |
| Medium | Static admin route generation becomes slower or fails | Admin routes should query records dynamically after extraction. |
| Medium | Styling breaks because Tailwind versions differ | Keep app-level styling configuration initially; consolidate later. |
| Medium | Image endpoints permit unsafe or inconsistent deletion | Consolidate behind authenticated server validation and reference checks. |
| Medium | Git remains writable after Neon cutover and creates split-brain data | Freeze legacy publishing, remove Git credentials after observation, and clearly designate Neon as authoritative. |
| Low | Developer CLI tools are lost | Archive/defer them and review independently from runtime migration. |

## Phase 2 Inputs

Phase 2 can proceed without further product decisions. It should use this extraction rule:

1. Move the unchanged production application from `main` into `apps/public`.
2. Prove its build and behavior before importing admin code.
3. Create `apps/admin` and extract active admin routes/components from `cms`.
4. Keep Git/JSON/localStorage transport working temporarily in the extracted admin app.
5. Do not introduce Neon behavior until both apps build independently.
6. Keep the active production CMS deployment untouched throughout this work.

## Phase 1 Exit Criteria

- [x] Features unique to `main` and `cms` were inventoried.
- [x] All 142 changed paths received a disposition.
- [x] Active admin workflows and integration points were traced.
- [x] Public assets/components at risk of accidental deletion were identified.
- [x] Dataset agreement, divergence, and known anomalies were recorded.
- [x] Environment-variable names were recorded without reading secrets.
- [x] Both branch snapshots were proven buildable.
- [x] Operational scope was confirmed with the owner.
- [x] Tablet-draft handling and final synchronization were defined.
- [x] Pipes and coffee/tea administration were explicitly deferred.

Phase 1 does not change production runtime behavior.
