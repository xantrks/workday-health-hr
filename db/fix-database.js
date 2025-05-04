#!/usr/bin/env node

// Simple wrapper script to run the JavaScript update-db.js file
// Usage: node fix-database.js

const { execSync } = require('child_process');
const path = require('path');

// Get the full path to update-db.js
const scriptPath = path.resolve(__dirname, 'update-db.js');

console.log(`Running database fix script: ${scriptPath}`);

try {
  // Run the script directly since it's now a CommonJS file
  execSync(`node ${scriptPath}`, { 
    stdio: 'inherit',
    env: {
      ...process.env,
      // You can add any additional environment variables here if needed
    }
  });
  
  console.log('Database fix script completed successfully!');
} catch (error) {
  console.error('Error running database fix script:', error.message);
  process.exit(1);
} 