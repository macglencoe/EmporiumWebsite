# Admin application surface

The admin application is intentionally limited to authenticated catalog administration. It no longer contains a copy of the public storefront.

## Retained workflows

- Session-based sign-in, sign-out, session validation, password setup, and session revocation.
- Dashboard and database-backed cigar and pipe-tobacco catalogs.
- Product detail, create, edit, rename, hide, delete, and staged-draft editing.
- Draft review, conflict-safe publication, public-site revalidation, and catalog export.
- Cigar barcode lookup and product image upload, replacement, and cleanup.

## Retained routes

- `/`, `/login`, `/submit`, and `/export`
- `/cigars`, cigar detail/editor/delete/draft routes, `/cigars/add`, and `/cigars/barcodeSearch`
- `/tobacco`, tobacco detail/editor/delete/draft routes, and `/tobacco/add`
- Authentication, catalog, draft, publish, and image APIs

## Removed storefront material

Marketing, contact, privacy, pipe, caffeine, filter-landing, sitemap, and public catalog pages were removed. Their components, duplicated JSON catalogs, generation utilities, promotional media, SEO files, analytics hooks, and unused dependencies were removed with them.

Pipe and caffeine data remain supported by the database and public application. Their admin CRUD workflows remain deferred as specified in the project plan.
