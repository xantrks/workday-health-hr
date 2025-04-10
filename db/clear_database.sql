-- Clear all data while preserving table structure
-- Delete in reverse order to avoid foreign key constraints

-- Delete data from all tables
DELETE FROM "Employee";
DELETE FROM "UserRole";
DELETE FROM "HealthRecord";
DELETE FROM "ResourceFile";
DELETE FROM "Event";
DELETE FROM "EventRegistration";
DELETE FROM "Feedback";
DELETE FROM "HealthBenefit";
DELETE FROM "LeaveRequest";
DELETE FROM "Chat";
DELETE FROM "Reservation";
-- Delete User and Organization last
DELETE FROM "User";
DELETE FROM "Organization"; 