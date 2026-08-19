# Phase 2 Monorepo Implementation

Completed on 2026-08-19 on `migration/admin-neon`.

## Result

The repository is now an npm-workspace monorepo orchestrated with Turborepo:

| Workspace | Purpose | Source |
| --- | --- | --- |
| `@emporium/public` | Current public storefront | Production `main` snapshot |
| `@emporium/admin` | Current staff interface | Active `cms` branch snapshot |
| `@emporium/ui` | Placeholder for shared visual components | New |
| `@emporium/config` | Placeholder for shared configuration | New |

The application extraction did not introduce Neon or change either application's content source. The admin application retains the existing GitHub API, static JSON, Vercel Blob, and tablet `localStorage` behavior so the active store deployment can continue operating during development.

## Root commands

| Task | Public | Admin | All workspaces |
| --- | --- | --- | --- |
| Develop | `npm run dev:public` | `npm run dev:admin` | — |
| Build | `npm run build:public` | `npm run build:admin` | `npm run build` |
| Lint | `npm run lint:public` | `npm run lint:admin` | `npm run lint` |
| Test | `npm run test:public` | `npm run test:admin` | `npm test` |

The public development server uses port 3000. The admin development server uses port 3001, allowing both to run simultaneously.

## Workspace compatibility

Both Next.js applications enable the Next 12 `externalDir` and `outputFileTracingRoot` experimental options. This permits future imports from `packages/*` and ensures files outside an individual app directory can be included in deployment output tracing. The shared packages are intentionally empty placeholders in this phase; extracting domain behavior begins in Phase 3.

## Verification performed

- `npm run build:public` completed successfully and generated 644 static pages.
- `npm run build:admin` completed successfully and generated 1,906 static pages, including the active add, edit, delete, barcode-search, submit, export, and API routes.
- `npm run dev:public` served the public home page with HTTP 200 on port 3000.
- `npm run dev:admin` served the admin home page with HTTP 200 on port 3001.
- `npm run lint` completed successfully with inherited warnings.
- `npm test` completed successfully; no automated tests existed in either source application, so both currently report zero tests.

The builds emit warnings inherited from the source branches, including malformed double-slash filter links, oversized static page data, missing React list keys, conditional Hook usage in the admin interface, and outdated Browserslist data. Phase 2 records these as baseline technical debt rather than mixing behavior changes into the repository restructure.

The workspace install also reports 74 dependency vulnerabilities (14 low, 22 moderate, 33 high, and 5 critical) in the legacy dependency tree. Resolving them safely requires the separately planned framework and dependency upgrade; an automated forced upgrade was not applied during the structural migration.

## Deployment boundary

No production deployment setting is changed by this branch. At a later deployment step, configure the public Vercel project root as `apps/public` and the new admin Vercel project root as `apps/admin`. Keep the existing CMS deployment active until the final content freeze, database import, verification, and cutover described in the project plan.
