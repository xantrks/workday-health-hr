import { relations } from "drizzle-orm/relations";
import { organization, healthRecord, feedback, event, user, healthBenefit, resourceFile, employee, userRole, leaveRequest } from "./schema";

export const healthRecordRelations = relations(healthRecord, ({one}) => ({
	organization: one(organization, {
		fields: [healthRecord.organizationId],
		references: [organization.id]
	}),
}));

export const organizationRelations = relations(organization, ({many}) => ({
	healthRecords: many(healthRecord),
	feedbacks: many(feedback),
	events: many(event),
	users: many(user),
	healthBenefits: many(healthBenefit),
	resourceFiles: many(resourceFile),
	leaveRequests: many(leaveRequest),
}));

export const feedbackRelations = relations(feedback, ({one}) => ({
	organization: one(organization, {
		fields: [feedback.organizationId],
		references: [organization.id]
	}),
}));

export const eventRelations = relations(event, ({one}) => ({
	organization: one(organization, {
		fields: [event.organizationId],
		references: [organization.id]
	}),
}));

export const userRelations = relations(user, ({one, many}) => ({
	organization: one(organization, {
		fields: [user.organizationId],
		references: [organization.id]
	}),
	employees_userId: many(employee, {
		relationName: "employee_userId_user_id"
	}),
	employees_managerId: many(employee, {
		relationName: "employee_managerId_user_id"
	}),
	userRoles: many(userRole),
}));

export const healthBenefitRelations = relations(healthBenefit, ({one}) => ({
	organization: one(organization, {
		fields: [healthBenefit.organizationId],
		references: [organization.id]
	}),
}));

export const resourceFileRelations = relations(resourceFile, ({one}) => ({
	organization: one(organization, {
		fields: [resourceFile.organizationId],
		references: [organization.id]
	}),
}));

export const employeeRelations = relations(employee, ({one}) => ({
	user_userId: one(user, {
		fields: [employee.userId],
		references: [user.id],
		relationName: "employee_userId_user_id"
	}),
	user_managerId: one(user, {
		fields: [employee.managerId],
		references: [user.id],
		relationName: "employee_managerId_user_id"
	}),
}));

export const userRoleRelations = relations(userRole, ({one}) => ({
	user: one(user, {
		fields: [userRole.userId],
		references: [user.id]
	}),
}));

export const leaveRequestRelations = relations(leaveRequest, ({one}) => ({
	organization: one(organization, {
		fields: [leaveRequest.organizationId],
		references: [organization.id]
	}),
}));