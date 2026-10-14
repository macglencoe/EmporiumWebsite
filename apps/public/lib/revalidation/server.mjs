import crypto from 'node:crypto';

const equalSecret = (provided, expected) => {
  const left = Buffer.from(provided || ''); const right = Buffer.from(expected || '');
  return left.length === right.length && crypto.timingSafeEqual(left, right);
};

export default async function revalidationHandler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ message: 'Method not allowed.' }); }
  const expected = process.env.REVALIDATION_SECRET;
  const provided = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!expected || expected.length < 32 || !equalSecret(provided, expected)) return res.status(401).json({ message: 'Invalid revalidation credentials.' });
  const paths = [...new Set(Array.isArray(req.body?.paths) ? req.body.paths : [])];
  if (!paths.length || paths.length > 50 || paths.some((path) => typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//') || path.includes('://'))) return res.status(400).json({ message: 'Provide between 1 and 50 local paths.' });
  const results = await Promise.allSettled(paths.map((path) => res.revalidate(path)));
  const failed = results.flatMap((result, index) => result.status === 'rejected' ? [{ path: paths[index], message: result.reason?.message }] : []);
  return res.status(failed.length ? 500 : 200).json({ revalidated: paths.length - failed.length, failed });
}
