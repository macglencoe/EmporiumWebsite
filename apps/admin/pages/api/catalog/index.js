import { legacyEnvelope, readCatalog } from '../../../lib/catalog/server.mjs';
import { withAuth } from '../../../lib/auth/server.mjs';

async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ message: 'Method not allowed.' }); }
  const types = typeof req.query.type === 'string' ? req.query.type.split(',') : [];
  const catalog = await readCatalog(types);
  return res.status(200).json(catalog.map(legacyEnvelope));
}
export default withAuth(handler);
