ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "Event" DROP CONSTRAINT "Event_created_by_id_User_id_fk";
--> statement-breakpoint
ALTER TABLE "EventRegistration" DROP CONSTRAINT "EventRegistration_event_id_Event_id_fk";
--> statement-breakpoint
ALTER TABLE "EventRegistration" DROP CONSTRAINT "EventRegistration_user_id_User_id_fk";
--> statement-breakpoint
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_user_id_User_id_fk";
--> statement-breakpoint
ALTER TABLE "HealthBenefit" DROP CONSTRAINT "HealthBenefit_created_by_id_User_id_fk";
--> statement-breakpoint
ALTER TABLE "HealthRecord" DROP CONSTRAINT "HealthRecord_userId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_userId_User_id_fk";
--> statement-breakpoint
ALTER TABLE "ResourceFile" DROP CONSTRAINT "ResourceFile_created_by_id_User_id_fk";
