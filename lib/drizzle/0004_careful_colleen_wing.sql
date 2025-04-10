CREATE TABLE IF NOT EXISTS "AuditLog" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" uuid NOT NULL,
	"details" json,
	"ip_address" varchar(50),
	"user_agent" varchar(255),
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"organization_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "HREmployeeRelationship" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hr_manager_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "HRManager" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hr_user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OrganizationAdmin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"is_main_admin" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Role" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"level" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Role_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SuperAdmin" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"access_level" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_user_id_User_id_fk";
--> statement-breakpoint
ALTER TABLE "Event" DROP CONSTRAINT "Event_organization_id_Organization_id_fk";
--> statement-breakpoint
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_organization_id_Organization_id_fk";
--> statement-breakpoint
ALTER TABLE "HealthBenefit" DROP CONSTRAINT "HealthBenefit_organization_id_Organization_id_fk";
--> statement-breakpoint
ALTER TABLE "HealthRecord" DROP CONSTRAINT "HealthRecord_organization_id_Organization_id_fk";
--> statement-breakpoint
ALTER TABLE "LeaveRequest" DROP CONSTRAINT "LeaveRequest_organization_id_Organization_id_fk";
--> statement-breakpoint
ALTER TABLE "ResourceFile" DROP CONSTRAINT "ResourceFile_organization_id_Organization_id_fk";
--> statement-breakpoint
ALTER TABLE "User" DROP CONSTRAINT "User_organization_id_Organization_id_fk";
--> statement-breakpoint
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_user_id_User_id_fk";
--> statement-breakpoint
ALTER TABLE "UserRole" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "Chat" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
ALTER TABLE "Employee" ADD COLUMN "is_hr" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "Employee" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
ALTER TABLE "EventRegistration" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
ALTER TABLE "Reservation" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN "primary_role_id" uuid;--> statement-breakpoint
ALTER TABLE "UserRole" ADD COLUMN "role_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "UserRole" ADD COLUMN "organization_id" uuid;--> statement-breakpoint
ALTER TABLE "UserRole" ADD COLUMN "assigned_by_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "HREmployeeRelationship" ADD CONSTRAINT "HREmployeeRelationship_hr_manager_id_HRManager_id_fk" FOREIGN KEY ("hr_manager_id") REFERENCES "public"."HRManager"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "HREmployeeRelationship" ADD CONSTRAINT "HREmployeeRelationship_employee_id_Employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."Employee"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "HRManager" ADD CONSTRAINT "HRManager_hr_user_id_User_id_fk" FOREIGN KEY ("hr_user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "HRManager" ADD CONSTRAINT "HRManager_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "HRManager" ADD CONSTRAINT "HRManager_created_by_id_User_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "OrganizationAdmin" ADD CONSTRAINT "OrganizationAdmin_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "OrganizationAdmin" ADD CONSTRAINT "OrganizationAdmin_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "OrganizationAdmin" ADD CONSTRAINT "OrganizationAdmin_created_by_id_User_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SuperAdmin" ADD CONSTRAINT "SuperAdmin_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_user_idx" ON "AuditLog" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_org_idx" ON "AuditLog" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_entity_idx" ON "AuditLog" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_timestamp_idx" ON "AuditLog" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hr_emp_idx" ON "HREmployeeRelationship" USING btree ("hr_manager_id","employee_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hr_user_idx" ON "HRManager" USING btree ("hr_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hr_org_idx" ON "HRManager" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_org_idx" ON "OrganizationAdmin" USING btree ("user_id","organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "super_admin_user_idx" ON "SuperAdmin" USING btree ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Chat" ADD CONSTRAINT "Chat_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Employee" ADD CONSTRAINT "Employee_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Employee" ADD CONSTRAINT "Employee_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Event" ADD CONSTRAINT "Event_created_by_id_User_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Event" ADD CONSTRAINT "Event_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_event_id_Event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "HealthBenefit" ADD CONSTRAINT "HealthBenefit_created_by_id_User_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "HealthBenefit" ADD CONSTRAINT "HealthBenefit_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "HealthRecord" ADD CONSTRAINT "HealthRecord_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "HealthRecord" ADD CONSTRAINT "HealthRecord_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_employee_id_Employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."Employee"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_approver_id_User_id_fk" FOREIGN KEY ("approver_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ResourceFile" ADD CONSTRAINT "ResourceFile_created_by_id_User_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ResourceFile" ADD CONSTRAINT "ResourceFile_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "User" ADD CONSTRAINT "User_primary_role_id_Role_id_fk" FOREIGN KEY ("primary_role_id") REFERENCES "public"."Role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "User" ADD CONSTRAINT "User_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_role_id_Role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."Role"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_organization_id_Organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_assigned_by_id_User_id_fk" FOREIGN KEY ("assigned_by_id") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_user_idx" ON "Chat" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "chat_org_idx" ON "Chat" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "employee_user_idx" ON "Employee" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "employee_manager_idx" ON "Employee" USING btree ("manager_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "employee_org_idx" ON "Employee" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_created_by_idx" ON "Event" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_org_idx" ON "Event" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_date_idx" ON "Event" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_reg_user_idx" ON "EventRegistration" USING btree ("event_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_reg_org_idx" ON "EventRegistration" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "feedback_user_idx" ON "Feedback" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "feedback_org_idx" ON "Feedback" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "feedback_category_idx" ON "Feedback" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "benefit_created_by_idx" ON "HealthBenefit" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "benefit_org_idx" ON "HealthBenefit" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "benefit_category_idx" ON "HealthBenefit" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "health_record_user_idx" ON "HealthRecord" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "health_record_org_idx" ON "HealthRecord" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "health_record_date_idx" ON "HealthRecord" USING btree ("date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leave_employee_idx" ON "LeaveRequest" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leave_approver_idx" ON "LeaveRequest" USING btree ("approver_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leave_org_idx" ON "LeaveRequest" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leave_date_idx" ON "LeaveRequest" USING btree ("start_date","end_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reservation_user_idx" ON "Reservation" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reservation_org_idx" ON "Reservation" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resource_created_by_idx" ON "ResourceFile" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resource_org_idx" ON "ResourceFile" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "resource_category_idx" ON "ResourceFile" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "User" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "organization_idx" ON "User" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_role_idx" ON "UserRole" USING btree ("user_id","role_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_role_org_idx" ON "UserRole" USING btree ("organization_id");