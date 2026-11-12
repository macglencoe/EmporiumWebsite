import { findPublicNeighborSlugs } from '@emporium/database/catalog';

const FILTER_PATHS = {
  cigar: ['/cigars', '/cigars/brands', '/cigars/sizes', '/cigars/strengths', '/cigars/wrappers'],
  tobacco: ['/tobacco', '/tobacco/brands', '/tobacco/components', '/tobacco/families'],
  pipe: ['/pipes', '/pipes/brands', '/pipes/materials', '/pipes/types'],
  caffeine: ['/caffeine', '/caffeine/origins', '/caffeine/roasts'],
};

const PRODUCT_ROUTES = { cigar: 'cigars', tobacco: 'tobacco' };
const PATH_BATCH_SIZE = 50;

export async function revalidatePublicSite(changes, connectionString) {
  const siteUrl = process.env.PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATION_SECRET;
  if (!siteUrl || !secret) return { skipped: true };
  const paths = new Set();
  const anchorsByType = new Map();
  let sitemapChanged = false;
  for (const change of changes) {
    const oldSlug = change.wasVisible ? change.oldSlug : null;
    const newSlug = change.isVisible ? change.newSlug : null;
    if (!oldSlug && !newSlug) continue;
    paths.add('/');
    for (const path of FILTER_PATHS[change.type] || []) paths.add(path);
    const route = PRODUCT_ROUTES[change.type];
    if (!route) continue;
    if (oldSlug !== newSlug) sitemapChanged = true;
    const anchors = anchorsByType.get(change.type) ?? new Set();
    for (const slug of [oldSlug, newSlug].filter(Boolean)) {
      anchors.add(slug);
      paths.add(`/${route}/${slug}`);
    }
    anchorsByType.set(change.type, anchors);
  }
  if (!paths.size) return { skipped: true };

  const warnings = [];
  for (const [type, anchors] of anchorsByType) {
    try {
      const slugs = await findPublicNeighborSlugs(connectionString, type, [...anchors]);
      for (const slug of slugs) paths.add(`/${PRODUCT_ROUTES[type]}/${slug}`);
    } catch {
      warnings.push(`Could not look up ${type} navigation neighbors.`);
    }
  }

  const pathList = [...paths];
  let revalidated = 0;
  for (let offset = 0; offset < pathList.length; offset += PATH_BATCH_SIZE) {
    const batch = pathList.slice(offset, offset + PATH_BATCH_SIZE);
    try {
      const response = await fetch(new URL('/api/revalidate/', siteUrl), {
        method: 'POST',
        headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: batch, sitemapChanged: offset === 0 && sitemapChanged }),
      });
      const result = await response.json();
      revalidated += result.revalidated ?? 0;
      if (!response.ok) warnings.push(`Public revalidation batch ${offset / PATH_BATCH_SIZE + 1} returned status ${response.status}.`);
    } catch {
      warnings.push(`Could not complete public revalidation batch ${offset / PATH_BATCH_SIZE + 1}.`);
    }
  }
  return { revalidated, ...(warnings.length && { warning: warnings.join(' ') }) };
}
