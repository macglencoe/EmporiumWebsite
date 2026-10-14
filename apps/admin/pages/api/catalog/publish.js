import { PublishConflictError, publishDraft } from '@emporium/database';

import { withAuth } from '../../../lib/auth/server.mjs';
import { adminDatabaseUrl, describeDraft } from '../../../lib/catalog/server.mjs';
import { adminDatabase } from '../../../lib/catalog/server.mjs';
import { deleteImageIfUnreferenced } from '../../../lib/images/server.mjs';

const FILTER_PATHS = {
  cigar: ['/cigars', '/cigars/brands', '/cigars/sizes', '/cigars/strengths', '/cigars/wrappers'],
  tobacco: ['/tobacco', '/tobacco/brands', '/tobacco/components', '/tobacco/families'],
  pipe: ['/pipes', '/pipes/brands', '/pipes/materials', '/pipes/types'],
  caffeine: ['/caffeine', '/caffeine/origins', '/caffeine/roasts'],
};

async function revalidatePublicSite(changes) {
  const siteUrl = process.env.PUBLIC_SITE_URL; const secret = process.env.REVALIDATION_SECRET;
  if (!siteUrl || !secret) return { skipped: true };
  const paths = new Set(['/']);
  for (const change of changes) {
    for (const path of FILTER_PATHS[change.type] || []) paths.add(path);
    const route = change.type === 'cigar' ? 'cigars' : change.type === 'tobacco' ? 'tobacco' : null;
    if (route && change.oldSlug) paths.add(`/${route}/${change.oldSlug}`);
    if (route && change.newSlug) paths.add(`/${route}/${change.newSlug}`);
  }
  const response = await fetch(new URL('/api/revalidate', siteUrl), { method: 'POST', headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ paths: [...paths] }) });
  if (!response.ok) throw new Error(`Public revalidation failed with status ${response.status}`);
  return response.json();
}

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
