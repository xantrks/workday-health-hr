import { Message } from "ai";
import { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  boolean,
  date,
  integer,
  text,
  foreignKey,
  index,
} from "drizzle-orm/pg-core";

// Organization table for multi-tenant architecture
export const organization = pgTable("Organization", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  subscriptionPlan: varchar("subscription_plan", { length: 50 }).notNull(),
  logoUrl: varchar("logo_url", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Organization = InferSelectModel<typeof organization>;

// Role table to define system roles and their hierarchy
export const role = pgTable("Role", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: text("description"),
  level: integer("level").notNull(), // Hierarchy level: 1=SuperAdmin, 2=OrgAdmin, 3=HR, 4=Employee
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Role = InferSelectModel<typeof role>;

// User table with enhanced role system
export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  firstName: varchar("first_name", { length: 64 }).notNull(),
  lastName: varchar("last_name", { length: 64 }).notNull(),
  email: varchar("email", { length: 64 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  agreedToTerms: boolean("agreed_to_terms").notNull().default(false),
  profileImageUrl: varchar("profile_image_url", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  // Adding primary role for quick access, but detailed roles in userRole table
  primaryRoleId: uuid("primary_role_id").references(() => role.id),
  department: varchar("department", { length: 100 }),
  position: varchar("position", { length: 100 }),
  location: varchar("location", { length: 100 }),
  // Adding organization relationship
  organizationId: uuid("organization_id").references(() => organization.id, { onDelete: "cascade" }),
  // Legacy field - keeping for backward compatibility
  role: varchar("role", { length: 20 }).notNull().default("employee"),
  // Legacy field - keeping for backward compatibility
  isSuperAdmin: boolean("is_super_admin").default(false),
}, (table) => {
  return {
    emailIdx: index("email_idx").on(table.email),
    organizationIdx: index("organization_idx").on(table.organizationId),
  };
});

export type User = InferSelectModel<typeof user>;

// Organization Administrator table
export const organizationAdmin = pgTable("OrganizationAdmin", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
  isMainAdmin: boolean("is_main_admin").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdById: uuid("created_by_id").references(() => user.id),
}, (table) => {
  return {
    userOrgIdx: index("user_org_idx").on(table.userId, table.organizationId),
  };
});

export type OrganizationAdmin = InferSelectModel<typeof organizationAdmin>;

// Employee profile specific data
export const employee = pgTable("Employee", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  gender: varchar("gender", { length: 20 }),
  dateOfBirth: date("date_of_birth"),
  emergencyContact: varchar("emergency_contact", { length: 255 }),
  hireDate: date("hire_date"),
  jobTitle: varchar("job_title", { length: 100 }),
  managerId: uuid("manager_id").references(() => user.id),
  isHR: boolean("is_hr").default(false), // Flag for HR role
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  organizationId: uuid("organization_id").references(() => organization.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    userIdx: index("employee_user_idx").on(table.userId),
    managerIdx: index("employee_manager_idx").on(table.managerId),
    organizationIdx: index("employee_org_idx").on(table.organizationId),
  };
});

export type Employee = InferSelectModel<typeof employee>;

// HR Manager table to track HR personnel and their managed employees
export const hrManager = pgTable("HRManager", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  hrUserId: uuid("hr_user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdById: uuid("created_by_id").references(() => user.id),
}, (table) => {
  return {
    hrUserIdx: index("hr_user_idx").on(table.hrUserId),
    organizationIdx: index("hr_org_idx").on(table.organizationId),
  };
});

export type HRManager = InferSelectModel<typeof hrManager>;

// HR-Employee relationship table
export const hrEmployeeRelationship = pgTable("HREmployeeRelationship", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  hrManagerId: uuid("hr_manager_id").notNull().references(() => hrManager.id, { onDelete: "cascade" }),
  employeeId: uuid("employee_id").notNull().references(() => employee.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    hrEmpIdx: index("hr_emp_idx").on(table.hrManagerId, table.employeeId),
  };
});

export type HREmployeeRelationship = InferSelectModel<typeof hrEmployeeRelationship>;

// User-Role relationship for more flexible role assignment
export const userRole = pgTable("UserRole", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  roleId: uuid("role_id").notNull().references(() => role.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id").references(() => organization.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  assignedById: uuid("assigned_by_id").references(() => user.id),
  // Legacy field - keeping for backward compatibility
  role: varchar("role", { length: 20 }),
}, (table) => {
  return {
    userRoleIdx: index("user_role_idx").on(table.userId, table.roleId),
    organizationIdx: index("user_role_org_idx").on(table.organizationId),
  };
});

export type UserRole = InferSelectModel<typeof userRole>;

// ----------------------------------------
// Existing tables with organization support
// ----------------------------------------

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  messages: json("messages").notNull(),
  userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id").references(() => organization.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    userIdx: index("chat_user_idx").on(table.userId),
    organizationIdx: index("chat_org_idx").on(table.organizationId),
  };
});

