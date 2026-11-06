# Phase 5: legacy JSON import and verification

Phase 5 uses the checked-in public application JSON as the migration authority. This deliberately retains all 27 public caffeine records; the admin snapshot has only 24 and is not imported.

## Toolchain

- `npm run import:legacy -- --dry-run` validates and reports the complete import without connecting to Neon.
- `npm run import:legacy` atomically reconciles the four managed product types and all owned child rows.
- `npm run verify:import` compares every normalized field, verifies counts and unique slugs, reruns the import, and proves normalized idempotency.
- `npm run export:database -- --output <new-directory>` creates a recovery JSON file for every product type. Existing files are never overwritten.

The import uses deterministic product and cigar-variant UUIDs from `@emporium/domain`. A Neon HTTP batch is one transaction: a failure rolls back product upserts, stale-product reconciliation, child replacement, and child insertion together.

## Baseline

| Product type | Products | Owned child records |
| --- | ---: | ---: |
| Cigars | 551 | 750 variants |
| Tobacco | 70 | 169 components |
| Pipes | 14 | — |
| Caffeine | 27 | — |
| **Total** | **662** | **919** |

The exact source SHA-256 checksums and warning totals are printed by every dry run. Known warnings remain visible rather than being silently repaired, including nullable cigar size labels and duplicate legacy barcodes.

## Safe run procedure

1. Point `DATABASE_URL` in `.env.local` at an isolated migrated Neon branch.
2. Run `npm run import:legacy -- --dry-run` and review errors and warning codes.
3. Run `npm run import:legacy`.
4. Run `npm run verify:import`.
5. Export recovery data into a new directory and retain it with the migration records.

The applications do not consume Neon in this phase. Public and admin runtime cutover remains deferred.
