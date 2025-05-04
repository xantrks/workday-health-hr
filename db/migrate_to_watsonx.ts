import path from 'path';
import fs from 'fs';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Connect to the database
const connectionString = process.env.POSTGRES_URL || 'postgres://postgres:postgres@localhost:5432/postgres';
const client = postgres(connectionString);
const db = drizzle(client);

async function runMigration() {
  console.log('Starting migration from Google Gemini AI to IBM WatsonX AI...');
  
  try {
    // Read and execute the migration SQL file
    const migrationPath = path.join(__dirname, 'migrations', '0009_update_chat_for_watsonx.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split by semicolons to get individual statements
    const statements = migrationSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
      
    // Execute each statement
    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 100)}...`);
      await client.unsafe(statement);
    }
    
    console.log('Migration completed successfully!');
    console.log('All chat data has been formatted for compatibility with WatsonX AI');
    console.log('A backup of the original data is stored in the ChatBackup table');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Execute the migration
runMigration().catch(err => {
  console.error('Unhandled error during migration:', err);
  process.exit(1);
}); 