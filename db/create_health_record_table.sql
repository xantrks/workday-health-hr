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
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "userId" UUID NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id")
); 