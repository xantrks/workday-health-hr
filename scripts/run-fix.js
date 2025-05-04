#!/usr/bin/env node

// Simple wrapper script to run the fix-db.js script with ts-node
// Usage: node scripts/run-fix.js

const { execSync } = require('child_process');
const path = require('path');

// Set up environment for ts-node
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
console.log('Setting up environment for database fix...');

// Run the script using npx ts-node for TypeScript support
try {
  console.log('Running database fix script...');
  
  execSync('npx ts-node --compiler-options \'{"module":"CommonJS"}\' db/migrations/0006_fix_employee_leave_relationship.ts', {
    stdio: 'inherit'
  });
  
  console.log('Database fix completed successfully!');
} catch (error) {
  console.error('Error running database fix:', error.message);
  process.exit(1);
} 