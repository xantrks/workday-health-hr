-- Seed Database with Initial Data for Multi-Tenant System

-- Create Sanicle organization (Main system owner)
INSERT INTO "Organization" (
  "id",
  "name",
  "subscription_plan",
  "created_at",
  "updated_at"
)
VALUES (
  gen_random_uuid(),
  'Sanicle',
  'enterprise',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Create three sample client organizations
INSERT INTO "Organization" (
  "id",
  "name",
  "subscription_plan",
  "created_at",
  "updated_at"
)
VALUES 
(
  gen_random_uuid(),
  'Acme Corporation',
  'premium',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  gen_random_uuid(),
  'TechNova Solutions',
  'standard',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  gen_random_uuid(),
  'Global Health Services',
  'premium',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Create a superadmin for Sanicle (password: SuperAdmin123)
INSERT INTO "User" (
  "id",
  "first_name",
  "last_name",
  "email",
  "password",
  "agreed_to_terms",
  "role",
  "is_super_admin",
  "organization_id",
  "created_at",
  "updated_at"
)
VALUES (
  gen_random_uuid(),
  'System',
  'Administrator',
  'superadmin@sanicle.com',
  '$2a$10$g5vfPEJZsDXRvLDsZ8vTmeF7h9jUjtK67/T1wO3dMiBD7vgD0JyNO',
  TRUE,
  'superadmin',
  TRUE,
  (SELECT "id" FROM "Organization" WHERE "name" = 'Sanicle' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Create admin users for each client organization
-- Acme Corporation Admin (password: AdminUser123)
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
  'Acme',
  'Admin',
  'admin@acme.com',
  '$2a$10$jBbAcJGvS7cYQvBLdZKZ0OAL9S.Z4wpuDxCOGaG21JSQ0X.7dCdQi',
  TRUE,
  'admin',
  (SELECT "id" FROM "Organization" WHERE "name" = 'Acme Corporation' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- TechNova Solutions Admin (password: AdminUser123)
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
  'Tech',
  'Admin',
  'admin@technova.com',
  '$2a$10$jBbAcJGvS7cYQvBLdZKZ0OAL9S.Z4wpuDxCOGaG21JSQ0X.7dCdQi',
  TRUE,
  'admin',
  (SELECT "id" FROM "Organization" WHERE "name" = 'TechNova Solutions' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Global Health Services Admin (password: AdminUser123)
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
  'Global',
  'Admin',
  'admin@globalhealth.com',
  '$2a$10$jBbAcJGvS7cYQvBLdZKZ0OAL9S.Z4wpuDxCOGaG21JSQ0X.7dCdQi',
  TRUE,
  'admin',
  (SELECT "id" FROM "Organization" WHERE "name" = 'Global Health Services' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Create HR users (one for each organization)
-- Acme HR (password: HrUser123)
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
  'John',
  'Miller',
  'hr@acme.com',
  '$2a$10$3cqUGIyfOHLXDjYoKjN3tefnhKnj4B9Ak0DPwdtmIdnxF.fQjRSxW',
  TRUE,
  'hr',
  (SELECT "id" FROM "Organization" WHERE "name" = 'Acme Corporation' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- TechNova HR (password: HrUser123)
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
  'Sarah',
  'Johnson',
  'hr@technova.com',
  '$2a$10$3cqUGIyfOHLXDjYoKjN3tefnhKnj4B9Ak0DPwdtmIdnxF.fQjRSxW',
  TRUE,
  'hr',
  (SELECT "id" FROM "Organization" WHERE "name" = 'TechNova Solutions' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Global Health HR (password: HrUser123)
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
  'Michael',
  'Lee',
  'hr@globalhealth.com',
  '$2a$10$3cqUGIyfOHLXDjYoKjN3tefnhKnj4B9Ak0DPwdtmIdnxF.fQjRSxW',
  TRUE,
  'hr',
  (SELECT "id" FROM "Organization" WHERE "name" = 'Global Health Services' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Create sample employees (two for each organization)
-- Acme Employees (password: EmployeeUser123)
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
VALUES 
(
  gen_random_uuid(),
  'Alex',
  'Smith',
  'alex@acme.com',
  '$2a$10$B9yUYK5x1ECU3znzNqhoCOCzV10zQL2u3UxlRZDUdkVTYxghXkwFC',
  TRUE,
  'employee',
  (SELECT "id" FROM "Organization" WHERE "name" = 'Acme Corporation' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  gen_random_uuid(),
  'Jessica',
  'Brown',
  'jessica@acme.com',
  '$2a$10$B9yUYK5x1ECU3znzNqhoCOCzV10zQL2u3UxlRZDUdkVTYxghXkwFC',
  TRUE,
  'employee',
  (SELECT "id" FROM "Organization" WHERE "name" = 'Acme Corporation' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- TechNova Employees (password: EmployeeUser123)
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
VALUES 
(
  gen_random_uuid(),
  'David',
  'Wilson',
  'david@technova.com',
  '$2a$10$B9yUYK5x1ECU3znzNqhoCOCzV10zQL2u3UxlRZDUdkVTYxghXkwFC',
  TRUE,
  'employee',
  (SELECT "id" FROM "Organization" WHERE "name" = 'TechNova Solutions' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  gen_random_uuid(),
  'Emily',
  'Clark',
  'emily@technova.com',
  '$2a$10$B9yUYK5x1ECU3znzNqhoCOCzV10zQL2u3UxlRZDUdkVTYxghXkwFC',
  TRUE,
  'employee',
  (SELECT "id" FROM "Organization" WHERE "name" = 'TechNova Solutions' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Global Health Employees (password: EmployeeUser123)
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
VALUES 
(
  gen_random_uuid(),
  'James',
  'Taylor',
  'james@globalhealth.com',
  '$2a$10$B9yUYK5x1ECU3znzNqhoCOCzV10zQL2u3UxlRZDUdkVTYxghXkwFC',
  TRUE,
  'employee',
  (SELECT "id" FROM "Organization" WHERE "name" = 'Global Health Services' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  gen_random_uuid(),
  'Sophia',
  'Martinez',
  'sophia@globalhealth.com',
  '$2a$10$B9yUYK5x1ECU3znzNqhoCOCzV10zQL2u3UxlRZDUdkVTYxghXkwFC',
  TRUE,
  'employee',
  (SELECT "id" FROM "Organization" WHERE "name" = 'Global Health Services' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Create employee profiles for the employees
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
SELECT
  gen_random_uuid(),
  "id",
  CASE WHEN "first_name" IN ('Alex', 'David', 'James') THEN 'Male' ELSE 'Female' END,
  '1990-01-01'::date + (random() * 3650)::integer,
  'Emergency Contact: +1-555-' || floor(random() * 900 + 100)::text || '-' || floor(random() * 9000 + 1000)::text,
  '2020-01-01'::date + (random() * 730)::integer,
  CASE 
    WHEN "organization_id" = (SELECT "id" FROM "Organization" WHERE "name" = 'Acme Corporation' LIMIT 1) THEN 
      CASE WHEN random() < 0.5 THEN 'Software Developer' ELSE 'Product Manager' END
    WHEN "organization_id" = (SELECT "id" FROM "Organization" WHERE "name" = 'TechNova Solutions' LIMIT 1) THEN 
      CASE WHEN random() < 0.5 THEN 'Data Scientist' ELSE 'UX Designer' END
    ELSE 
      CASE WHEN random() < 0.5 THEN 'Healthcare Specialist' ELSE 'Medical Coordinator' END
  END,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "User"
WHERE "role" = 'employee'; 