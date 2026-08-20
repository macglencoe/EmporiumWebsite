import { PublishConflictError, publishDraft } from '@emporium/database';

import { withAuth } from '../../../lib/auth/server.mjs';
import { adminDatabaseUrl, describeDraft } from '../../../lib/catalog/server.mjs';

async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ message: 'Method not allowed.' }); }
  const draft = await describeDraft(); if (!draft) return res.status(400).json({ message: 'There is no active draft.' });
  try { return res.status(200).json(await publishDraft(adminDatabaseUrl(), draft.id)); }
  catch (error) { if (error instanceof PublishConflictError) return res.status(409).json({ message: error.message, conflicts: error.conflicts }); throw error; }
}
export default withAuth(handler);
