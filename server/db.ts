import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { tasks } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { log } from './vite';

export const getDbClient = () => {
  if (!process.env.DATABASE_URL) {
    log('No DATABASE_URL found, falling back to in-memory storage', 'db');
    return null;
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);
    log('Database connection established', 'db');
    return db;
  } catch (error) {
    log(`Failed to connect to database: ${error}`, 'db');
    return null;
  }
};

// Export the DB client
export const db = getDbClient();