import { exportLegacyCatalog } from '@emporium/domain';

import { withAuth } from '../../../lib/auth/server.mjs';
import { readCatalog } from '../../../lib/catalog/server.mjs';

async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method not allowed.' });
  }
  const type = req.query.type;
  if (!['cigar', 'tobacco'].includes(type)) return res.status(400).json({ message: 'Choose cigar or tobacco.' });
  const rows = exportLegacyCatalog(await readCatalog([type]));
  const stamp = new Date().toISOString().replaceAll(':', '').replace(/\.\d{3}Z$/, 'Z');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="emporium-${type}-${stamp}.json"`);
  return res.status(200).send(`${JSON.stringify(rows, null, 2)}\n`);
}

export default withAuth(handler);
