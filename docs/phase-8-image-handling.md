# Phase 8: Consolidated image handling

Phase 8 retains Vercel Blob while making image upload, replacement, and deletion authenticated, validated, database-aware, and failure-safe.

## Result

- `/api/images` is the single authenticated image endpoint; the duplicate upload and delete routes were removed.
- The server accepts JPEG, PNG, WebP, and GIF images up to 5 MB. Browser compression remains a convenience rather than a security boundary.
- Blob paths use the product UUID when available plus a random UUID. New-product uploads use an isolated pending path until the product receives its database identity.
- Published image URLs and metadata are stored in `products` and `product_images` by the existing publication transaction.
- Physical deletion is refused while either `product_images` or an active draft references the URL.
- Replacing or removing an image changes the draft first. The previous Blob is deleted only after the publication transaction commits and confirms it is unreferenced.
- Image reference changes create `image_upload` and `image_delete` audit events in the same transaction as publication.
- External legacy image URLs are never sent to the Vercel Blob deletion API.

## Failure behavior

- A failed replacement upload leaves the current product image untouched.
- A failed publication leaves both the current database reference and current Blob untouched.
- A failed post-publication Blob cleanup leaves an unreferenced Blob but does not break the published product. The publish response reports a cleanup warning.
- A newly uploaded image can be cleaned up before publication only when no product or draft references it.
- Removing a draft item or discarding the active draft attempts to clean up its now-unreferenced managed images.

Cross-service publication and Blob deletion cannot be one atomic transaction. The workflow therefore favors a recoverable orphaned Blob over a broken product image.

## Verification

Run:

```bash
npm test
npm run lint
npm run build:admin
```

With `ADMIN_DATABASE_URL`, `AUTH_COOKIE_SECRET`, and `BLOB_READ_WRITE_TOKEN` configured, manually verify upload, replacement, removal, publication, and a deliberately failed publication. Confirm that the prior image remains available until publication succeeds.
