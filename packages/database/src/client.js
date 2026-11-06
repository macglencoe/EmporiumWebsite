import { drizzle } from 'drizzle-orm/neon-http';

export function createDatabase(connectionString) {
  if (typeof window !== 'undefined') {
    throw new Error('@emporium/database can only be used on the server');
  }

  if (!connectionString) {
    throw new Error('A Neon connection string is required');
  }

  return drizzle(connectionString);
}

export function createDatabaseFromEnvironment(environment = process.env) {
  return createDatabase(environment.DATABASE_URL);
}
