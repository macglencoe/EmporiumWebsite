import crypto from 'node:crypto';
import { invalidateByTag } from '@vercel/functions';
import { PUBLIC_SITEMAP_CACHE_TAG } from '../catalog/server.mjs';

const equalSecret = (provided, expected) => {
  const left = Buffer.from(provided || ''); const right = Buffer.from(expected || '');
  return left.length === right.length && crypto.timingSafeEqual(left, right);
};

const invalidateSitemap = () => invalidateByTag(PUBLIC_SITEMAP_CACHE_TAG);

export default async function revalidationHandler(req, res, invalidate = invalidateSitemap) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ message: 'Method not allowed.' }); }
  const expected = process.env.REVALIDATION_SECRET;
  const provided = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!expected || expected.length < 32 || !equalSecret(provided, expected)) return res.status(401).json({ message: 'Invalid revalidation credentials.' });
  const requestedPaths = Array.isArray(req.body?.paths) ? req.body.paths : [];
  if (!requestedPaths.length || requestedPaths.some((path) => typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//') || path.includes('://'))) return res.status(400).json({ message: 'Provide between 1 and 50 local paths.' });
  // Next.js redirects page paths without the configured trailing slash.
  const paths = [...new Set(requestedPaths.map((path) => path.endsWith('/') ? path : `${path}/`))];
  if (paths.length > 50) return res.status(400).json({ message: 'Provide between 1 and 50 local paths.' });
  const targets = paths.map((path) => [path, () => res.revalidate(path)]);
  if (req.body.sitemapChanged === true) targets.push(['/sitemap.xml', invalidate]);
  const results = await Promise.allSettled(targets.map(([, refresh]) => Promise.resolve().then(refresh)));
  const failed = results.flatMap((result, index) => result.status === 'rejected' ? [{ path: targets[index][0], message: result.reason?.message }] : []);
  const revalidated = results.slice(0, paths.length).filter(({ status }) => status === 'fulfilled').length;
  return res.status(failed.length ? 500 : 200).json({ revalidated, failed });
}
