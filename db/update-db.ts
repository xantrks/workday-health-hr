import { promises as fs } from 'fs';
import { resolve } from 'path';
import postgres from 'postgres';

async function main() {
  // Load the database URL from environment
  const dbUrl = process.env.POSTGRES_URL;
  
  if (!dbUrl) {
    console.error('ERROR: POSTGRES_URL environment variable is not set.');
    console.error('Please set POSTGRES_URL environment variable to connect to your database.');
    process.exit(1);
  }
  
  console.log('Connecting to database...');
  
  // Create SQL client
  const sql = postgres(dbUrl);
  
  try {
    // First run the check script to see the current state
    console.log('\n=== RUNNING DATABASE CHECKS (BEFORE) ===');
    const checkSqlPath = resolve(__dirname, 'check-db-tables.sql');
    const checkSql = await fs.readFile(checkSqlPath, 'utf8');
    
    // Split the check SQL into separate queries
    const checkQueries = checkSql.split(';').filter(q => q.trim());
    
    for (const query of checkQueries) {
      if (!query.trim()) continue;
      
      console.log(`\nExecuting query: ${query.trim().split('\n')[0]}...`);
      try {
        const result = await sql.unsafe(query);
        console.log('Result:', JSON.stringify(result, null, 2));
      } catch (err) {
        console.error('Error executing check query:', err);
      }
    }
    
    // Now run the fix script
    console.log('\n=== APPLYING DATABASE FIXES ===');
    const fixSqlPath = resolve(__dirname, 'fix-leave-request.sql');
    const fixSql = await fs.readFile(fixSqlPath, 'utf8');
    
    try {
      // Execute the fix script as a single transaction
      await sql.unsafe(fixSql);
      console.log('Database fixes applied successfully!');
    } catch (err) {
      console.error('Error applying database fixes:', err);
    }
    
    // Run the check script again to see the new state
    console.log('\n=== RUNNING DATABASE CHECKS (AFTER) ===');
    for (const query of checkQueries) {
      if (!query.trim()) continue;
      
      console.log(`\nExecuting query: ${query.trim().split('\n')[0]}...`);
      try {
        const result = await sql.unsafe(query);
        console.log('Result:', JSON.stringify(result, null, 2));
      } catch (err) {
        console.error('Error executing check query:', err);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the connection
    await sql.end();
    console.log('\nDatabase connection closed.');
  }
}

// Run the script
main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
}); 