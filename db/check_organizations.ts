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

async function checkOrganizations() {
  try {
    // Check all organizations
    const organizations = await client.unsafe(`
      SELECT *
      FROM "Organization"
    `);
    
    console.log('All Organizations:');
    console.table(organizations.map(org => ({
      id: org.id,
      name: org.name,
      subscription_plan: org.subscription_plan,
      created_at: org.created_at
    })));
    
    // Count users by organization and role
    const usersByOrgAndRole = await client.unsafe(`
      SELECT o.name as organization_name, u.role, COUNT(*) as user_count
      FROM "User" u
      LEFT JOIN "Organization" o ON u.organization_id = o.id
      GROUP BY o.name, u.role
      ORDER BY o.name, u.role
    `);
    
    console.log('Users by Organization and Role:');
    console.table(usersByOrgAndRole);

  } catch (error) {
    console.error('Error checking organizations:', error);
  } finally {
    await client.end();
  }
}

checkOrganizations(); 