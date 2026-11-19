import assert from 'node:assert/strict';
import test from 'node:test';

import { checkPublicRefreshConnection, listStorefrontRefreshPaths, publicRefreshConfiguration, refreshPublicPaths, revalidatePublicSite } from '../lib/catalog/revalidation.mjs';

function configureRefresh(t) {
  const previousSiteUrl = process.env.PUBLIC_SITE_URL;
  const previousSecret = process.env.REVALIDATION_SECRET;
  process.env.PUBLIC_SITE_URL = 'https://www.example.test';
  process.env.REVALIDATION_SECRET = 'test-secret-that-is-at-least-32-characters';
  t.after(() => {
    if (previousSiteUrl === undefined) delete process.env.PUBLIC_SITE_URL; else process.env.PUBLIC_SITE_URL = previousSiteUrl;
    if (previousSecret === undefined) delete process.env.REVALIDATION_SECRET; else process.env.REVALIDATION_SECRET = previousSecret;
  });
}

test('bulk publication refreshes the old and new neighborhoods in batches', async (t) => {
  configureRefresh(t);
  const requests = [];
  t.mock.method(globalThis, 'fetch', async (url, { body }) => {
    const request = JSON.parse(body);
    if (new URL(url).hostname === 'www.example.test') {
      requests.push(request);
      return Response.json({ revalidated: request.paths.length });
    }
    assert.match(request.params[0], /old-slug/);
    assert.match(request.params[0], /new-slug/);
    return Response.json({
      fields: ['previous_slug', 'next_slug'].map((name) => ({ name, dataTypeID: 25 })),
      rows: [['previous-old', 'next-old'], ['previous-new', 'next-new']],
    });
  });

  const changes = [
    { type: 'tobacco', oldSlug: 'old-slug', newSlug: 'new-slug', wasVisible: true, isVisible: true },
    ...Array.from({ length: 52 }, (_, index) => ({
      type: 'tobacco', oldSlug: null, newSlug: `added-${index}`, wasVisible: false, isVisible: true,
    })),
  ];
  const result = await revalidatePublicSite(changes, 'postgresql://reader:password@db.example.test/neondb');
  assert.deepEqual(result, { revalidated: 63, sitemap: 'refreshed' });
  assert.deepEqual(requests.map(({ paths }) => paths.length), [50, 13]);
  assert.deepEqual(requests.map(({ sitemapChanged }) => sitemapChanged), [true, false]);
  const paths = requests.flatMap((request) => request.paths);
  for (const slug of ['old-slug', 'new-slug', 'previous-old', 'next-old', 'previous-new', 'next-new']) {
    assert.ok(paths.includes(`/tobacco/${slug}`));
  }
});

test('manual refresh reports failed targets and can retry just those targets', async (t) => {
  configureRefresh(t);
  const requests = [];
  t.mock.method(globalThis, 'fetch', async (_, { body }) => {
    requests.push(JSON.parse(body));
    if (requests.length === 1) {
      return Response.json({ revalidated: 1, failed: [{ path: '/cigars/example/' }, { path: '/sitemap.xml' }] }, { status: 500 });
    }
    return Response.json({ revalidated: 1, failed: [] });
  });

  const result = await refreshPublicPaths(['/', '/cigars/example'], true);
  assert.equal(result.revalidated, 1);
  assert.equal(result.sitemap, 'failed');
  assert.deepEqual(result.failedPaths, ['/cigars/example']);
  assert.ok(result.warning);
  assert.deepEqual(await refreshPublicPaths(result.failedPaths, true), { revalidated: 1, sitemap: 'refreshed' });
  assert.deepEqual(requests[1], { paths: ['/cigars/example'], sitemapChanged: true });
});

test('configuration omits the signing secret and reads storefront settings and paths through signed requests', async (t) => {
  configureRefresh(t);
  assert.deepEqual(publicRefreshConfiguration(), {
    siteUrl: 'https://www.example.test',
    endpoint: 'https://www.example.test/api/revalidate/',
    signingSecret: 'configured',
  });
  t.mock.method(globalThis, 'fetch', async (_, { headers, body }) => {
    assert.equal(headers.Authorization, `Bearer ${process.env.REVALIDATION_SECRET}`);
    const { action } = JSON.parse(body);
    if (action === 'check') return Response.json({ dataSource: 'json', revalidateSeconds: 3600 });
    assert.equal(action, 'list-products');
    return Response.json({ products: [{ type: 'cigar', slug: 'current' }, { type: 'tobacco', slug: 'current' }] });
  });
  assert.deepEqual(await checkPublicRefreshConnection(), { dataSource: 'json', revalidateSeconds: 3600 });
  const paths = await listStorefrontRefreshPaths();
  assert.ok(paths.includes('/'));
  assert.ok(paths.includes('/pipes/materials'));
  assert.deepEqual(paths.slice(-2), ['/cigars/current', '/tobacco/current']);
});
