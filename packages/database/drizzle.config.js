import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDirectory = dirname(fileURLToPath(import.meta.url));

config({ path: join(packageDirectory, '../../.env.local'), quiet: true });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required to run database migrations');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: join(packageDirectory, 'src/schema/index.js').replaceAll('\\', '/'),
  out: relative(process.cwd(), join(packageDirectory, 'migrations')).replaceAll('\\', '/'),
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  strict: true,
  verbose: true,
});
