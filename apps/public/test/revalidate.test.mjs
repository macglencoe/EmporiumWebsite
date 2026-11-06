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
  await handler({ method: 'POST', headers: { authorization: `Bearer ${secret}` }, body: { paths: ['/', '/cigars', '/cigars'] } }, res);
  assert.equal(res.state.statusCode, 200);
  assert.deepEqual(res.state.paths, ['/', '/cigars']);
});

test('revalidation rejects external and protocol-relative paths', async () => {
  const secret = 'test-secret-that-is-at-least-32-characters'; process.env.REVALIDATION_SECRET = secret;
  for (const path of ['//example.com', 'https://example.com']) {
    const res = response(); await handler({ method: 'POST', headers: { authorization: `Bearer ${secret}` }, body: { paths: [path] } }, res);
    assert.equal(res.state.statusCode, 400);
  }
});
