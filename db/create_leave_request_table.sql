CREATE TABLE IF NOT EXISTS "LeaveRequest" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "employee_id" UUID NOT NULL,
  "start_date" DATE NOT NULL,
  "end_date" DATE NOT NULL,
  "leave_type" VARCHAR(50) NOT NULL,
  "reason" TEXT NOT NULL,
  "status" VARCHAR(20) DEFAULT 'pending' NOT NULL,
  "approver_note" TEXT,
  "approver_id" UUID,
  "approved_at" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
); 