-- Check Employee table definition
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Employee'
ORDER BY ordinal_position;

-- Check LeaveRequest table definition
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'LeaveRequest'
ORDER BY ordinal_position;

-- Check foreign key constraints for LeaveRequest
SELECT 
  tc.constraint_name, 
  kcu.column_name as constrained_column, 
  ccu.table_name as referenced_table,
  ccu.column_name as referenced_column,
  rc.delete_rule
FROM 
  information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.referential_constraints rc
    ON tc.constraint_name = rc.constraint_name
  JOIN information_schema.constraint_column_usage ccu
    ON rc.unique_constraint_name = ccu.constraint_name
WHERE
  tc.constraint_type = 'FOREIGN KEY' AND
  tc.table_name = 'LeaveRequest';

-- Check Employee primary key
SELECT 
  tc.constraint_name, 
  kcu.column_name
FROM 
  information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
WHERE
  tc.table_name = 'Employee' AND
  tc.constraint_type = 'PRIMARY KEY';

-- Count records in each table
SELECT 'Employee' as table_name, COUNT(*) FROM "Employee"
UNION ALL
SELECT 'LeaveRequest' as table_name, COUNT(*) FROM "LeaveRequest";

-- Check for orphaned LeaveRequest records (employee_id with no matching Employee.id)
SELECT lr.id, lr.employee_id, lr.leave_type, lr.start_date, lr.end_date
FROM "LeaveRequest" lr
LEFT JOIN "Employee" e ON lr.employee_id = e.id
WHERE e.id IS NULL;

-- Check for User records with no corresponding Employee record
SELECT u.id, u.email, u.first_name, u.last_name
FROM "User" u
LEFT JOIN "Employee" e ON u.id = e.user_id
WHERE e.id IS NULL
LIMIT 10;

-- Check for Employee records with details (debug what's in the Employee table)
SELECT e.id, e.user_id, u.email, u.first_name, u.last_name, e.job_title
FROM "Employee" e
JOIN "User" u ON e.user_id = u.id
LIMIT 10; 