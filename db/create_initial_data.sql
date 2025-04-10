-- Create default Sanicle organization
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
)
ON CONFLICT DO NOTHING;

-- Create superadmin user (password is hashed version of 'Admin@123')
-- This is example data, you should change this in production
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
  'Super',
  'Admin',
  'superadmin@sanicle.com',
  '$2a$10$pjQzQxnYYJ2q9ayNsSYNuubIPLsFMa3ZV2wEUeAXJ.oxLSiCy4HiC',
  TRUE,
  'superadmin',
  TRUE,
  (SELECT "id" FROM "Organization" WHERE "name" = 'Sanicle' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Create an example company organization
INSERT INTO "Organization" (
  "id",
  "name",
  "subscription_plan",
  "created_at",
  "updated_at"
)
VALUES (
  gen_random_uuid(),
  'Example Company',
  'standard',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

-- Create an admin user for the example company (password is hashed version of 'Admin@123')
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
  'Company',
  'Admin',
  'admin@example.com',
  '$2a$10$pjQzQxnYYJ2q9ayNsSYNuubIPLsFMa3ZV2wEUeAXJ.oxLSiCy4HiC',
  TRUE,
  'admin',
  (SELECT "id" FROM "Organization" WHERE "name" = 'Example Company' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING; 