import { PublishConflictError, publishDraft } from '@emporium/database';

import { withAuth } from '../../../lib/auth/server.mjs';
import { adminDatabaseUrl, describeDraft } from '../../../lib/catalog/server.mjs';
import { adminDatabase } from '../../../lib/catalog/server.mjs';
import { deleteImageIfUnreferenced } from '../../../lib/images/server.mjs';
import { revalidatePublicSite } from '../../../lib/catalog/revalidation.mjs';

async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ message: 'Method not allowed.' }); }
  const draft = await describeDraft(); if (!draft) return res.status(400).json({ message: 'There is no active draft.' });
  try {
    const result = await publishDraft(adminDatabaseUrl(), draft.id);
    const cleanup = await Promise.allSettled(result.imageChanges.filter(({ oldUrl }) => oldUrl).map(({ oldUrl }) => deleteImageIfUnreferenced(adminDatabase(), oldUrl)));
    const cleanupWarnings = cleanup.filter(({ status, value }) => status === 'rejected' || (value && value.reason === 'referenced')).length;
    let revalidation; try { revalidation = await revalidatePublicSite(result.publicChanges); } catch (error) { revalidation = { warning: error.message }; }
    return res.status(200).json({ ...result, cleanupWarnings, revalidation });
  }
  catch (error) { if (error instanceof PublishConflictError) return res.status(409).json({ message: error.message, conflicts: error.conflicts }); throw error; }
}
export default withAuth(handler);
