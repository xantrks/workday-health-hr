#!/usr/bin/env node

// Script to run the Employee-LeaveRequest relationship fix
// Usage: node scripts/fix-db.js

require('dotenv').config();
const path = require('path');

// Import the fix function
async function runFix() {
  try {
    console.log('Starting database fix for Employee-LeaveRequest relationship...');
    
    // Use dynamic import to handle TypeScript file
    const { applyEmployeeLeaveRelationshipFixes } = await import(
      '../db/migrations/0006_fix_employee_leave_relationship.ts'
    );
    
    // Run the fix function
    await applyEmployeeLeaveRelationshipFixes();
    
    console.log('Database fix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running database fix:', error);
    process.exit(1);
  }
}

// Run the fix script
runFix(); 