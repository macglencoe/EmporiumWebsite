import { NextResponse } from 'next/server';

const COOKIE_NAME = 'emp_auth';

const PUBLIC_PATHS = [
  '/login',
  '/login/',
  '/api/login',
  '/api/login/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
];

const PUBLIC_FILE = /\.(.*)$/;

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function getCookieValue(cookie) {
  if (!cookie) return null;
  if (typeof cookie === 'string') return cookie;
  if (typeof cookie.value === 'string') return cookie.value;
  return null;
}

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api') && pathname === '/api/login') {
    return NextResponse.next();
  }

  if (PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const configuredPassword = process.env.SITE_PASSWORD;
  if (!configuredPassword) {
    console.warn('SITE_PASSWORD is not configured. Skipping auth gate.');
    return NextResponse.next();
  }

  const cookie = getCookieValue(req.cookies.get(COOKIE_NAME));
  if (!cookie) {
    if (pathname.startsWith('/api')) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', `${pathname}${search || ''}`);
    return NextResponse.redirect(loginUrl);
  }

  const expected = await hashPassword(configuredPassword);
  if (cookie !== expected) {
    if (pathname.startsWith('/api')) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', `${pathname}${search || ''}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
