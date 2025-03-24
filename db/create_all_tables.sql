-- User Table
CREATE TABLE IF NOT EXISTS "User" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "first_name" VARCHAR(64) NOT NULL,
  "last_name" VARCHAR(64) NOT NULL,
  "email" VARCHAR(64) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "agreed_to_terms" BOOLEAN NOT NULL DEFAULT false,
  "profile_image_url" VARCHAR(255),
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "role" VARCHAR(20) NOT NULL DEFAULT 'employee',
  "department" VARCHAR(100),
  "position" VARCHAR(100),
  "location" VARCHAR(100)
);

-- Chat Table
CREATE TABLE IF NOT EXISTS "Chat" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "messages" JSONB NOT NULL,
  "userId" UUID NOT NULL
);

-- Reservation Table
CREATE TABLE IF NOT EXISTS "Reservation" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "createdAt" TIMESTAMP NOT NULL,
  "details" JSONB NOT NULL,
  "hasCompletedPayment" BOOLEAN NOT NULL DEFAULT false,
  "userId" UUID NOT NULL
);

-- Health Record Table
CREATE TABLE IF NOT EXISTS "HealthRecord" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "date" DATE NOT NULL,
  "record_type" VARCHAR(20) NOT NULL,
  "period_flow" INTEGER,
  "symptoms" JSONB,
  "mood" VARCHAR(20),
  "sleep_hours" INTEGER,
  "stress_level" INTEGER,
  "notes" VARCHAR(500),
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" UUID NOT NULL
);

-- Resource File Table
CREATE TABLE IF NOT EXISTS "ResourceFile" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" VARCHAR(200) NOT NULL,
  "description" TEXT,
  "file_url" VARCHAR(500) NOT NULL,
  "file_type" VARCHAR(50) NOT NULL,
  "category" VARCHAR(50) NOT NULL,
  "tags" JSONB,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by_id" UUID NOT NULL,
  "view_count" INTEGER NOT NULL DEFAULT 0,
  "download_count" INTEGER NOT NULL DEFAULT 0
);

-- Event Table
CREATE TABLE IF NOT EXISTS "Event" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" VARCHAR(200) NOT NULL,
  "description" TEXT,
  "event_type" VARCHAR(50) NOT NULL,
  "start_date" TIMESTAMP NOT NULL,
  "end_date" TIMESTAMP NOT NULL,
  "location" VARCHAR(200),
  "max_attendees" INTEGER,
  "registration_link" VARCHAR(500),
  "resource_materials" JSONB,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by_id" UUID NOT NULL
);

-- Event Registration Table
CREATE TABLE IF NOT EXISTS "EventRegistration" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "event_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "registered_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "attended" BOOLEAN DEFAULT false,
  "feedback" TEXT,
  "feedback_rating" INTEGER
);

-- Feedback Table
CREATE TABLE IF NOT EXISTS "Feedback" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "content" TEXT NOT NULL,
  "category" VARCHAR(50) NOT NULL,
  "anonymous" BOOLEAN NOT NULL DEFAULT true,
  "user_id" UUID,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Health Benefit Table
CREATE TABLE IF NOT EXISTS "HealthBenefit" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" VARCHAR(200) NOT NULL,
  "description" TEXT NOT NULL,
  "category" VARCHAR(50) NOT NULL,
  "eligibility" TEXT,
  "application_process" TEXT,
  "budget" INTEGER,
  "start_date" DATE NOT NULL,
  "end_date" DATE,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by_id" UUID NOT NULL
);

-- Leave Request Table
CREATE TABLE IF NOT EXISTS "LeaveRequest" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "employee_id" UUID NOT NULL,
  "start_date" DATE NOT NULL,
  "end_date" DATE NOT NULL,
  "leave_type" VARCHAR(50) NOT NULL,
  "reason" TEXT NOT NULL,
  "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
  "approver_note" TEXT,
  "approver_id" UUID,
  "approved_at" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
); 