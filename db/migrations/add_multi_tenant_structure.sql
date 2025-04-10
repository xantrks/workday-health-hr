-- Create Organization table
CREATE TABLE IF NOT EXISTS "Organization" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "subscription_plan" VARCHAR(50) NOT NULL,
  "logo_url" VARCHAR(255),
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add organization_id column to User table
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "organization_id" UUID REFERENCES "Organization"("id"),
ADD COLUMN IF NOT EXISTS "is_super_admin" BOOLEAN DEFAULT false;

-- Create Employee table for employee-specific information
CREATE TABLE IF NOT EXISTS "Employee" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" UUID NOT NULL REFERENCES "User"("id"),
  "gender" VARCHAR(20),
  "date_of_birth" DATE,
  "emergency_contact" VARCHAR(255),
  "hire_date" DATE,
  "job_title" VARCHAR(100),
  "manager_id" UUID REFERENCES "User"("id"),
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create UserRole table for flexible role assignment
CREATE TABLE IF NOT EXISTS "UserRole" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" UUID NOT NULL REFERENCES "User"("id"),
  "role" VARCHAR(20) NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add organization_id to existing tables
ALTER TABLE "HealthRecord" 
ADD COLUMN IF NOT EXISTS "organization_id" UUID REFERENCES "Organization"("id");

ALTER TABLE "ResourceFile" 
ADD COLUMN IF NOT EXISTS "organization_id" UUID REFERENCES "Organization"("id");

ALTER TABLE "Event" 
ADD COLUMN IF NOT EXISTS "organization_id" UUID REFERENCES "Organization"("id");

ALTER TABLE "Feedback" 
ADD COLUMN IF NOT EXISTS "organization_id" UUID REFERENCES "Organization"("id");

ALTER TABLE "HealthBenefit" 
ADD COLUMN IF NOT EXISTS "organization_id" UUID REFERENCES "Organization"("id");

ALTER TABLE "LeaveRequest" 
ADD COLUMN IF NOT EXISTS "organization_id" UUID REFERENCES "Organization"("id");

-- Update role values in existing User table to ensure consistency
-- This updates any invalid role values to 'employee' as the default
UPDATE "User"
SET "role" = 
  CASE 
    WHEN "role" IN ('employee', 'hr', 'admin', 'superadmin') THEN "role"
    ELSE 'employee'
  END;

-- Create a default Sanicle organization for existing users
INSERT INTO "Organization" ("name", "subscription_plan")
VALUES ('Sanicle', 'enterprise')
ON CONFLICT DO NOTHING;

-- Set the organization_id for existing users to the default organization
-- This is critical for maintaining data integrity during migration
DO $$
DECLARE
  default_org_id UUID;
BEGIN
  SELECT "id" INTO default_org_id FROM "Organization" WHERE "name" = 'Sanicle' LIMIT 1;
  
  IF default_org_id IS NOT NULL THEN
    UPDATE "User"
    SET "organization_id" = default_org_id
    WHERE "organization_id" IS NULL;
  END IF;
END $$; 