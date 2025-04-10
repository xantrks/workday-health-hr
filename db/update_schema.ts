import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error('Error: POSTGRES_URL environment variable is not set');
  process.exit(1);
}

// Set up PostgreSQL client
const sql = postgres(connectionString + '?sslmode=require', { max: 1 });
const db = drizzle(sql);

async function updateSchema() {
  console.log('Starting database schema update...');
  try {
    // Run migrations
    console.log('Applying migrations from schema...');
    
    // Path to the migrations folder - adjust if your migrations are elsewhere
    const migrationsFolder = path.join(__dirname, '../lib/drizzle');
    
    await migrate(db, { migrationsFolder });
    
    console.log('Database schema updated successfully!');
  } catch (error) {
    console.error('Error updating database schema:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

updateSchema().catch(console.error); 