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
} from "drizzle-orm/pg-core";

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
  role: varchar("role", { length: 20 }).notNull().default("employee"),
  department: varchar("department", { length: 100 }),
  position: varchar("position", { length: 100 }),
  location: varchar("location", { length: 100 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  messages: json("messages").notNull(),
  userId: uuid("userId").notNull(),
});

export type Chat = Omit<InferSelectModel<typeof chat>, "messages"> & {
  messages: Array<Message>;
};

export const reservation = pgTable("Reservation", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  details: json("details").notNull(),
  hasCompletedPayment: boolean("hasCompletedPayment").notNull().default(false),
  userId: uuid("userId").notNull(),
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
  userId: uuid("userId").notNull(),
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
  createdById: uuid("created_by_id").notNull(),
  viewCount: integer("view_count").notNull().default(0), // View count
  downloadCount: integer("download_count").notNull().default(0), // Download count
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
  createdById: uuid("created_by_id").notNull(),
});

export type Event = InferSelectModel<typeof event>;

// Event registration table - Track who registered for which events
export const eventRegistration = pgTable("EventRegistration", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  eventId: uuid("event_id").notNull(),
  userId: uuid("user_id").notNull(),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
  attended: boolean("attended").default(false),
  feedback: text("feedback"),
  feedbackRating: integer("feedback_rating"), // 1-5 rating
});

export type EventRegistration = InferSelectModel<typeof eventRegistration>;

// Employee feedback table - For collecting anonymous feedback
export const feedback = pgTable("Feedback", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // Menstrual Health, Menopause Health, Benefit Policies, etc.
  anonymous: boolean("anonymous").notNull().default(true),
  userId: uuid("user_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
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
  createdById: uuid("created_by_id").notNull(),
});

export type HealthBenefit = InferSelectModel<typeof healthBenefit>;