export type Chat = Omit<InferSelectModel<typeof chat>, "messages"> & {
  messages: Array<Message>;
};

export const reservation = pgTable("Reservation", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  details: json("details").notNull(),
  hasCompletedPayment: boolean("hasCompletedPayment").notNull().default(false),
  userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id").references(() => organization.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    userIdx: index("reservation_user_idx").on(table.userId),
    organizationIdx: index("reservation_org_idx").on(table.organizationId),
  };
});

export type Reservation = InferSelectModel<typeof reservation>;

export const healthRecord = pgTable("HealthRecord", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  date: date("date").notNull(),
  recordType: varchar("record_type", { length: 20 }).notNull(), // period, symptom, mood, etc.
  periodFlow: integer("period_flow"), // 1-5 scale for period flow
  symptoms: json("symptoms"), // pain levels, location, etc.
  mood: varchar("mood", { length: 20 }), // happy, sad, anxious, etc.
  sleepHours: integer("sleep_hours"), 
  stressLevel: integer("stress_level"), // 1-5 scale
  notes: varchar("notes", { length: 500 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: uuid("userId").notNull().references(() => user.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id").references(() => organization.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    userIdx: index("health_record_user_idx").on(table.userId),
    organizationIdx: index("health_record_org_idx").on(table.organizationId),
    dateIdx: index("health_record_date_idx").on(table.date),
  };
});

export type HealthRecord = InferSelectModel<typeof healthRecord>;

// Resource file table - For policy documents and educational resources uploaded by HR
export const resourceFile = pgTable("ResourceFile", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  fileUrl: varchar("file_url", { length: 500 }).notNull(), // Vercel Blob URL
  fileType: varchar("file_type", { length: 50 }).notNull(), // pdf, doc, video_link, etc.
  category: varchar("category", { length: 50 }).notNull(), // Policy Documents, Menstrual Health Resources, Menopause Health Resources
  tags: json("tags"), // Tags for filtering and searching
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdById: uuid("created_by_id").notNull().references(() => user.id),
  viewCount: integer("view_count").notNull().default(0), // View count
  downloadCount: integer("download_count").notNull().default(0), // Download count
  organizationId: uuid("organization_id").references(() => organization.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    createdByIdx: index("resource_created_by_idx").on(table.createdById),
    organizationIdx: index("resource_org_idx").on(table.organizationId),
    categoryIdx: index("resource_category_idx").on(table.category),
  };
});

export type ResourceFile = InferSelectModel<typeof resourceFile>;

// Events and webinars table
export const event = pgTable("Event", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  eventType: varchar("event_type", { length: 50 }).notNull(), // webinar, workshop, seminar
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: varchar("location", { length: 200 }), // Can be online link or physical location
  maxAttendees: integer("max_attendees"),
  registrationLink: varchar("registration_link", { length: 500 }),
  resourceMaterials: json("resource_materials"), // Related resource materials (like slide URLs)
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdById: uuid("created_by_id").notNull().references(() => user.id),
  organizationId: uuid("organization_id").references(() => organization.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    createdByIdx: index("event_created_by_idx").on(table.createdById),
    organizationIdx: index("event_org_idx").on(table.organizationId),
    dateIdx: index("event_date_idx").on(table.startDate),
  };
});

