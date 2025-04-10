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

async function verifyData() {
  try {
    // Check organizations
    const organizations = await client.unsafe(`
      SELECT * FROM "Organization"
    `);
    
    console.log('Organizations:');
    console.table(organizations.map(org => ({
      id: org.id,
      name: org.name,
      subscription_plan: org.subscription_plan
    })));
    
    // Check users
    const users = await client.unsafe(`
      SELECT id, first_name, last_name, email, role, is_super_admin, organization_id 
      FROM "User"
      ORDER BY role
    `);
    
    console.log('Users:');
    console.table(users.map(user => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
      is_super_admin: user.is_super_admin,
      organization_id: user.organization_id
    })));

  } catch (error) {
    console.error('Error verifying data:', error);
  } finally {
    await client.end();
  }
}

verifyData(); 