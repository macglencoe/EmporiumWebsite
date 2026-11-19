# Phase 9: Public database reads and revalidation

Phase 9 converts every public catalog surface from direct JSON imports to one server-only source adapter while preserving the existing presentation and legacy-shaped component contracts.

## Result

- `DATA_SOURCE=json` remains the safe default and compatibility fallback.
- `DATA_SOURCE=database` reads through the read-only Neon credential in `PUBLIC_DATABASE_URL`.
- Database mode queries only the eight security-barrier `public_*` views. Hidden and unpublished products are excluded by the database role boundary.
- Cigars, pipe tobacco, pipes, coffee and tea, homepage features and arrivals, filter pages, and sitemap routes use the shared adapter.
- Catalog, homepage, filter, and product pages use on-demand revalidation and no longer regenerate on a timer. Cached pages are refreshed through publication-triggered or manual revalidation using the admin Public Cache Refresh tool.
- Cigar and tobacco product routes use `fallback: "blocking"`: new uncached product pages are generated on their first request, allowing newly published routes without a full build. Missing, hidden, and unpublished products return 404.
- New deployments may require pages to be generated again as requests arrive.
- `/sitemap.xml` reads visible cigar and tobacco slugs and uses separate 24-hour CDN caching on Vercel with cache-tag invalidation through `PUBLIC_SITEMAP_CACHE_TAG`. Page revalidation does not change its cache duration or invalidation mechanism.
- `/api/revalidate` accepts signed, local-only path batches. Admin publication revalidates affected product pages, their navigation neighbors, catalog and filter pages, and the homepage. Changes to visible product URLs invalidate the sitemap cache.
- Revalidation failures are reported as warnings after publication; they do not roll back committed catalog data.

## Configuration

Public deployment:

```text
DATA_SOURCE=database
PUBLIC_DATABASE_URL=<read-only login granted emporium_reader>
REVALIDATION_SECRET=<at least 32 random characters>
SITE_URL=https://www.kingstreetemporium.com
```

Admin deployment:

```text
PUBLIC_SITE_URL=https://www.kingstreetemporium.com
REVALIDATION_SECRET=<same secret as public deployment>
```

Keep `DATA_SOURCE=json` available through cutover and comparison testing.
Deploy the public project before the admin project so connection checks can use the new revalidation contract. The authenticated `action: 'check'` request to `/api/revalidate` returns `dataSource` and `revalidationMode: 'on-demand'`. The admin validates this mode before displaying **Page revalidation mode: On-demand only**; missing or unsupported modes fail the connection check.

## Verification

```bash
DATA_SOURCE=json npm run build:public
DATA_SOURCE=database PUBLIC_DATABASE_URL=... npm run build:public
npm test
npm run lint
```

Before cutover, compare normalized exports for all four product types and manually verify a create, rename, hide, unhide, and delete publication. Confirm new routes appear without rebuilding and hidden or unpublished routes return 404.

The 2026-10-14 development comparison matched tobacco (70), pipe (14), and caffeine (27) slugs exactly. The database had 550 visible cigars versus 548 in JSON; the only additional database slugs were the two retained `test-brand-test-cigar` Phase 7 verification records.