export type Event = InferSelectModel<typeof event>;

// Event registration table - Track who registered for which events
export const eventRegistration = pgTable("EventRegistration", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  eventId: uuid("event_id").notNull().references(() => event.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
  attended: boolean("attended").default(false),
  feedback: text("feedback"),
  feedbackRating: integer("feedback_rating"), // 1-5 rating
  organizationId: uuid("organization_id").references(() => organization.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    eventUserIdx: index("event_reg_user_idx").on(table.eventId, table.userId),
    organizationIdx: index("event_reg_org_idx").on(table.organizationId),
  };
});

export type EventRegistration = InferSelectModel<typeof eventRegistration>;

// Employee feedback table - For collecting anonymous feedback
export const feedback = pgTable("Feedback", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // Menstrual Health, Menopause Health, Benefit Policies, etc.
  anonymous: boolean("anonymous").notNull().default(true),
  userId: uuid("user_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  organizationId: uuid("organization_id").references(() => organization.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    userIdx: index("feedback_user_idx").on(table.userId),
    organizationIdx: index("feedback_org_idx").on(table.organizationId),
    categoryIdx: index("feedback_category_idx").on(table.category),
  };
});

export type Feedback = InferSelectModel<typeof feedback>;

// Health benefits table - For managing menstrual and menopause related benefits
export const healthBenefit = pgTable("HealthBenefit", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // Paid Leave, Subsidy Care, Health Benefits, etc.
  eligibility: text("eligibility"), // Who is eligible for this benefit
  applicationProcess: text("application_process"), // How to apply for this benefit
  budget: integer("budget"), // Budget amount (in cents)
  startDate: date("start_date").notNull(),
  endDate: date("end_date"), // Can be null for indefinite period
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdById: uuid("created_by_id").notNull().references(() => user.id),
  organizationId: uuid("organization_id").references(() => organization.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    createdByIdx: index("benefit_created_by_idx").on(table.createdById),
    organizationIdx: index("benefit_org_idx").on(table.organizationId),
    categoryIdx: index("benefit_category_idx").on(table.category),
  };
});

export type HealthBenefit = InferSelectModel<typeof healthBenefit>;

// Leave request table
export const leaveRequest = pgTable("LeaveRequest", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  employeeId: uuid("employee_id").notNull().references(() => employee.id, { onDelete: "cascade" }),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  leaveType: varchar("leave_type", { length: 50 }).notNull(), // such as: sick leave, vacation, menstrual leave, etc.
  reason: text("reason").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, approved, rejected
  approverNote: text("approver_note"),
  approverId: uuid("approver_id").references(() => user.id),
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  organizationId: uuid("organization_id").references(() => organization.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    employeeIdx: index("leave_employee_idx").on(table.employeeId),
    approverIdx: index("leave_approver_idx").on(table.approverId),
    organizationIdx: index("leave_org_idx").on(table.organizationId),
    dateIdx: index("leave_date_idx").on(table.startDate, table.endDate),
  };
});

export type LeaveRequest = InferSelectModel<typeof leaveRequest>;

// Super Admin table for Sanicle system administrators
export const superAdmin = pgTable("SuperAdmin", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessLevel: integer("access_level").notNull().default(1), // Different levels of super admin access
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    userIdx: index("super_admin_user_idx").on(table.userId),
  };
});

export type SuperAdmin = InferSelectModel<typeof superAdmin>;

// Audit log table for tracking important system actions
export const auditLog = pgTable("AuditLog", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id").references(() => user.id),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(), // user, organization, event, etc.
  entityId: uuid("entity_id").notNull(),
  details: json("details"),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: varchar("user_agent", { length: 255 }),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  organizationId: uuid("organization_id").references(() => organization.id),
}, (table) => {
  return {
    userIdx: index("audit_user_idx").on(table.userId),
    organizationIdx: index("audit_org_idx").on(table.organizationId),
    entityIdx: index("audit_entity_idx").on(table.entityType, table.entityId),
    timestampIdx: index("audit_timestamp_idx").on(table.timestamp),
  };
});

export type AuditLog = InferSelectModel<typeof auditLog>;
