import { pgTable, uuid, timestamp, json, boolean, text, integer, foreignKey, date, varchar, unique } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const chat = pgTable("Chat", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	messages: json().notNull(),
	userId: uuid().notNull(),
});

export const reservation = pgTable("Reservation", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	details: json().notNull(),
	hasCompletedPayment: boolean().default(false).notNull(),
	userId: uuid().notNull(),
});

export const eventRegistration = pgTable("EventRegistration", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	eventId: uuid("event_id").notNull(),
	userId: uuid("user_id").notNull(),
	registeredAt: timestamp("registered_at", { mode: 'string' }).defaultNow().notNull(),
	attended: boolean().default(false),
	feedback: text(),
	feedbackRating: integer("feedback_rating"),
});

export const healthRecord = pgTable("HealthRecord", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	date: date().notNull(),
	recordType: varchar("record_type", { length: 20 }).notNull(),
	periodFlow: integer("period_flow"),
	symptoms: json(),
	mood: varchar({ length: 20 }),
	sleepHours: integer("sleep_hours"),
	stressLevel: integer("stress_level"),
	notes: varchar({ length: 500 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	userId: uuid().notNull(),
	organizationId: uuid("organization_id"),
},
(table) => {
	return {
		healthRecordOrganizationIdOrganizationIdFk: foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "HealthRecord_organization_id_Organization_id_fk"
		}),
	}
});

export const feedback = pgTable("Feedback", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	content: text().notNull(),
	category: varchar({ length: 50 }).notNull(),
	anonymous: boolean().default(true).notNull(),
	userId: uuid("user_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	organizationId: uuid("organization_id"),
},
(table) => {
	return {
		feedbackOrganizationIdOrganizationIdFk: foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "Feedback_organization_id_Organization_id_fk"
		}),
	}
});

export const event = pgTable("Event", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar({ length: 200 }).notNull(),
	description: text(),
	eventType: varchar("event_type", { length: 50 }).notNull(),
	startDate: timestamp("start_date", { mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { mode: 'string' }).notNull(),
	location: varchar({ length: 200 }),
	maxAttendees: integer("max_attendees"),
	registrationLink: varchar("registration_link", { length: 500 }),
	resourceMaterials: json("resource_materials"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdById: uuid("created_by_id").notNull(),
	organizationId: uuid("organization_id"),
},
(table) => {
	return {
		eventOrganizationIdOrganizationIdFk: foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "Event_organization_id_Organization_id_fk"
		}),
	}
});

export const user = pgTable("User", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 64 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	firstName: varchar("first_name", { length: 64 }).notNull(),
	lastName: varchar("last_name", { length: 64 }).notNull(),
	agreedToTerms: boolean("agreed_to_terms").default(false).notNull(),
	profileImageUrl: varchar("profile_image_url", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	role: varchar({ length: 20 }).default('employee').notNull(),
	department: varchar({ length: 100 }),
	position: varchar({ length: 100 }),
	location: varchar({ length: 100 }),
	organizationId: uuid("organization_id"),
	isSuperAdmin: boolean("is_super_admin").default(false),
},
(table) => {
	return {
		userOrganizationIdOrganizationIdFk: foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "User_organization_id_Organization_id_fk"
		}),
		userEmailUnique: unique("User_email_unique").on(table.email),
	}
});

export const healthBenefit = pgTable("HealthBenefit", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 200 }).notNull(),
	description: text().notNull(),
	category: varchar({ length: 50 }).notNull(),
	eligibility: text(),
	applicationProcess: text("application_process"),
	budget: integer(),
	startDate: date("start_date").notNull(),
	endDate: date("end_date"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdById: uuid("created_by_id").notNull(),
	organizationId: uuid("organization_id"),
},
(table) => {
	return {
		healthBenefitOrganizationIdOrganizationIdFk: foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "HealthBenefit_organization_id_Organization_id_fk"
		}),
	}
});

export const resourceFile = pgTable("ResourceFile", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar({ length: 200 }).notNull(),
	description: text(),
	fileUrl: varchar("file_url", { length: 500 }).notNull(),
	fileType: varchar("file_type", { length: 50 }).notNull(),
	category: varchar({ length: 50 }).notNull(),
	tags: json(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	createdById: uuid("created_by_id").notNull(),
	viewCount: integer("view_count").default(0).notNull(),
	downloadCount: integer("download_count").default(0).notNull(),
	organizationId: uuid("organization_id"),
},
(table) => {
	return {
		resourceFileOrganizationIdOrganizationIdFk: foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "ResourceFile_organization_id_Organization_id_fk"
		}),
	}
});

export const employee = pgTable("Employee", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	gender: varchar({ length: 20 }),
	dateOfBirth: date("date_of_birth"),
	emergencyContact: varchar("emergency_contact", { length: 255 }),
	hireDate: date("hire_date"),
	jobTitle: varchar("job_title", { length: 100 }),
	managerId: uuid("manager_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		employeeUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Employee_user_id_User_id_fk"
		}),
		employeeManagerIdUserIdFk: foreignKey({
			columns: [table.managerId],
			foreignColumns: [user.id],
			name: "Employee_manager_id_User_id_fk"
		}),
	}
});

export const userRole = pgTable("UserRole", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	role: varchar({ length: 20 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		userRoleUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "UserRole_user_id_User_id_fk"
		}),
	}
});

export const organization = pgTable("Organization", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	subscriptionPlan: varchar("subscription_plan", { length: 50 }).notNull(),
	logoUrl: varchar("logo_url", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const leaveRequest = pgTable("LeaveRequest", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	employeeId: uuid("employee_id").notNull(),
	startDate: date("start_date").notNull(),
	endDate: date("end_date").notNull(),
	leaveType: varchar("leave_type", { length: 50 }).notNull(),
	reason: text().notNull(),
	status: varchar({ length: 20 }).default('pending').notNull(),
	approverNote: text("approver_note"),
	approverId: uuid("approver_id"),
	approvedAt: timestamp("approved_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	organizationId: uuid("organization_id"),
},
(table) => {
	return {
		leaveRequestOrganizationIdOrganizationIdFk: foreignKey({
			columns: [table.organizationId],
			foreignColumns: [organization.id],
			name: "LeaveRequest_organization_id_Organization_id_fk"
		}),
	}
});