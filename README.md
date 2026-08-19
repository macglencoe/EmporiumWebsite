# King Street Emporium Website

This repository contains the public King Street Emporium website and its administrative interface. It is being migrated from two branch-based applications to a single npm-workspace monorepo.

## Repository layout

- `apps/public` — the production public catalog and storefront
- `apps/admin` — the staff administrative interface extracted from the former `cms` branch
- `packages/ui` — shared UI components as they are extracted
- `packages/config` — shared application configuration
- `docs` — migration findings and implementation notes
- `PROJECT_PLAN.md` — the persistent migration plan

The admin application still uses its existing GitHub, static JSON, Vercel Blob, and browser `localStorage` workflow. Neon will be introduced in later phases; the actively used CMS deployment can remain online until the new system is ready for cutover.

## Local development

Install all workspace dependencies from the repository root:

```powershell
npm install
```

Run the public site at `http://localhost:3000`:

```powershell
npm run dev:public
```

Run the admin interface at `http://localhost:3001`:

```powershell
npm run dev:admin
```

## Verification

```powershell
npm run build:public
npm run build:admin
npm run lint
npm test
```

The current applications have inherited lint and build warnings documented in [`docs/phase-2-monorepo.md`](docs/phase-2-monorepo.md). They do not prevent either application from building.

## Deployment

The public and admin Vercel projects should use `apps/public` and `apps/admin` respectively as their project root directories after the monorepo is deployed. Until cutover, the existing production projects and the store's current admin workflow remain unchanged.

## License

© 2025 Liam McDonald  
Licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).
