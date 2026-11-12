import assert from 'node:assert/strict';
import test from 'node:test';

import { revalidatePublicSite } from '../lib/catalog/revalidation.mjs';

test('bulk publication refreshes the old and new neighborhoods in batches', async (t) => {
  const previousSiteUrl = process.env.PUBLIC_SITE_URL;
  const previousSecret = process.env.REVALIDATION_SECRET;
  process.env.PUBLIC_SITE_URL = 'https://www.example.test';
  process.env.REVALIDATION_SECRET = 'test-secret-that-is-at-least-32-characters';
  t.after(() => {
    if (previousSiteUrl === undefined) delete process.env.PUBLIC_SITE_URL; else process.env.PUBLIC_SITE_URL = previousSiteUrl;
    if (previousSecret === undefined) delete process.env.REVALIDATION_SECRET; else process.env.REVALIDATION_SECRET = previousSecret;
  });

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
  assert.deepEqual(result, { revalidated: 63 });
  assert.deepEqual(requests.map(({ paths }) => paths.length), [50, 13]);
  assert.deepEqual(requests.map(({ sitemapChanged }) => sitemapChanged), [true, false]);
  const paths = requests.flatMap((request) => request.paths);
  for (const slug of ['old-slug', 'new-slug', 'previous-old', 'next-old', 'previous-new', 'next-new']) {
    assert.ok(paths.includes(`/tobacco/${slug}`));
  }
});
