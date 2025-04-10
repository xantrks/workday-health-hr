-- Create HR user for Example Company (password is 'Password123')
INSERT INTO "User" (
  "id",
  "first_name",
  "last_name",
  "email",
  "password",
  "agreed_to_terms",
  "role",
  "organization_id",
  "created_at",
  "updated_at"
)
VALUES (
  gen_random_uuid(),
  'Test',
  'HR',
  'hr_test@example.com',
  '$2a$10$ZWuRGDjXTvLpMbTRKK.W3.qVeQMCOOHjDTQSrcUq1zP2WECMf4JI6',
  TRUE,
  'hr',
  (SELECT "id" FROM "Organization" WHERE "name" = 'Example Company' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Create HR user for Sanicle (password is 'Password123')
INSERT INTO "User" (
  "id",
  "first_name",
  "last_name",
  "email",
  "password",
  "agreed_to_terms",
  "role",
  "organization_id",
  "created_at",
  "updated_at"
)
VALUES (
  gen_random_uuid(),
  'Sanicle',
  'HR',
  'hr_test@sanicle.com',
  '$2a$10$ZWuRGDjXTvLpMbTRKK.W3.qVeQMCOOHjDTQSrcUq1zP2WECMf4JI6',
  TRUE,
  'hr',
  (SELECT "id" FROM "Organization" WHERE "name" = 'Sanicle' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Create Employee user for Example Company (password is 'Password123')
INSERT INTO "User" (
  "id",
  "first_name",
  "last_name",
  "email",
  "password",
  "agreed_to_terms",
  "role",
  "organization_id",
  "created_at",
  "updated_at"
)
VALUES (
  gen_random_uuid(),
  'Test',
  'Employee',
  'employee_test@example.com',
  '$2a$10$ZWuRGDjXTvLpMbTRKK.W3.qVeQMCOOHjDTQSrcUq1zP2WECMf4JI6',
  TRUE,
  'employee',
  (SELECT "id" FROM "Organization" WHERE "name" = 'Example Company' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Create Employee user for Sanicle (password is 'Password123')
INSERT INTO "User" (
  "id",
  "first_name",
  "last_name",
  "email",
  "password",
  "agreed_to_terms",
  "role",
  "organization_id",
  "created_at",
  "updated_at"
)
VALUES (
  gen_random_uuid(),
  'Sanicle',
  'Employee',
  'employee_test@sanicle.com',
  '$2a$10$ZWuRGDjXTvLpMbTRKK.W3.qVeQMCOOHjDTQSrcUq1zP2WECMf4JI6',
  TRUE,
  'employee',
  (SELECT "id" FROM "Organization" WHERE "name" = 'Sanicle' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Also create employee profiles for the employees
INSERT INTO "Employee" (
  "id",
  "user_id",
  "gender",
  "date_of_birth",
  "emergency_contact",
  "hire_date",
  "job_title",
  "created_at",
  "updated_at"
)
VALUES (
  gen_random_uuid(),
  (SELECT "id" FROM "User" WHERE "email" = 'employee_test@example.com' LIMIT 1),
  'Male',
  '1990-01-01',
  'Emergency Contact: +1-555-123-4567',
  '2023-01-15',
  'Software Developer',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

INSERT INTO "Employee" (
  "id",
  "user_id",
  "gender",
  "date_of_birth",
  "emergency_contact",
  "hire_date",
  "job_title",
  "created_at",
  "updated_at"
)
VALUES (
  gen_random_uuid(),
  (SELECT "id" FROM "User" WHERE "email" = 'employee_test@sanicle.com' LIMIT 1),
  'Female',
  '1992-05-15',
  'Emergency Contact: +1-555-987-6543',
  '2022-11-01',
  'Marketing Specialist',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING; 