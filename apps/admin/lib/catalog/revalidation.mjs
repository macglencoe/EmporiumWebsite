import { findPublicNeighborSlugs } from '@emporium/database/catalog';
import { slugSchema } from '@emporium/domain';

const FILTER_PATHS = {
  cigar: ['/cigars', '/cigars/brands', '/cigars/sizes', '/cigars/strengths', '/cigars/wrappers'],
  tobacco: ['/tobacco', '/tobacco/brands', '/tobacco/components', '/tobacco/families'],
  pipe: ['/pipes', '/pipes/brands', '/pipes/materials', '/pipes/types'],
  caffeine: ['/caffeine', '/caffeine/origins', '/caffeine/roasts'],
};

const PRODUCT_ROUTES = { cigar: 'cigars', tobacco: 'tobacco' };
export const PUBLIC_REFRESH_BATCH_SIZE = 50;
export const PUBLIC_SECTION_PATHS = ['/', ...Object.values(FILTER_PATHS).flat()];

export function isRefreshablePath(path) {
  if (typeof path !== 'string') return false;
  if (PUBLIC_SECTION_PATHS.includes(path)) return true;
  const [, slug] = /^\/(?:cigars|tobacco)\/([^/]+)$/.exec(path) ?? [];
  return slug !== undefined && slugSchema.safeParse(slug).success;
}

export function publicRefreshConfiguration() {
  const secret = process.env.REVALIDATION_SECRET;
  const signingSecret = !secret ? 'missing' : secret.length < 32 ? 'too short' : 'configured';
  let endpoint = null;
  try {
    const url = new URL(process.env.PUBLIC_SITE_URL);
    if (['http:', 'https:'].includes(url.protocol) && !url.username && !url.password) {
      endpoint = new URL('/api/revalidate/', url).href;
    }
  } catch {
    // An unset or invalid URL leaves refresh unavailable.
  }
  return { siteUrl: endpoint ? new URL(endpoint).origin : null, endpoint, signingSecret };
}

class RefreshRequestError extends Error {}

async function requestPublicRefresh(body) {
  const { endpoint, signingSecret } = publicRefreshConfiguration();
  if (!endpoint) throw new RefreshRequestError('The public site URL is missing or invalid.');
  if (signingSecret !== 'configured') throw new RefreshRequestError('The refresh signing secret is missing or too short.');
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.timeout(20_000),
      headers: { Authorization: `Bearer ${process.env.REVALIDATION_SECRET}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (response.status === 401 || response.status === 403) {
      throw new RefreshRequestError('The public site rejected the refresh credentials.');
    }
    if (!response.ok && !body.paths) throw new RefreshRequestError(`The public endpoint returned HTTP ${response.status}.`);
    const result = await response.json();
    return { response, result };
  } catch (error) {
    if (error instanceof RefreshRequestError) throw error;
    throw new RefreshRequestError('Could not reach the public refresh endpoint or read its response.');
  }
}

export async function checkPublicRefreshConnection() {
  const { result } = await requestPublicRefresh({ action: 'check' });
  if (!['json', 'database'].includes(result?.dataSource) || !Number.isFinite(result.revalidateSeconds)) {
    throw new RefreshRequestError('The public endpoint did not return valid refresh configuration.');
  }
  return { dataSource: result.dataSource, revalidateSeconds: result.revalidateSeconds };
}

export async function listStorefrontRefreshPaths() {
  const { result } = await requestPublicRefresh({ action: 'list-products' });
  if (!Array.isArray(result?.products)) {
    throw new RefreshRequestError('The public endpoint did not return the storefront product list.');
  }
  if (!result.products.every((product) => ['cigar', 'tobacco'].includes(product?.type) && slugSchema.safeParse(product.slug).success)) {
    throw new RefreshRequestError('The public catalog returned an unsupported product path.');
  }
  const products = result.products.map(({ type, slug }) => `/${PRODUCT_ROUTES[type]}/${slug}`);
  return [...new Set([...PUBLIC_SECTION_PATHS, ...products])];
}

export async function planPublicationRefresh(changes, connectionString) {
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
  const warnings = [];
  for (const [type, anchors] of anchorsByType) {
    try {
      const slugs = await findPublicNeighborSlugs(connectionString, type, [...anchors]);
      for (const slug of slugs) paths.add(`/${PRODUCT_ROUTES[type]}/${slug}`);
    } catch {
      warnings.push(`Could not look up ${type} navigation neighbors.`);
    }
  }

  return { paths: [...paths], sitemap: sitemapChanged, planningWarning: warnings.join(' ') };
}

export async function revalidatePublicSite(changes, connectionString) {
  const { paths, sitemap, planningWarning } = await planPublicationRefresh(changes, connectionString);
  if (!paths.length) return { skipped: true };
  const result = await refreshPublicPaths(paths, sitemap);
  if (!planningWarning) return result;
  return { ...result, warning: [planningWarning, result.warning].filter(Boolean).join(' ') };
}

export async function refreshPublicPaths(paths, refreshSitemap = false) {
  const pathList = [...new Set(paths)];
  const failedPaths = new Set();
  const warnings = new Set();
  let revalidated = 0;
  let sitemap = refreshSitemap ? 'unconfirmed' : null;
  const length = Math.max(pathList.length, Number(refreshSitemap));
  for (let offset = 0; offset < length; offset += PUBLIC_REFRESH_BATCH_SIZE) {
    const batch = pathList.slice(offset, offset + PUBLIC_REFRESH_BATCH_SIZE);
    const sitemapChanged = offset === 0 && refreshSitemap;
    try {
      const { response, result } = await requestPublicRefresh({ paths: batch, sitemapChanged });
      const refreshed = result?.revalidated;
      const reported = new Set((Array.isArray(result?.failed) ? result.failed : [])
        .map((entry) => entry?.path).filter((path) => typeof path === 'string')
        .map((path) => path === '/' ? '/' : path.replace(/\/$/, '')));
      const failedBatch = batch.filter((path) => reported.has(path));
      const sitemapFailed = sitemapChanged && reported.has('/sitemap.xml');
      if (refreshed !== batch.length - failedBatch.length || (!response.ok && !failedBatch.length && !sitemapFailed)) {
        throw new RefreshRequestError(`The public endpoint did not confirm the refresh (HTTP ${response.status}).`);
      }
      revalidated += refreshed;
      failedBatch.forEach((path) => failedPaths.add(path));
      if (sitemapChanged) sitemap = sitemapFailed ? 'failed' : 'refreshed';
      if (failedBatch.length || sitemapFailed) warnings.add('The public site reported a cache refresh failure.');
    } catch (error) {
      batch.forEach((path) => failedPaths.add(path));
      warnings.add(error.message);
    }
  }
  return {
    revalidated,
    ...(sitemap && { sitemap }),
    ...(failedPaths.size > 0 && { failedPaths: [...failedPaths] }),
    ...(warnings.size > 0 && { warning: [...warnings].join(' ') }),
  };
}
