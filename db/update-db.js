#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config(); // Load environment variables from .env files

async function main() {
  // Load the database URL from environment
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('ERROR: DATABASE_URL environment variable is not set.');
    console.error('Please set DATABASE_URL environment variable to connect to your database.');
    process.exit(1);
  }
  
  console.log('Connecting to database...');
  
  // Create SQL client using neon serverless
  const sql = neon(dbUrl);
  
  try {
    // First run the check script to see the current state
    console.log('\n=== RUNNING DATABASE CHECKS (BEFORE) ===');
    const checkSqlPath = path.resolve(__dirname, 'check-db-tables.sql');
    const checkSql = await fs.readFile(checkSqlPath, 'utf8');
    
    // Split the check SQL into separate queries
    const checkQueries = checkSql.split(';').filter(q => q.trim());
    
    for (const query of checkQueries) {
      if (!query.trim()) continue;
      
      console.log(`\nExecuting query: ${query.trim().split('\n')[0]}...`);
      try {
        // Execute query through neon
        const result = await sql(query);
        console.log('Result:', JSON.stringify(result, null, 2));
      } catch (err) {
        console.error('Error executing check query:', err);
      }
    }
    
    // Now run the fix script
    console.log('\n=== APPLYING DATABASE FIXES ===');
    const fixSqlPath = path.resolve(__dirname, 'fix-leave-request.sql');
    const fixSql = await fs.readFile(fixSqlPath, 'utf8');
    
    try {
      // Execute the fix script 
      await sql(fixSql);
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
        const result = await sql(query);
        console.log('Result:', JSON.stringify(result, null, 2));
      } catch (err) {
        console.error('Error executing check query:', err);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Run the script
main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
}); 