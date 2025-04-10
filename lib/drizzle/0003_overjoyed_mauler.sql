CREATE TABLE IF NOT EXISTS "Employee" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"gender" varchar(20),
	"date_of_birth" date,
	"emergency_contact" varchar(255),
	"hire_date" date,
	"job_title" varchar(100),
	"manager_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "LeaveRequest" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"leave_type" varchar(50) NOT NULL,
	"reason" text NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"approver_note" text,
	"approver_id" uuid,
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"organization_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"subscription_plan" varchar(50) NOT NULL,
	"logo_url" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserRole" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Event" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
ALTER TABLE "Feedback" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
ALTER TABLE "HealthBenefit" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
ALTER TABLE "HealthRecord" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
ALTER TABLE "ResourceFile" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "is_super_admin" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Employee" ADD CONSTRAINT "Employee_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Employee" ADD CONSTRAINT "Employee_manager_id_User_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Event" ADD CONSTRAINT "Event_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "HealthBenefit" ADD CONSTRAINT "HealthBenefit_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "HealthRecord" ADD CONSTRAINT "HealthRecord_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ResourceFile" ADD CONSTRAINT "ResourceFile_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "User" ADD CONSTRAINT "User_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
