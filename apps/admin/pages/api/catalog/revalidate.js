import { getPublishedPublicChanges } from '@emporium/database';

import { withAuth } from '../../../lib/auth/server.mjs';
import { revalidatePublicSite } from '../../../lib/catalog/revalidation.mjs';
import { adminDatabase, adminDatabaseUrl } from '../../../lib/catalog/server.mjs';

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const { changeSetId } = req.body ?? {};
  if (typeof changeSetId !== 'string' || !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(changeSetId)) {
    return res.status(400).json({ message: 'Provide a valid publication ID.' });
  }

  const changes = await getPublishedPublicChanges(adminDatabase(), changeSetId);
  if (!changes.length) return res.status(404).json({ message: 'Publication not found.' });

  const revalidation = await revalidatePublicSite(changes, adminDatabaseUrl());
  return res.status(200).json({ revalidation });
}

export default withAuth(handler);
