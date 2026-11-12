import assert from 'node:assert/strict';
import test from 'node:test';

import { dataSource, publicProductPaths, readPublicCatalog, readPublicProductPage, readPublicSitemapSlugs } from '../lib/catalog/server.mjs';

test('JSON is the safe default and invalid data sources fail closed', () => {
  assert.equal(dataSource({}), 'json');
  assert.equal(dataSource({ DATA_SOURCE: 'database' }), 'database');
  assert.throws(() => dataSource({ DATA_SOURCE: 'api' }), /json or database/);
});

test('JSON compatibility catalogs expose all four product types without hidden records', async () => {
  const previous = process.env.DATA_SOURCE; process.env.DATA_SOURCE = 'json';
  try {
    for (const type of ['cigar', 'tobacco', 'pipe', 'caffeine']) {
      const products = await readPublicCatalog(type);
      assert.ok(products.length > 0, `${type} catalog should not be empty`);
      assert.ok(products.every((product) => product.hidden !== true));
    }
  } finally { if (previous === undefined) delete process.env.DATA_SOURCE; else process.env.DATA_SOURCE = previous; }
});

test('product paths use blocking fallback so newly published routes can appear', async () => {
  const previous = process.env.DATA_SOURCE; process.env.DATA_SOURCE = 'json';
  try {
    const result = await publicProductPaths('tobacco');
    assert.equal(result.fallback, 'blocking');
    assert.ok(result.paths.length > 0);
  } finally { if (previous === undefined) delete process.env.DATA_SOURCE; else process.env.DATA_SOURCE = previous; }
});

test('JSON product pages keep catalog navigation order and expose only link fields for neighbors', async (t) => {
  const previous = process.env.DATA_SOURCE;
  process.env.DATA_SOURCE = 'json';
  t.after(() => { if (previous === undefined) delete process.env.DATA_SOURCE; else process.env.DATA_SOURCE = previous; });
  const [first, second] = await readPublicCatalog('tobacco');
  assert.deepEqual(await readPublicProductPage('tobacco', first.slug), {
    product: first, prev: null, next: { slug: second.slug, name: second['Tobacco Name'] },
  });
  assert.equal(await readPublicProductPage('tobacco', 'missing-test-product'), null);
  const sitemap = await readPublicSitemapSlugs();
  assert.ok(sitemap.some(({ type, slug }) => type === 'tobacco' && slug === first.slug));
  assert.deepEqual([...new Set(sitemap.map(({ type }) => type))], ['cigar', 'tobacco']);
});
