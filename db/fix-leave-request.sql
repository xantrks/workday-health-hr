-- Check if the constraint exists and drop it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'LeaveRequest_employee_id_Employee_id_fk' 
    AND constraint_type = 'FOREIGN KEY'
  ) THEN
    EXECUTE 'ALTER TABLE "LeaveRequest" DROP CONSTRAINT "LeaveRequest_employee_id_Employee_id_fk";';
    RAISE NOTICE 'Constraint dropped.';
  ELSE
    RAISE NOTICE 'Constraint does not exist.';
  END IF;
END $$;

-- Make sure Employee table is properly set up
DO $$
BEGIN
  -- Make sure the id column in Employee is set as primary key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'Employee_pkey' 
    AND constraint_type = 'PRIMARY KEY'
  ) THEN
    EXECUTE 'ALTER TABLE "Employee" ADD CONSTRAINT "Employee_pkey" PRIMARY KEY (id);';
    RAISE NOTICE 'Employee primary key constraint added.';
  END IF;
END $$;

-- Add the proper foreign key constraint
ALTER TABLE "LeaveRequest" 
ADD CONSTRAINT "LeaveRequest_employee_id_Employee_id_fk" 
FOREIGN KEY (employee_id) 
REFERENCES "Employee"(id) 
ON DELETE CASCADE;

-- Fix any existing records with invalid employee_id
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  -- Count invalid records
  SELECT COUNT(*) INTO invalid_count 
  FROM "LeaveRequest" lr
  LEFT JOIN "Employee" e ON lr.employee_id = e.id
  WHERE e.id IS NULL;
  
  RAISE NOTICE 'Found % leave requests with invalid employee references', invalid_count;
  
  -- Delete invalid records (OPTIONAL - uncomment if you want to clean up)
  -- DELETE FROM "LeaveRequest" 
  -- WHERE employee_id NOT IN (SELECT id FROM "Employee");
END $$; 