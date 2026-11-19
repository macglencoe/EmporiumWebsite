import { getPublishedPublicChanges, listRecentPublications } from '@emporium/database';

import { withAuth } from '../../../lib/auth/server.mjs';
import {
  checkPublicRefreshConnection,
  isRefreshablePath,
  listStorefrontRefreshPaths,
  planPublicationRefresh,
  PUBLIC_REFRESH_BATCH_SIZE,
  PUBLIC_SECTION_PATHS,
  publicRefreshConfiguration,
  refreshPublicPaths,
} from '../../../lib/catalog/revalidation.mjs';
import { adminDatabase, adminDatabaseUrl } from '../../../lib/catalog/server.mjs';

async function handler(req, res) {
  if (req.method === 'GET') {
    const configuration = publicRefreshConfiguration();
    let publications = [];
    let historyWarning = null;
    try {
      const rows = await listRecentPublications(adminDatabase());
      publications = rows.map(({ audit, ...publication }) => ({ ...publication, itemCount: audit?.itemCount ?? null }));
    } catch {
      historyWarning = 'Could not load recent publications.';
    }
    return res.status(200).json({ configuration, publications, historyWarning, sectionPaths: PUBLIC_SECTION_PATHS, batchSize: PUBLIC_REFRESH_BATCH_SIZE });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const { action, changeSetId, paths, sitemap = false } = req.body ?? {};
  if (action === 'check' || action === 'preview') {
    try {
      if (action === 'check') return res.status(200).json({ connection: await checkPublicRefreshConnection() });
      return res.status(200).json({ paths: await listStorefrontRefreshPaths(), sitemap: true });
    } catch (error) {
      return res.status(502).json({ message: error.message });
    }
  }
  if (action === 'publication') {
    if (typeof changeSetId !== 'string' || !/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(changeSetId)) {
      return res.status(400).json({ message: 'Provide a valid publication ID.' });
    }
    const changes = await getPublishedPublicChanges(adminDatabase(), changeSetId);
    if (!changes.length) return res.status(404).json({ message: 'Publication not found.' });
    return res.status(200).json(await planPublicationRefresh(changes, adminDatabaseUrl()));
  }
  if (action === 'refresh') {
    if (typeof sitemap !== 'boolean' || !Array.isArray(paths) || paths.length > PUBLIC_REFRESH_BATCH_SIZE ||
        (!paths.length && !sitemap) || !paths.every(isRefreshablePath)) {
      return res.status(400).json({ message: 'Select valid storefront page paths or request a sitemap refresh.' });
    }
    return res.status(200).json(await refreshPublicPaths(paths, sitemap));
  }
  return res.status(400).json({ message: 'Unknown cache refresh action.' });
}

export default withAuth(handler);
