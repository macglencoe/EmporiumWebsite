import '../lib/auth/load-environment.mjs';

const { revokeAllSessions } = await import('../lib/auth/server.mjs');
await revokeAllSessions();
console.log('All store-admin sessions are revoked.');
