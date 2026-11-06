import { withAuth } from '../../../lib/auth/server.mjs';

async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ message: 'Method not allowed.' }); }
  return res.status(200).json({ username: req.adminSession.username });
}
export default withAuth(handler);
