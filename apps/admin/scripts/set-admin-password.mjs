import '../lib/auth/load-environment.mjs';
import { promptHidden } from '../lib/auth/prompt.mjs';

const password = await promptHidden('New store-admin password: ');
const confirmation = await promptHidden('Confirm password: ');
if (password !== confirmation) throw new Error('Passwords do not match');
const { setAdminPassword } = await import('../lib/auth/server.mjs');
await setAdminPassword(password);
console.log('store-admin password updated; all previous sessions are revoked.');
