import { neon } from '@neondatabase/serverless';
import { Redis } from '@upstash/redis';
import { drizzle } from 'drizzle-orm/neon-http';

// Check environment variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error(
    'Missing Redis configuration. Please ensure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables are set. ' +
    'If you are developing locally, check your .env.local file; ' +
    'if deploying on Vercel, add these environment variables in your project settings.'
  );
}

// PostgreSQL connection
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);

// Redis connection
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

// Add connection test
async function testConnection() {
  try {
    const result = await sql`SELECT 1`;
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// Only test connection in development environment
if (process.env.NODE_ENV === 'development') {
  testConnection();
}

export { sql }; 