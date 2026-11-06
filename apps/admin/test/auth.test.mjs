import assert from 'node:assert/strict';
import test from 'node:test';

import { clearCookie, makeCookie, readSignedToken, sessionHours } from '../lib/auth/server.mjs';

test('session cookies are signed, HTTP-only, and strict same-site', () => {
  process.env.AUTH_COOKIE_SECRET = 'test-only-secret-that-is-at-least-32-characters';
  process.env.AUTH_SESSION_HOURS = '12';
  const cookie = makeCookie('opaque-token');
  assert.match(cookie, /^emporium_admin_session=opaque-token\.[A-Za-z0-9_-]+;/);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Strict/);
  assert.equal(readSignedToken({ headers: { cookie } }), 'opaque-token');
  assert.equal(readSignedToken({ headers: { cookie: cookie.replace('opaque-token', 'changed-token') } }), null);
  assert.equal(sessionHours(), 12);
  assert.match(clearCookie(), /Max-Age=0/);
});

test('session lifetime is bounded', () => {
  process.env.AUTH_SESSION_HOURS = '169';
  assert.throws(() => sessionHours(), /integer between 1 and 168/);
  delete process.env.AUTH_SESSION_HOURS;
});
