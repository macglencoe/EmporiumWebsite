import { migrate } from 'drizzle-orm/neon-http/migrator';
import { fileURLToPath } from 'node:url';

import { createDatabase } from '../src/client.js';
import { requireDatabaseUrl } from './environment.js';

const database = createDatabase(requireDatabaseUrl());

await migrate(database, {
  migrationsFolder: fileURLToPath(new URL('../migrations', import.meta.url)),
});

console.log('Database migrations are current.');
