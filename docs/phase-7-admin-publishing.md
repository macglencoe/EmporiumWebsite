# Phase 7: Database-backed admin publishing

Phase 7 replaces the admin application's GitHub JSON publishing workflow with product-level drafts and atomic Neon transactions. Cigar and pipe-tobacco administration are included; pipe and caffeine CRUD remain intentionally deferred.

## Result

- Catalog pages, product pages, barcode search, and exports read from Neon.
- Add, edit, hide, and delete operations stage `change_set_items` in Neon instead of browser `localStorage`.
- One active draft is shared across signed-in devices.
- Products and variants use stable UUIDs.
- The review page displays the stored before/after values and supports removing individual changes or discarding the draft.
- Publishing locks the change set and affected products, checks each stored base version, applies every item in one transaction, records audit events, and commits once.
- A version mismatch returns an explicit conflict and rolls back the entire publication. The draft remains available for review.
- Admin publishing no longer reads or writes GitHub and does not require `GITHUB_TOKEN`.

The public application still reads its legacy JSON in Phase 7. Public database reads and cache revalidation are activated in Phase 9, when the storefront is converted; the committed database state is already the publication boundary.

## Database changes

Migrations `0003_sad_edwin_jarvis.sql` and `0004_glossy_leper_queen.sql` add stable draft keys and enforce a single active draft. A draft item retains the product UUID and base version needed for optimistic concurrency. Delete audit events retain the complete product in their `before` JSON even though the product row is removed.

Apply and verify the database changes with the admin application's credential:

```bash
npm run db:migrate
npm run db:roles
npm run db:check
```

## Local acceptance test

Start the admin application after setting `ADMIN_DATABASE_URL` in the repository-root `.env.local`:

```bash
npm run dev:admin
```

Then verify the following in the browser:

1. Add a disposable cigar or tobacco product and confirm it appears on `/submit`.
2. Reload the page or sign in from another browser and confirm the same draft is present.
3. Publish it and confirm the product is visible in the admin catalog and barcode search.
4. Edit, hide, and publish the product.
5. Stage its deletion, confirm the destructive prompt, review the before value, and publish the deletion.
6. Export the catalog and confirm the current database values are included.

The automated transaction exercise uses a disposable tobacco record to verify create, optimistic-conflict rollback, update, and delete. It removes the product afterward, while deliberately retaining its change-set and audit history:

```bash
npm run verify:phase7
```

Run the repository checks with:

```bash
npm test
npm run lint
npm run build:admin
```

## Operational notes

- Do not expose `ADMIN_DATABASE_URL` to browser code. It is read only by server-side pages, authenticated API routes, database scripts, and the publishing transaction.
- Publication errors leave the draft intact. Resolve a reported version conflict by removing the stale draft item and reopening the current product before staging the edit again.
- Change-set messages and product-level before/after audit records are stored in Neon and do not depend on Git history.
- Image lifecycle consolidation is Phase 8. Phase 7 keeps the existing authorized image workflow while moving the catalog record itself to Neon.
