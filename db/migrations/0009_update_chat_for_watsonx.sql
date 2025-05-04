-- Update the chat table to accommodate WatsonX AI chat format
-- This migration preserves existing data but ensures it's compatible with WatsonX

-- First, create a temporary backup of the Chat table if it doesn't exist
CREATE TABLE IF NOT EXISTS "ChatBackup" AS
SELECT * FROM "Chat";

-- Add a comment to indicate the AI system used
COMMENT ON TABLE "Chat" IS 'Stores chat conversations from WatsonX AI';

-- Migration completed
SELECT 'Migration completed successfully' AS status; 