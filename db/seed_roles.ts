import 'dotenv/config';
import path from 'path';

import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { role } from './schema';

// Database connection
const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
  console.error('Error: POSTGRES_URL environment variable is not set');
  process.exit(1);
}

// Set up PostgreSQL client
const sql = postgres(connectionString + '?sslmode=require', { max: 1 });
const db = drizzle(sql);

// Define roles with hierarchy levels
const roles = [
  {
    name: 'superadmin',
    description: 'Sanicle system administrators with access to all organizations',
    level: 10,
  },
  {
    name: 'orgadmin',
    description: 'Organization administrators who manage their organization',
    level: 20,
  },
  {
    name: 'hr',
    description: 'HR personnel who manage employees within their organization',
    level: 30,
  },
  {
    name: 'manager',
    description: 'Team managers with limited HR responsibilities',
    level: 35,
  },
  {
    name: 'employee',
    description: 'Regular employees with basic access',
    level: 40,
  },
];

async function seedRoles() {
  try {
    console.log('Starting role seeding...');
    
    for (const roleData of roles) {
      // Check if role already exists
      const existingRole = await db.select()
        .from(role)
        .where(eq(role.name, roleData.name));
      
      if (existingRole.length === 0) {
        // Create role if it doesn't exist
        await db.insert(role).values({
          name: roleData.name,
          description: roleData.description,
          level: roleData.level,
        });
        console.log(`Created role: ${roleData.name}`);
      } else {
        // Update existing role
        await db.update(role)
          .set({
            description: roleData.description,
            level: roleData.level,
          })
          .where(eq(role.name, roleData.name));
        console.log(`Updated role: ${roleData.name}`);
      }
    }
    
    console.log('Role seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding roles:', error);
  } finally {
    await sql.end();
  }
}

// Run the seed function
seedRoles().catch(console.error); 