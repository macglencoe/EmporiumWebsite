import { applyNoStore, clearCookie, revokeRequestSession, sameOrigin } from '../../../lib/auth/server.mjs';

export default async function handler(req, res) {
  applyNoStore(res);
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ message: 'Method not allowed.' }); }
  if (!sameOrigin(req)) return res.status(403).json({ message: 'Invalid request origin.' });
  await revokeRequestSession(req);
  res.setHeader('Set-Cookie', clearCookie());
  return res.status(204).end();
}
