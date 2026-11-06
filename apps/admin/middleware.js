import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const COOKIE_NAME = 'emporium_admin_session';
const encoder = new TextEncoder();
const base64url = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');

async function validSignature(value) {
  const separator = value?.lastIndexOf('.') ?? -1; if (separator < 1) return false;
  const token = value.slice(0, separator); const supplied = value.slice(separator + 1); const secret = process.env.AUTH_COOKIE_SECRET;
  if (!secret || secret.length < 32) return false;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const expected = base64url(await crypto.subtle.sign('HMAC', key, encoder.encode(token)));
  if (expected.length !== supplied.length) return false;
  let difference = 0; for (let index = 0; index < expected.length; index += 1) difference |= expected.charCodeAt(index) ^ supplied.charCodeAt(index);
  return difference === 0;
}

async function activeSession(value) {
  const separator = value.lastIndexOf('.'); const token = value.slice(0, separator);
  const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(token)))].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  const connection = process.env.ADMIN_DATABASE_URL || process.env.DATABASE_URL; if (!connection) return false;
  const sql = neon(connection);
  const rows = await sql`select 1 from admin_sessions session join admin_credentials credential on credential.id = session.credential_id and credential.credential_version = session.credential_version where session.token_hash = ${hash} and session.revoked_at is null and session.expires_at > now() limit 1`;
  return rows.length === 1;
}

export async function middleware(request) {
  const value = request.cookies.get(COOKIE_NAME);
  if (await validSignature(value) && await activeSession(value)) {
    const response = NextResponse.next(); response.headers.set('Cache-Control', 'private, no-store, max-age=0'); return response;
  }
  if (request.nextUrl.pathname.startsWith('/api/')) return NextResponse.json({ message: 'Authentication required.' }, { status: 401, headers: { 'Cache-Control': 'private, no-store, max-age=0' } });
  const login = request.nextUrl.clone(); login.pathname = '/login'; login.search = ''; login.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(login);
}

export const config = { matcher: ['/((?!login|api/auth/login|_next/static|_next/image|favicon.ico).*)'] };
