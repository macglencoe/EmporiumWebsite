import { getActiveDraft, publishDraft, stageDraftItem, updateDraftMessage } from '@emporium/database';

import { withAuth } from '../../../lib/auth/server.mjs';
import { prepareCatalogImport } from '../../../lib/catalog/import.mjs';
import { revalidatePublicSite } from '../../../lib/catalog/revalidation.mjs';
import { adminDatabase, adminDatabaseUrl, readCatalog } from '../../../lib/catalog/server.mjs';
import { deleteImageIfUnreferenced } from '../../../lib/images/server.mjs';

const labels = { cigar: 'CIGARS', tobacco: 'TOBACCO' };

async function stageChanges(database, changes, type, mode) {
  await updateDraftMessage(database, `JSON ${mode} import: ${labels[type].toLowerCase()}`);
  for (const change of changes) {
    await stageDraftItem(database, {
      operation: change.operation,
      draftKey: change.existing?.id || change.payload.id,
      productId: change.existing?.id ?? null,
      baseVersion: change.existing?.version ?? null,
      payload: change.payload,
    });
  }
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed.' });
  }
  const { type, rows, mode = 'merge', destination = 'preview', confirmation } = req.body ?? {};
  let result;
  try {
    result = prepareCatalogImport({ type, rows, mode, catalog: await readCatalog() });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  if (!result.valid) return res.status(400).json(result);
  if (destination === 'preview') return res.status(200).json(result);
  if (!['draft', 'direct'].includes(destination)) return res.status(400).json({ message: 'Choose draft or direct import.' });
  if (!result.changes.length) return res.status(400).json({ message: 'The upload does not change the selected catalog.' });

  const database = adminDatabase();
  const active = await getActiveDraft(database);
  if (active?.items.length) return res.status(409).json({ message: 'Publish or discard the current draft before importing a catalog.' });

  if (destination === 'direct' && confirmation !== `YEET ${labels[type]}`) {
    return res.status(400).json({ message: `Type YEET ${labels[type]} to confirm the direct import.` });
  }

  await stageChanges(database, result.changes, type, mode);
  if (destination === 'draft') return res.status(200).json({ success: true, destination, counts: result.counts });

  const draft = await getActiveDraft(database);
  const published = await publishDraft(adminDatabaseUrl(), draft.id);
  await Promise.allSettled(published.imageChanges.filter(({ oldUrl }) => oldUrl).map(({ oldUrl }) => deleteImageIfUnreferenced(database, oldUrl)));
  let revalidation;
  try { revalidation = await revalidatePublicSite(published.publicChanges); }
  catch (error) { revalidation = { warning: error.message }; }
  return res.status(200).json({ success: true, destination, counts: result.counts, published, revalidation });
}

export const config = { api: { bodyParser: { sizeLimit: '15mb' } } };
export default withAuth(handler);
