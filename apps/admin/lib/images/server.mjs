import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';

import { del, put } from '@vercel/blob';
import { getImageReferences } from '@emporium/database';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const EXTENSIONS = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

export class ImageValidationError extends Error {
  constructor(message) { super(message); this.name = 'ImageValidationError'; }
}

export function validateImageFile(file) {
  if (!file?.filepath) throw new ImageValidationError('No image file was provided.');
  if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) throw new ImageValidationError('Images must be JPEG, PNG, WebP, or GIF files.');
  if (!Number.isFinite(file.size) || file.size <= 0) throw new ImageValidationError('The image file is empty.');
  if (file.size > MAX_IMAGE_BYTES) throw new ImageValidationError('Images must be 5 MB or smaller.');
  return file;
}

export function validateImageContents(data, mimeType) {
  const signatures = {
    'image/jpeg': data.length >= 3 && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff,
    'image/png': data.length >= 8 && data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    'image/gif': data.length >= 6 && ['GIF87a', 'GIF89a'].includes(data.subarray(0, 6).toString('ascii')),
    'image/webp': data.length >= 12 && data.subarray(0, 4).toString('ascii') === 'RIFF' && data.subarray(8, 12).toString('ascii') === 'WEBP',
  };
  if (!signatures[mimeType]) throw new ImageValidationError('The file contents do not match the declared image type.');
}

export function imagePath({ productId, mimeType }) {
  const owner = /^[0-9a-f-]{36}$/i.test(productId || '') ? productId : `pending/${randomUUID()}`;
  return `products/${owner}/${randomUUID()}.${EXTENSIONS[mimeType]}`;
}

export function isManagedBlobUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname.endsWith('.public.blob.vercel-storage.com');
  } catch { return false; }
}

export async function uploadImage(file, { productId, token = process.env.BLOB_READ_WRITE_TOKEN, putBlob = put } = {}) {
  validateImageFile(file);
  const data = await fs.readFile(file.filepath);
  validateImageContents(data, file.mimetype);
  const blob = await putBlob(imagePath({ productId, mimeType: file.mimetype }), data, {
    access: 'public', contentType: file.mimetype, token,
  });
  return { url: blob.url, contentType: file.mimetype, size: file.size };
}

export async function deleteImageIfUnreferenced(database, url, { token = process.env.BLOB_READ_WRITE_TOKEN, deleteBlob = del, getReferences = getImageReferences } = {}) {
  if (!isManagedBlobUrl(url)) return { deleted: false, reason: 'external' };
  const references = await getReferences(database, url);
  if (references.length) return { deleted: false, reason: 'referenced', references };
  await deleteBlob(url, { token });
  return { deleted: true };
}
