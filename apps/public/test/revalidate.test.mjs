import assert from 'node:assert/strict';
import test from 'node:test';

import handler from '../lib/revalidation/server.mjs';

const response = () => {
  const state = { statusCode: 200, body: null, paths: [] };
  return { state, setHeader() {}, status(code) { state.statusCode = code; return this; }, json(body) { state.body = body; return this; }, async revalidate(path) { state.paths.push(path); } };
};

test('revalidation requires a strong configured bearer secret', async () => {
  process.env.REVALIDATION_SECRET = 'test-secret-that-is-at-least-32-characters';
  const res = response();
  await handler({ method: 'POST', headers: {}, body: { paths: ['/'] } }, res);
  assert.equal(res.state.statusCode, 401);
});

test('revalidation accepts unique local paths', async () => {
  const secret = 'test-secret-that-is-at-least-32-characters'; process.env.REVALIDATION_SECRET = secret;
  const res = response();
  await handler({ method: 'POST', headers: { authorization: `Bearer ${secret}` }, body: { paths: ['/', '/cigars', '/cigars/'] } }, res);
  assert.equal(res.state.statusCode, 200);
  assert.deepEqual(res.state.paths, ['/', '/cigars/']);
});

test('revalidation rejects external and protocol-relative paths', async () => {
  const secret = 'test-secret-that-is-at-least-32-characters'; process.env.REVALIDATION_SECRET = secret;
  for (const path of ['//example.com', 'https://example.com']) {
    const res = response(); await handler({ method: 'POST', headers: { authorization: `Bearer ${secret}` }, body: { paths: [path] } }, res);
    assert.equal(res.state.statusCode, 400);
  }
});

test('a signed sitemap refresh reports a cache failure without losing page results', async () => {
  const secret = 'test-secret-that-is-at-least-32-characters';
  process.env.REVALIDATION_SECRET = secret;
  const res = response();
  await handler({
    method: 'POST',
    headers: { authorization: `Bearer ${secret}` },
    body: { paths: ['/tobacco'], sitemapChanged: true },
  }, res, async () => { throw new Error('Cache unavailable'); });
  assert.equal(res.state.statusCode, 500);
  assert.deepEqual(res.state.paths, ['/tobacco/']);
  assert.deepEqual(res.state.body, {
    revalidated: 1,
    failed: [{ path: '/sitemap.xml', message: 'Cache unavailable' }],
  });
});

test('a signed sitemap-only refresh leaves page caches untouched', async () => {
  const secret = 'test-secret-that-is-at-least-32-characters';
  process.env.REVALIDATION_SECRET = secret;
  const res = response();
  let invalidated = false;
  await handler({
    method: 'POST',
    headers: { authorization: `Bearer ${secret}` },
    body: { paths: [], sitemapChanged: true },
  }, res, async () => { invalidated = true; });
  assert.equal(res.state.statusCode, 200);
  assert.equal(invalidated, true);
  assert.deepEqual(res.state.paths, []);
  assert.deepEqual(res.state.body, { revalidated: 0, failed: [] });
});

test('a signed connection check returns public settings without invalidating caches', async (t) => {
  const secret = 'test-secret-that-is-at-least-32-characters';
  process.env.REVALIDATION_SECRET = secret;
  const previousSource = process.env.DATA_SOURCE;
  process.env.DATA_SOURCE = 'database';
  t.after(() => {
    if (previousSource === undefined) delete process.env.DATA_SOURCE;
    else process.env.DATA_SOURCE = previousSource;
  });
  const res = response();
  await handler({
    method: 'POST',
    headers: { authorization: `Bearer ${secret}` },
    body: { action: 'check' },
  }, res, async () => assert.fail('Connection check must not invalidate the sitemap'));
  assert.equal(res.state.statusCode, 200);
  assert.deepEqual(res.state.body, { dataSource: 'database', revalidationMode: 'on-demand' });
  assert.deepEqual(res.state.paths, []);
});
