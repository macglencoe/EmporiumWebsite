# Phase 9: Public database reads and revalidation

Phase 9 converts every public catalog surface from direct JSON imports to one server-only source adapter while preserving the existing presentation and legacy-shaped component contracts.

## Result

- `DATA_SOURCE=json` remains the safe default and compatibility fallback.
- `DATA_SOURCE=database` reads through the read-only Neon credential in `PUBLIC_DATABASE_URL`.
- Database mode queries only the eight security-barrier `public_*` views. Hidden and unpublished products are excluded by the database role boundary.
- Cigars, pipe tobacco, pipes, coffee and tea, homepage features and arrivals, filter pages, and sitemap routes use the shared adapter.
- Catalog, homepage, filter, and product pages use five-minute ISR by default. Override with `PUBLIC_REVALIDATE_SECONDS`.
- Cigar and tobacco product routes use `fallback: "blocking"`, allowing newly published routes without a full build. Missing, hidden, and unpublished products return 404.
- `/sitemap.xml` is generated without caching from currently visible database records and no longer depends on checked-in generated XML.
- `/api/revalidate` accepts signed, local-only path batches. Admin publication revalidates affected product, catalog, filter, and homepage paths; the uncached sitemap needs no purge.
- Revalidation failures are reported as warnings after publication; they do not roll back committed catalog data.

## Configuration

Public deployment:

```text
DATA_SOURCE=database
PUBLIC_DATABASE_URL=<read-only login granted emporium_reader>
REVALIDATION_SECRET=<at least 32 random characters>
PUBLIC_REVALIDATE_SECONDS=300
SITE_URL=https://kingstreetemporium.com
```

Admin deployment:

```text
PUBLIC_SITE_URL=https://kingstreetemporium.com
REVALIDATION_SECRET=<same secret as public deployment>
```

Keep `DATA_SOURCE=json` available through cutover and comparison testing.

## Verification

```bash
DATA_SOURCE=json npm run build:public
DATA_SOURCE=database PUBLIC_DATABASE_URL=... npm run build:public
npm test
npm run lint
```

Before cutover, compare normalized exports for all four product types and manually verify a create, rename, hide, unhide, and delete publication. Confirm new routes appear without rebuilding and hidden or unpublished routes return 404.

The 2026-10-14 development comparison matched tobacco (70), pipe (14), and caffeine (27) slugs exactly. The database had 550 visible cigars versus 548 in JSON; the only additional database slugs were the two retained `test-brand-test-cigar` Phase 7 verification records.
