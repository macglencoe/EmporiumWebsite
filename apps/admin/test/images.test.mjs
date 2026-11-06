import assert from 'node:assert/strict';
import test from 'node:test';

import {
  deleteImageIfUnreferenced,
  imagePath,
  isManagedBlobUrl,
  MAX_IMAGE_BYTES,
  validateImageFile,
  validateImageContents,
} from '../lib/images/server.mjs';

test('image uploads accept supported bounded files', () => {
  const file = { filepath: '/tmp/image', mimetype: 'image/webp', size: 1024 };
  assert.equal(validateImageFile(file), file);
  assert.throws(() => validateImageFile({ ...file, mimetype: 'image/svg+xml' }), /JPEG, PNG, WebP, or GIF/);
  assert.throws(() => validateImageFile({ ...file, size: MAX_IMAGE_BYTES + 1 }), /5 MB or smaller/);
  assert.throws(() => validateImageFile({ ...file, size: 0 }), /empty/);
});

test('declared image type must match the file signature', () => {
  validateImageContents(Buffer.from([0xff, 0xd8, 0xff, 0x00]), 'image/jpeg');
  validateImageContents(Buffer.from('GIF89a'), 'image/gif');
  assert.throws(() => validateImageContents(Buffer.from('<svg>'), 'image/png'), /contents do not match/);
});

test('blob paths are product-scoped and collision resistant', () => {
  const productId = '9a59aa1a-6717-4a55-8ca2-dda81380398b';
  const first = imagePath({ productId, mimeType: 'image/jpeg' });
  const second = imagePath({ productId, mimeType: 'image/jpeg' });
  assert.match(first, new RegExp(`^products/${productId}/[0-9a-f-]{36}\\.jpg$`));
  assert.notEqual(first, second);
});

test('only managed public Vercel Blob URLs are recognized', () => {
  assert.equal(isManagedBlobUrl('https://store.public.blob.vercel-storage.com/products/a.jpg'), true);
  assert.equal(isManagedBlobUrl('https://example.com/image.jpg'), false);
  assert.equal(isManagedBlobUrl('not-a-url'), false);
});

test('referenced images cannot be deleted', async () => {
  let deleted = false;
  const result = await deleteImageIfUnreferenced({}, 'https://store.public.blob.vercel-storage.com/products/a.jpg', {
    getReferences: async () => [{ kind: 'product', id: 'product-id' }],
    deleteBlob: async () => { deleted = true; },
  });
  assert.equal(result.reason, 'referenced');
  assert.equal(deleted, false);
});

test('unreferenced managed images are deleted', async () => {
  let deletedUrl;
  const url = 'https://store.public.blob.vercel-storage.com/products/a.jpg';
  const result = await deleteImageIfUnreferenced({}, url, {
    getReferences: async () => [],
    deleteBlob: async (value) => { deletedUrl = value; },
  });
  assert.equal(result.deleted, true);
  assert.equal(deletedUrl, url);
});
