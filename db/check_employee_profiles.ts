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

async function checkEmployeeProfiles() {
  try {
    // Check Employee profiles
    const employeeProfiles = await client.unsafe(`
      SELECT e.*, u.email, u.first_name, u.last_name
      FROM "Employee" e
      JOIN "User" u ON e.user_id = u.id
    `);
    
    console.log('Employee Profiles:');
    console.table(employeeProfiles.map(emp => ({
      id: emp.id,
      user_id: emp.user_id,
      name: `${emp.first_name} ${emp.last_name}`,
      email: emp.email,
      gender: emp.gender,
      job_title: emp.job_title,
      hire_date: emp.hire_date
    })));

  } catch (error) {
    console.error('Error checking employee profiles:', error);
  } finally {
    await client.end();
  }
}

checkEmployeeProfiles(); 