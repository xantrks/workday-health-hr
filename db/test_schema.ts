import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Choose the right environment variable
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Missing database connection string');
  process.exit(1);
}

const client = postgres(connectionString);
const db = drizzle(client);

async function testSchema() {
  try {
    // Test Organization table
    const orgQuery = await client.unsafe(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Organization'
    `);
    
    console.log('Organization table columns:');
    console.table(orgQuery);
    
    // Test User table organization_id column
    const userQuery = await client.unsafe(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'User' AND column_name = 'organization_id'
    `);
    
    console.log('User table organization_id column:');
    console.table(userQuery);
    
    // Test Employee table
    const employeeQuery = await client.unsafe(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Employee'
    `);
    
    console.log('Employee table columns:');
    console.table(employeeQuery);
    
    // Test health record table organization_id column
    const healthRecordQuery = await client.unsafe(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'HealthRecord' AND column_name = 'organization_id'
    `);
    
    console.log('HealthRecord table organization_id column:');
    console.table(healthRecordQuery);

  } catch (error) {
    console.error('Error testing schema:', error);
  } finally {
    await client.end();
  }
}

testSchema(); 