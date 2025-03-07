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

// 资源文件表 - 用于HR上传的政策文件和教育资源
export const resourceFile = pgTable("ResourceFile", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  fileUrl: varchar("file_url", { length: 500 }).notNull(), // Vercel Blob URL
  fileType: varchar("file_type", { length: 50 }).notNull(), // pdf, doc, video_link, etc.
  category: varchar("category", { length: 50 }).notNull(), // 政策文件, 月经健康资源, 更年期健康资源
  tags: json("tags"), // 可用于过滤和搜索的标签
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdById: uuid("created_by_id").notNull(),
  viewCount: integer("view_count").notNull().default(0), // 查看次数
  downloadCount: integer("download_count").notNull().default(0), // 下载次数
});

export type ResourceFile = InferSelectModel<typeof resourceFile>;

// 活动和网络研讨会表
export const event = pgTable("Event", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  eventType: varchar("event_type", { length: 50 }).notNull(), // webinar, workshop, seminar
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: varchar("location", { length: 200 }), // 可以是线上链接或实体地点
  maxAttendees: integer("max_attendees"),
  registrationLink: varchar("registration_link", { length: 500 }),
  resourceMaterials: json("resource_materials"), // 相关资源材料(如幻灯片URL)
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdById: uuid("created_by_id").notNull(),
});

export type Event = InferSelectModel<typeof event>;

// 活动注册表 - 跟踪谁注册了哪些活动
export const eventRegistration = pgTable("EventRegistration", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  eventId: uuid("event_id").notNull(),
  userId: uuid("user_id").notNull(),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
  attended: boolean("attended").default(false),
  feedback: text("feedback"),
  feedbackRating: integer("feedback_rating"), // 1-5评分
});

export type EventRegistration = InferSelectModel<typeof eventRegistration>;

// 员工反馈表 - 用于收集匿名反馈
export const feedback = pgTable("Feedback", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 月经健康, 更年期健康, 福利政策等
  anonymous: boolean("anonymous").notNull().default(true),
  userId: uuid("user_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Feedback = InferSelectModel<typeof feedback>;

// 健康福利表 - 用于管理月经和更年期相关福利
export const healthBenefit = pgTable("HealthBenefit", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // 带薪休假, 补贴护理, 健康福利等
  eligibility: text("eligibility"), // 谁有资格享受该福利
  applicationProcess: text("application_process"), // 如何申请该福利
  budget: integer("budget"), // 预算金额(分)
  startDate: date("start_date").notNull(),
  endDate: date("end_date"), // 可为null表示无限期
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdById: uuid("created_by_id").notNull(),
});

export type HealthBenefit = InferSelectModel<typeof healthBenefit>;
