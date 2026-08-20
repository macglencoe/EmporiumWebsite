import { discardActiveDraft, removeDraftItem, stageDraftItem, updateDraftMessage } from '@emporium/database';

import { withAuth } from '../../../lib/auth/server.mjs';
import { adminDatabase, buildDraftPayload, describeDraft, readCatalog } from '../../../lib/catalog/server.mjs';

async function handler(req, res) {
  const database = adminDatabase();
  if (req.method === 'GET') return res.status(200).json({ draft: await describeDraft() });
  if (req.method === 'DELETE') {
    if (req.query.item) await removeDraftItem(database, req.query.item); else await discardActiveDraft(database);
    return res.status(204).end();
  }
  if (req.method === 'PATCH') { await updateDraftMessage(database, req.body?.message); return res.status(200).json({ draft: await describeDraft() }); }
  if (req.method !== 'POST') { res.setHeader('Allow', ['GET','POST','PATCH','DELETE']); return res.status(405).json({ message: 'Method not allowed.' }); }
  if (req.body?.operation === 'delete') {
    const catalog = await readCatalog(['cigar','tobacco']);
    const existing = catalog.find((product) => product.id === req.body.productId);
    if (!existing) return res.status(404).json({ message: 'Product not found.' });
    const item = await stageDraftItem(database, { operation: 'delete', draftKey: existing.id, productId: existing.id, baseVersion: existing.version, payload: null });
    return res.status(200).json({ item });
  }
  const result = await buildDraftPayload(req.body);
  if (result.errors) return res.status(400).json({ message: 'Product validation failed.', errors: result.errors });
  if (result.notFound) return res.status(404).json({ message: 'Product not found.' });
  if (result.slugConflict) return res.status(409).json({ message: 'That slug is already used by another product.' });
  const item = await stageDraftItem(database, { operation: result.existing ? 'update' : 'create', draftKey: result.payload.id, productId: result.existing?.id ?? null, baseVersion: result.existing?.version ?? null, payload: result.payload });
  return res.status(200).json({ item, warnings: result.warnings });
}
export default withAuth(handler);
