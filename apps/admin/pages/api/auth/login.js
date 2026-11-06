import { applyNoStore, makeCookie, sameOrigin, signIn } from '../../../lib/auth/server.mjs';

export default async function handler(req, res) {
  applyNoStore(res);
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ message: 'Method not allowed.' }); }
  if (!sameOrigin(req)) return res.status(403).json({ message: 'Invalid request origin.' });
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const result = await signIn(password);
  if (!result.ok) return res.status(result.reason === 'locked' ? 429 : 401).json({ message: result.reason === 'locked' ? 'Sign-in is temporarily locked. Try again later.' : 'Invalid username or password.' });
  res.setHeader('Set-Cookie', makeCookie(result.token));
  return res.status(200).json({ username: 'store-admin', expiresAt: result.expiresAt });
}
