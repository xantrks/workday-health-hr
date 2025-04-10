import { config } from 'dotenv';
import postgres from 'postgres';

// Load environment variables
config({ path: '.env.local' });

// Choose the right environment variable
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Missing database connection string');
  process.exit(1);
}

const client = postgres(connectionString);

async function testMoreTables() {
  try {
    // Test UserRole table
    const userRoleQuery = await client.unsafe(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'UserRole'
    `);
    
    console.log('UserRole table columns:');
    console.table(userRoleQuery);
    
    // Test all tables with organization_id column
    const allOrgColumns = await client.unsafe(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE column_name = 'organization_id'
      ORDER BY table_name
    `);
    
    console.log('All tables with organization_id column:');
    console.table(allOrgColumns);
    
    // Test is_super_admin column on User table
    const superAdminColumn = await client.unsafe(`
      SELECT table_name, column_name, data_type, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'User' AND column_name = 'is_super_admin'
    `);
    
    console.log('User table is_super_admin column:');
    console.table(superAdminColumn);

  } catch (error) {
    console.error('Error testing schema:', error);
  } finally {
    await client.end();
  }
}

testMoreTables(); 