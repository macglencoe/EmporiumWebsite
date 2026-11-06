import crypto from 'node:crypto';

import { and, eq, gt, isNull, sql } from 'drizzle-orm';
import argon2 from 'argon2';
import {
  adminAuthEvents,
  adminCredentials,
  adminSessions,
  createDatabase,
} from '@emporium/database';

export const COOKIE_NAME = 'emporium_admin_session';
export const ADMIN_USERNAME = 'store-admin';
export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;
const DEFAULT_SESSION_HOURS = 12;

const database = () => {
  const connectionString = process.env.ADMIN_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) throw new Error('ADMIN_DATABASE_URL is required');
  const connection = new URL(connectionString);
  if (!connection.username || !connection.password) {
    throw new Error('ADMIN_DATABASE_URL must include the admin role name and password');
  }
  return createDatabase(connectionString);
};
const tokenHash = (token) => crypto.createHash('sha256').update(token).digest('hex');
const cookieSecret = () => {
  const secret = process.env.AUTH_COOKIE_SECRET;
  if (!secret || secret.length < 32) throw new Error('AUTH_COOKIE_SECRET must contain at least 32 characters');
  return secret;
};
const signature = (token) => crypto.createHmac('sha256', cookieSecret()).update(token).digest('base64url');
const constantEqual = (left, right) => {
  const a = Buffer.from(left); const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};
const parseCookies = (header = '') => Object.fromEntries(header.split(';').map((part) => part.trim().split(/=(.*)/s).slice(0, 2)).filter(([key]) => key));

export function sessionHours() {
  const value = Number(process.env.AUTH_SESSION_HOURS || DEFAULT_SESSION_HOURS);
  if (!Number.isInteger(value) || value <= 0 || value > 168) throw new Error('AUTH_SESSION_HOURS must be an integer between 1 and 168');
  return value;
}

export function makeCookie(token) {
  const value = `${token}.${signature(token)}`;
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${sessionHours() * 3600}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}

export function clearCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
}

export function readSignedToken(req) {
  const value = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!value) return null;
  const separator = value.lastIndexOf('.');
  if (separator < 1) return null;
  const token = value.slice(0, separator); const supplied = value.slice(separator + 1);
  return constantEqual(signature(token), supplied) ? token : null;
}

export async function authenticateRequest(req, { touch = true } = {}) {
  const token = readSignedToken(req);
  if (!token) return null;
  const db = database();
  const [session] = await db.select({ id: adminSessions.id, username: adminCredentials.username })
    .from(adminSessions)
    .innerJoin(adminCredentials, and(eq(adminCredentials.id, adminSessions.credentialId), eq(adminCredentials.credentialVersion, adminSessions.credentialVersion)))
    .where(and(eq(adminSessions.tokenHash, tokenHash(token)), isNull(adminSessions.revokedAt), gt(adminSessions.expiresAt, new Date())))
    .limit(1);
  if (!session) return null;
  if (touch) await db.update(adminSessions).set({ lastUsedAt: new Date() }).where(eq(adminSessions.id, session.id));
  return session;
}

export async function signIn(password) {
  const db = database();
  const [credential] = await db.select().from(adminCredentials).where(eq(adminCredentials.username, ADMIN_USERNAME)).limit(1);
  if (!credential) return { ok: false, reason: 'invalid' };
  const now = new Date();
  if (credential.lockedUntil && new Date(credential.lockedUntil) > now) return { ok: false, reason: 'locked' };
  const valid = await argon2.verify(credential.passwordHash, password, { type: argon2.argon2id });
  if (!valid) {
    const [updated] = await db.update(adminCredentials).set({
      failedAttempts: sql`case when ${adminCredentials.failedAttempts} + 1 >= ${MAX_FAILED_ATTEMPTS} then 0 else ${adminCredentials.failedAttempts} + 1 end`,
      lockedUntil: sql`case when ${adminCredentials.failedAttempts} + 1 >= ${MAX_FAILED_ATTEMPTS} then now() + (${LOCKOUT_MINUTES} * interval '1 minute') else ${adminCredentials.lockedUntil} end`,
      updatedAt: now,
    }).where(eq(adminCredentials.id, credential.id)).returning({ lockedUntil: adminCredentials.lockedUntil });
    const locked = updated.lockedUntil && new Date(updated.lockedUntil) > now;
    await db.insert(adminAuthEvents).values({ action: locked ? 'login_locked' : 'login_failed' });
    return { ok: false, reason: locked ? 'locked' : 'invalid' };
  }
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(now.getTime() + sessionHours() * 3_600_000);
  await db.batch([
    db.update(adminCredentials).set({ failedAttempts: 0, lockedUntil: null, updatedAt: now }).where(eq(adminCredentials.id, credential.id)),
    db.insert(adminSessions).values({ credentialId: credential.id, tokenHash: tokenHash(token), credentialVersion: credential.credentialVersion, expiresAt }),
    db.insert(adminAuthEvents).values({ action: 'login_succeeded' }),
  ]);
  return { ok: true, token, expiresAt };
}

export async function revokeRequestSession(req) {
  const token = readSignedToken(req); if (!token) return;
  const db = database();
  await db.batch([
    db.update(adminSessions).set({ revokedAt: new Date() }).where(and(eq(adminSessions.tokenHash, tokenHash(token)), isNull(adminSessions.revokedAt))),
    db.insert(adminAuthEvents).values({ action: 'logout' }),
  ]);
}

export function applyNoStore(res) { res.setHeader('Cache-Control', 'private, no-store, max-age=0'); }
export function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}

export function withAuth(handler) {
  return async function authenticatedHandler(req, res) {
    applyNoStore(res);
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && !sameOrigin(req)) return res.status(403).json({ message: 'Invalid request origin.' });
    const session = await authenticateRequest(req);
    if (!session) return res.status(401).json({ message: 'Authentication required.' });
    req.adminSession = session;
    return handler(req, res);
  };
}

export async function setAdminPassword(password) {
  if (typeof password !== 'string' || password.length < 16) throw new Error('Password must contain at least 16 characters');
  const db = database(); const passwordHash = await argon2.hash(password, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 });
  const [existing] = await db.select().from(adminCredentials).where(eq(adminCredentials.username, ADMIN_USERNAME)).limit(1);
  if (!existing) {
    await db.batch([db.insert(adminCredentials).values({ username: ADMIN_USERNAME, passwordHash }), db.insert(adminAuthEvents).values({ action: 'credential_created' })]);
  } else {
    await db.batch([
      db.update(adminCredentials).set({ passwordHash, credentialVersion: sql`${adminCredentials.credentialVersion} + 1`, failedAttempts: 0, lockedUntil: null, passwordChangedAt: new Date(), updatedAt: new Date() }).where(eq(adminCredentials.id, existing.id)),
      db.update(adminSessions).set({ revokedAt: new Date() }).where(and(eq(adminSessions.credentialId, existing.id), isNull(adminSessions.revokedAt))),
      db.insert(adminAuthEvents).values({ action: 'credential_rotated' }),
    ]);
  }
}

export async function revokeAllSessions() {
  const db = database();
  const [credential] = await db.select().from(adminCredentials).where(eq(adminCredentials.username, ADMIN_USERNAME)).limit(1);
  if (!credential) throw new Error('store-admin credential has not been created');
  await db.batch([
    db.update(adminSessions).set({ revokedAt: new Date() }).where(and(eq(adminSessions.credentialId, credential.id), isNull(adminSessions.revokedAt))),
    db.insert(adminAuthEvents).values({ action: 'sessions_revoked' }),
  ]);
}
