import { config } from 'dotenv';
import postgres from 'postgres';
import { promises as fs } from 'fs';
import path from 'path';

// Load environment variables
config({ path: '.env.local' });

// Choose the right environment variable
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Missing database connection string');
  process.exit(1);
}

const client = postgres(connectionString);

async function runSqlFile(filePath: string) {
  try {
    console.log(`Reading SQL file: ${filePath}`);
    const sqlContent = await fs.readFile(path.join(process.cwd(), filePath), 'utf8');
    
    // Split into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Found ${statements.length} SQL statements`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}`);
      await client.unsafe(stmt);
    }
    
    console.log(`SQL execution of ${filePath} completed successfully`);
  } catch (error) {
    console.error(`Error executing SQL from ${filePath}:`, error);
  }
}

async function resetDatabase() {
  try {
    console.log("Starting database reset process...");
    
    // Step 1: Clear the database
    console.log("Step 1: Clearing all data...");
    await runSqlFile('db/clear_database.sql');
    
    // Step 2: Seed with new test data
    console.log("Step 2: Seeding with new test data...");
    await runSqlFile('db/seed_multi_tenant_data.sql');
    
    console.log("Database reset completed successfully.");
  } catch (error) {
    console.error("Error during database reset:", error);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

// Run the reset process
resetDatabase(); 