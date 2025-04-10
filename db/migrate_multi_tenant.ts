import { promises as fs } from 'fs';
import path from 'path';

import { sql } from '../lib/db';

// Function to run a SQL file
async function runSqlFile(filePath: string) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const sqlContent = await fs.readFile(fullPath, 'utf8');
    
    console.log(`Running SQL from ${filePath}...`);
    
    // Split the SQL content by semicolons to execute each statement separately
    const statements = sqlContent.split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    for (const statement of statements) {
      if (statement.length > 0) {
        // Use template literals which is the supported way to execute raw SQL
        await sql`${statement}`;
      }
    }
    
    console.log(`Successfully executed SQL from ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Failed to run SQL file ${filePath}:`, error);
    return false;
  }
}

// Main migration function
async function runMigration() {
  console.log('Starting multi-tenant migration...');
  
  try {
    // Run the migration file
    const success = await runSqlFile('db/migrations/add_multi_tenant_structure.sql');
    
    if (success) {
      console.log('Migration completed successfully!');
    } else {
      console.error('Migration failed.');
    }
  } catch (error) {
    console.error('Migration failed with error:', error);
  }
}

// Check if this file is being run directly
if (require.main === module) {
  runMigration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Unhandled error during migration:', error);
      process.exit(1);
    });
}

export { runMigration }; 