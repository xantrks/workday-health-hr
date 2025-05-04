import { sql } from '@vercel/postgres';

export async function applyEmployeeLeaveRelationshipFixes() {
  console.log('Applying fixes to Employee-LeaveRequest relationship...');

  try {
    // Check if the constraint exists
    const checkConstraint = await sql`
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'LeaveRequest_employee_id_Employee_id_fk' 
      AND constraint_type = 'FOREIGN KEY'
    `;

    // Drop the constraint if it exists
    if (checkConstraint.rowCount && checkConstraint.rowCount > 0) {
      console.log('Foreign key constraint found. Dropping it...');
      await sql`ALTER TABLE "LeaveRequest" DROP CONSTRAINT "LeaveRequest_employee_id_Employee_id_fk"`;
      console.log('Constraint dropped successfully.');
    } else {
      console.log('Foreign key constraint not found.');
    }

    // Find all users without an Employee record and create records for them
    console.log('Creating Employee records for users that need them...');
    const usersWithoutEmployees = await sql`
      SELECT u.id, u.organization_id 
      FROM "User" u
      LEFT JOIN "Employee" e ON u.id = e.user_id
      WHERE e.id IS NULL
    `;

    const userCount = usersWithoutEmployees.rowCount || 0;
    console.log(`Found ${userCount} users without Employee records.`);

    // Create Employee records for each user that needs one
    for (const user of usersWithoutEmployees.rows) {
      console.log(`Creating Employee record for user ${user.id}...`);
      await sql`
        INSERT INTO "Employee" (
          user_id,
          organization_id,
          job_title,
          created_at,
          updated_at
        )
        VALUES (
          ${user.id},
          ${user.organization_id || null},
          'Employee',
          NOW(),
          NOW()
        )
      `;
    }

    // Re-add the foreign key constraint
    console.log('Re-adding foreign key constraint...');
    await sql`
      ALTER TABLE "LeaveRequest" 
      ADD CONSTRAINT "LeaveRequest_employee_id_Employee_id_fk" 
      FOREIGN KEY (employee_id) 
      REFERENCES "Employee"(id) 
      ON DELETE CASCADE
    `;
    console.log('Foreign key constraint added successfully.');

    // Check for any LeaveRequest records with invalid employee_id
    const invalidLeaveRequests = await sql`
      SELECT lr.id, lr.employee_id
      FROM "LeaveRequest" lr
      LEFT JOIN "Employee" e ON lr.employee_id = e.id
      WHERE e.id IS NULL
    `;

    if (invalidLeaveRequests.rowCount && invalidLeaveRequests.rowCount > 0) {
      console.log(`Found ${invalidLeaveRequests.rowCount} invalid leave requests. Cleaning up...`);
      await sql`
        DELETE FROM "LeaveRequest" 
        WHERE employee_id IN (
          SELECT lr.employee_id
          FROM "LeaveRequest" lr
          LEFT JOIN "Employee" e ON lr.employee_id = e.id
          WHERE e.id IS NULL
        )
      `;
      console.log('Invalid leave requests cleaned up.');
    } else {
      console.log('No invalid leave requests found.');
    }

    console.log('Employee-LeaveRequest relationship fixes applied successfully!');
    return true;
  } catch (error) {
    console.error('Error applying Employee-LeaveRequest relationship fixes:', error);
    throw error;
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  applyEmployeeLeaveRelationshipFixes()
    .then(() => {
      console.log('Migration completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
} 