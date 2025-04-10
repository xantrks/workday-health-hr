import "server-only";

import { put } from "@vercel/blob";
import { genSaltSync, hashSync } from "bcryptjs";
import { desc, eq, and, gte, lte, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { sql } from '@/lib/db';
import { redis } from '@/lib/db';
import { generateUUID } from '@/lib/utils';

// Add fallback UUID generation for resilience
function generateFallbackUUID() {
  return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, function(c) {
    const r = Math.random() * 16 | 0;
    return r.toString(16);
  });
}

// Safely generate UUID, with fallback method if import fails
function getUUID() {
  try {
    return generateUUID();
  } catch (error) {
    console.warn("Failed to import generateUUID, using fallback method");
    return generateFallbackUUID();
  }
}

import { 
  user, 
  chat, 
  User, 
  reservation, 
  healthRecord, 
  feedback, 
  leaveRequest, 
  LeaveRequest,
  organization,
  Organization,
  employee,
  userRole,
  role,
  organizationAdmin,
  superAdmin,
  hrManager
} from "./schema";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

// Define user types
interface DbUser {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  agreed_to_terms: boolean;
  created_at: Date;
  updated_at: Date;
  role: string;
  organization_id?: string;
  is_super_admin?: boolean;
}

// Role management functions

export async function getRoleByName(roleName: string) {
  try {
    const result = await sql`
      SELECT * FROM "Role"
      WHERE name = ${roleName}
    `;
    
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Failed to get role by name:", error);
    throw error;
  }
}

export async function getAllRoles() {
  try {
    const result = await sql`
      SELECT * FROM "Role"
      ORDER BY level ASC
    `;
    
    return result;
  } catch (error) {
    console.error("Failed to get all roles:", error);
    throw error;
  }
}

// Organization management functions

export async function createOrganization(data: {
  name: string;
  subscriptionPlan: string;
  logoUrl?: string;
}) {
  try {
    const result = await sql`
      INSERT INTO "Organization" (
        name,
        subscription_plan,
        logo_url
      )
      VALUES (
        ${data.name},
        ${data.subscriptionPlan},
        ${data.logoUrl || null}
      )
      RETURNING *
    `;

    return result[0];
  } catch (error) {
    console.error("Failed to create organization:", error);
    throw error;
  }
}

export async function getOrganizationById(id: string) {
  try {
    const result = await sql`
      SELECT * FROM "Organization"
      WHERE id = ${id}
    `;
    
    return result[0];
  } catch (error) {
    console.error("Failed to get organization:", error);
    throw error;
  }
}

export async function getAllOrganizations() {
  try {
    const result = await sql`
      SELECT * FROM "Organization"
      ORDER BY name ASC
    `;
    
    return result;
  } catch (error) {
    console.error("Failed to get organizations:", error);
    throw error;
  }
}

export async function updateOrganization(id: string, data: {
  name?: string;
  subscriptionPlan?: string;
  logoUrl?: string;
}) {
  try {
    let updateQuery = '';
    
    if (data.name) {
      updateQuery += `name = ${data.name}, `;
    }
    
    if (data.subscriptionPlan) {
      updateQuery += `subscription_plan = ${data.subscriptionPlan}, `;
    }
    
    if (data.logoUrl) {
      updateQuery += `logo_url = ${data.logoUrl}, `;
    }
    
    if (updateQuery === '') {
      return null; // Nothing to update
    }
    
    // Always add updated_at
    updateQuery += 'updated_at = CURRENT_TIMESTAMP';
    
    const result = await sql`
      UPDATE "Organization"
      SET ${sql`${updateQuery}`}
      WHERE id = ${id}
      RETURNING *
    `;
    
    return result[0];
  } catch (error) {
    console.error("Failed to update organization:", error);
    throw error;
  }
}

// Organization Admin functions

export async function createOrganizationAdmin(data: {
  userId: string;
  organizationId: string;
  isMainAdmin?: boolean;
  createdById?: string;
}) {
  try {
    const result = await sql`
      INSERT INTO "OrganizationAdmin" (
        user_id,
        organization_id,
        is_main_admin,
        created_by_id
      )
      VALUES (
        ${data.userId},
        ${data.organizationId},
        ${data.isMainAdmin || false},
        ${data.createdById || null}
      )
      RETURNING *
    `;

    return result[0];
  } catch (error) {
    console.error("Failed to create organization admin:", error);
    throw error;
  }
}

export async function getOrganizationAdmins(organizationId: string) {
  try {
    const result = await sql`
      SELECT oa.*, u.first_name, u.last_name, u.email
      FROM "OrganizationAdmin" oa
      JOIN "User" u ON oa.user_id = u.id
      WHERE oa.organization_id = ${organizationId}
      ORDER BY oa.is_main_admin DESC, u.first_name ASC
    `;
    
    return result;
  } catch (error) {
    console.error("Failed to get organization admins:", error);
    throw error;
  }
}

// User Role functions

export async function createUserRole(data: {
  userId: string;
  roleId: string;
  organizationId: string;
  assignedById?: string;
}) {
  try {
    const result = await sql`
      INSERT INTO "UserRole" (
        user_id,
        role_id,
        organization_id,
        assigned_by_id
      )
      VALUES (
        ${data.userId},
        ${data.roleId},
        ${data.organizationId},
        ${data.assignedById || null}
      )
      RETURNING *
    `;

    return result[0];
  } catch (error) {
    console.error("Failed to create user role:", error);
    throw error;
  }
}

export async function getUserRoles(userId: string) {
  try {
    const result = await sql`
      SELECT ur.*, r.name as role_name, r.level as role_level
      FROM "UserRole" ur
      JOIN "Role" r ON ur.role_id = r.id
      WHERE ur.user_id = ${userId}
      ORDER BY r.level ASC
    `;
    
    return result;
  } catch (error) {
    console.error("Failed to get user roles:", error);
    throw error;
  }
}

// Updated user functions

export async function getUser(email: string): Promise<DbUser[]> {
  // First try to get from Redis cache
  const cachedUser = await redis.get(`user:${email}`);
  if (cachedUser) {
    return [cachedUser as DbUser];
  }

  // If not in cache, query from Postgres
  try {
    const result = await sql`
      SELECT 
        id,
        email,
        password,
        first_name,
        last_name,
        agreed_to_terms,
        created_at,
        updated_at,
        role,
        organization_id,
        is_super_admin
      FROM "User" 
      WHERE email = ${email}
    ` as unknown as DbUser[];
    
    if (result.length > 0) {
      // Cache the user data
      await redis.set(`user:${email}`, result[0], {
        ex: 3600 // Expire in 1 hour
      });
    }
    
    return result;
  } catch (error) {
    console.error("Failed to get user:", error);
    throw error;
  }
}

export async function getUserById(id: string): Promise<DbUser | null> {
  try {
    const result = await sql`
      SELECT 
        id,
        email,
        first_name,
        last_name,
        agreed_to_terms,
        created_at,
        updated_at,
        role,
        organization_id,
        is_super_admin
      FROM "User" 
      WHERE id = ${id}
    ` as unknown as DbUser[];
    
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Failed to get user by ID:", error);
    throw error;
  }
}

export async function createUser(userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreedToTerms: boolean;
  role?: string;
  primaryRoleId?: string;
  organizationId?: string;
  isSuperAdmin?: boolean;
  profileImage?: File;
}) {
  try {
    // Use parameterized query
    const result = await sql`
      INSERT INTO "User" (
        first_name,
        last_name,
        email,
        password,
        agreed_to_terms,
        role,
        primary_role_id,
        organization_id,
        is_super_admin
      )
      VALUES (
        ${userData.firstName},
        ${userData.lastName},
        ${userData.email},
        ${userData.password},
        ${userData.agreedToTerms},
        ${userData.role || 'employee'},
        ${userData.primaryRoleId || null},
        ${userData.organizationId || null},
        ${userData.isSuperAdmin || false}
      )
      RETURNING *
    `;

    const newUser = result[0];

    // If avatar is provided, handle avatar upload
    if (userData.profileImage) {
      try {
        const { url } = await put(
          `profile-images/${newUser.id}`, 
          userData.profileImage,
          { access: 'public' }
        );
        
        await sql`
          UPDATE "User"
          SET profile_image_url = ${url}
          WHERE id = ${newUser.id}
        `;
        
        newUser.profileImageUrl = url;
      } catch (uploadError) {
        console.error("Failed to upload profile image:", uploadError);
      }
    }

    return newUser;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
}

export async function updateUser(id: string, userData: {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  agreedToTerms?: boolean;
  role?: string;
  primaryRoleId?: string;
  organizationId?: string;
  isSuperAdmin?: boolean;
  profileImage?: File;
}) {
  try {
    // Build the update query dynamically
    let updateFields = [];
    
    if (userData.firstName !== undefined) {
      updateFields.push(`first_name = ${userData.firstName}`);
    }
    
    if (userData.lastName !== undefined) {
      updateFields.push(`last_name = ${userData.lastName}`);
    }
    
    if (userData.email !== undefined) {
      updateFields.push(`email = ${userData.email}`);
    }
    
    if (userData.password !== undefined) {
      updateFields.push(`password = ${userData.password}`);
    }
    
    if (userData.agreedToTerms !== undefined) {
      updateFields.push(`agreed_to_terms = ${userData.agreedToTerms}`);
    }
    
    if (userData.role !== undefined) {
      updateFields.push(`role = ${userData.role}`);
    }
    
    if (userData.primaryRoleId !== undefined) {
      updateFields.push(`primary_role_id = ${userData.primaryRoleId}`);
    }
    
    if (userData.organizationId !== undefined) {
      updateFields.push(`organization_id = ${userData.organizationId}`);
    }
    
    if (userData.isSuperAdmin !== undefined) {
      updateFields.push(`is_super_admin = ${userData.isSuperAdmin}`);
    }
    
    // Add updated_at timestamp
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
    
    if (updateFields.length === 0) {
      return null; // Nothing to update
    }
    
    const updateQuery = updateFields.join(', ');
    
    const result = await sql`
      UPDATE "User"
      SET ${sql`${updateQuery}`}
      WHERE id = ${id}
      RETURNING *
    `;

    const updatedUser = result[0];

    // Handle profile image upload if provided
    if (userData.profileImage) {
      try {
        const { url } = await put(
          `profile-images/${updatedUser.id}`, 
          userData.profileImage,
          { access: 'public' }
        );
        
        await sql`
          UPDATE "User"
          SET profile_image_url = ${url}
          WHERE id = ${updatedUser.id}
        `;
        
        updatedUser.profileImageUrl = url;
      } catch (uploadError) {
        console.error("Failed to upload profile image:", uploadError);
      }
    }

    return updatedUser;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
}

export async function assignUserToOrganization(userId: string, organizationId: string) {
  try {
    const result = await sql`
      UPDATE "User"
      SET organization_id = ${organizationId}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
      RETURNING *
    `;
    
    return result[0];
  } catch (error) {
    console.error("Failed to assign user to organization:", error);
    throw error;
  }
}

export async function getUsersByOrganizationId(organizationId: string, role?: string) {
  try {
    if (role) {
      const result = await sql`
        SELECT 
          id, 
          email, 
          first_name, 
          last_name, 
          role,
          profile_image_url,
          created_at
        FROM "User" 
        WHERE organization_id = ${organizationId}
        AND role = ${role}
        ORDER BY first_name ASC
      `;
      return result;
    } else {
      const result = await sql`
        SELECT 
          id, 
          email, 
          first_name, 
          last_name, 
          role,
          profile_image_url,
          created_at
        FROM "User" 
        WHERE organization_id = ${organizationId}
        ORDER BY first_name ASC
      `;
      return result;
    }
  } catch (error) {
    console.error("Failed to get users by organization:", error);
    throw error;
  }
}

// Employee-related functions

export async function createEmployeeProfile(data: {
  userId: string;
  gender?: string;
  dateOfBirth?: Date;
  emergencyContact?: string;
  hireDate?: Date;
  jobTitle?: string;
  managerId?: string;
}) {
  try {
    const result = await sql`
      INSERT INTO "Employee" (
        user_id,
        gender,
        date_of_birth,
        emergency_contact,
        hire_date,
        job_title,
        manager_id
      )
      VALUES (
        ${data.userId},
        ${data.gender || null},
        ${data.dateOfBirth || null},
        ${data.emergencyContact || null},
        ${data.hireDate || null},
        ${data.jobTitle || null},
        ${data.managerId || null}
      )
      RETURNING *
    `;
    
    return result[0];
  } catch (error) {
    console.error("Failed to create employee profile:", error);
    throw error;
  }
}

export async function getEmployeeProfile(userId: string) {
  try {
    const result = await sql`
      SELECT * FROM "Employee"
      WHERE user_id = ${userId}
    `;
    
    return result[0] || null;
  } catch (error) {
    console.error("Failed to get employee profile:", error);
    throw error;
  }
}

// Other functions remain the same but get organization_id parameter where appropriate

// ... existing code ...

// Update healthRecord functions to include organization_id
export async function createHealthRecord({
  userId,
  date,
  recordType,
  periodFlow,
  symptoms,
  mood,
  sleepHours,
  stressLevel,
  notes,
  organizationId
}: {
  userId: string;
  date: Date;
  recordType: string;
  periodFlow?: number;
  symptoms?: any;
  mood?: string;
  sleepHours?: number;
  stressLevel?: number;
  notes?: string;
  organizationId?: string;
}) {
  try {
    // Ensure date format is correct, use UTC date to avoid timezone issues
    const formattedDate = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
    
    // 确保即使值为0也能正确处理
    const sleepHoursValue = sleepHours !== undefined ? sleepHours : null;
    const stressLevelValue = stressLevel !== undefined ? stressLevel : null;
    
    console.log("Creating health record with data:", {
      userId,
      date: formattedDate,
      recordType,
      periodFlow,
      symptoms: symptoms ? JSON.stringify(symptoms) : null,
      mood,
      sleepHours: sleepHoursValue,
      stressLevel: stressLevelValue,
      notes
    });
    
    // Use raw SQL query to insert record
    const result = await sql`
      INSERT INTO "HealthRecord" (
        "userId",
        "date",
        "record_type",
        "period_flow",
        "symptoms",
        "mood",
        "sleep_hours",
        "stress_level",
        "notes",
        "organization_id",
        "created_at",
        "updated_at"
      )
      VALUES (
        ${userId},
        ${formattedDate},
        ${recordType},
        ${periodFlow !== undefined ? periodFlow : null},
        ${symptoms ? JSON.stringify(symptoms) : null},
        ${mood || null},
        ${sleepHoursValue},
        ${stressLevelValue},
        ${notes || null},
        ${organizationId || null},
        NOW(),
        NOW()
      )
      RETURNING *
    `;
    
    console.log("Created health record result:", result);
    return result[0];
  } catch (error) {
    console.error("Failed to create health record:", error);
    throw error;
  }
}

export async function getHealthRecordsByUserId({ 
  userId, 
  startDate, 
  endDate 
}: { 
  userId: string; 
  startDate?: Date; 
  endDate?: Date; 
}) {
  try {
    let query = db
      .select()
      .from(healthRecord)
      .where(eq(healthRecord.userId, userId));
    
    // 如果有日期范围，使用SQL直接查询
    if (startDate && endDate) {
      const result = await sql`
        SELECT * FROM "HealthRecord"
        WHERE "userId" = ${userId}
          AND date >= ${startDate}
          AND date <= ${endDate}
        ORDER BY date DESC
      `;
      return result;
    }
    
    // 否则使用Drizzle ORM
    return await query.orderBy(desc(healthRecord.date));
  } catch (error) {
    console.error("Failed to get health records:", error);
    throw error;
  }
}

export async function getPeriodRecordsByUserId({ 
  userId, 
  startDate, 
  endDate 
}: { 
  userId: string; 
  startDate?: Date; 
  endDate?: Date; 
}) {
  try {
    console.log("Getting period records for userId:", userId);
    
    let sqlQuery;
    
    if (startDate && endDate) {
      console.log("With date range:", { 
        startDate: startDate.toISOString(), 
        endDate: endDate.toISOString() 
      });
      
      sqlQuery = sql`
        SELECT * FROM "HealthRecord"
        WHERE "userId" = ${userId}
        AND "record_type" = 'period'
        AND "date" >= ${startDate.toISOString().split('T')[0]}
        AND "date" <= ${endDate.toISOString().split('T')[0]}
        ORDER BY "date" DESC
      `;
    } else {
      sqlQuery = sql`
        SELECT * FROM "HealthRecord"
        WHERE "userId" = ${userId}
        AND "record_type" = 'period'
        ORDER BY "date" DESC
      `;
    }
    
    const records = await sqlQuery;
    console.log("Found period records:", records);
    return records;
  } catch (error) {
    console.error("Failed to get period records:", error);
    throw error;
  }
}

export async function getHealthRecordById(id: string) {
  try {
    console.log("Getting health record by id:", id);
    
    const record = await sql`
      SELECT * FROM "HealthRecord"
      WHERE "id" = ${id}
      LIMIT 1
    `;
    
    console.log("Found health record:", record[0]);
    return record[0];
  } catch (error) {
    console.error("Failed to get health record by id:", error);
    throw error;
  }
}

export async function updateHealthRecord({
  id,
  periodFlow,
  symptoms,
  mood,
  sleepHours,
  stressLevel,
  notes
}: {
  id: string;
  periodFlow?: number;
  symptoms?: any;
  mood?: string;
  sleepHours?: number;
  stressLevel?: number;
  notes?: string;
}) {
  try {
    // Build update data object for logging
    const updateData: any = {
      updated_at: new Date()
    };
    
    if (periodFlow !== undefined) updateData.period_flow = periodFlow;
    if (symptoms !== undefined) updateData.symptoms = JSON.stringify(symptoms);
    if (mood !== undefined) updateData.mood = mood;
    if (sleepHours !== undefined) updateData.sleep_hours = sleepHours;
    if (stressLevel !== undefined) updateData.stress_level = stressLevel;
    if (notes !== undefined) updateData.notes = notes;
    
    console.log("Updating health record with data:", {
      id,
      updateData
    });
    
    // Use raw SQL query instead of ORM
    const result = await sql`
      UPDATE "HealthRecord"
      SET 
        "updated_at" = NOW(),
        "period_flow" = ${periodFlow !== undefined ? periodFlow : sql`"period_flow"`},
        "symptoms" = ${symptoms !== undefined ? JSON.stringify(symptoms) : sql`"symptoms"`},
        "mood" = ${mood !== undefined ? mood : sql`"mood"`},
        "sleep_hours" = ${sleepHours !== undefined ? sleepHours : sql`"sleep_hours"`},
        "stress_level" = ${stressLevel !== undefined ? stressLevel : sql`"stress_level"`},
        "notes" = ${notes !== undefined ? notes : sql`"notes"`}
      WHERE "id" = ${id}
      RETURNING *
    `;
    
    console.log("Updated health record result:", result);
    return result[0];
  } catch (error) {
    console.error("Failed to update health record:", error);
    throw error;
  }
}

export async function deleteHealthRecord(id: string) {
  try {
    console.log("Deleting health record with id:", id);
    return await db.delete(healthRecord).where(eq(healthRecord.id, id));
  } catch (error) {
    console.error("Failed to delete health record:", error);
    throw error;
  }
}

export async function createFeedback({
  content,
  category,
  anonymous,
  userId,
}: {
  content: string;
  category: string;
  anonymous: boolean;
  userId?: string;
}) {
  try {
    const result = await db
      .insert(feedback)
      .values({
        id: crypto.randomUUID(),
        content,
        category,
        anonymous,
        userId: anonymous ? undefined : userId,
        createdAt: new Date(),
      })
      .returning();
    
    return { success: true, data: result[0] };
  } catch (error) {
    console.error("Error creating feedback:", error);
    return { success: false, error: "Failed to create feedback" };
  }
}

export async function getAllFeedback() {
  try {
    const result = await db.select().from(feedback).orderBy(desc(feedback.createdAt));
    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting all feedback:", error);
    return { success: false, error: "Failed to get feedback" };
  }
}

export async function getFeedbackByCategory(category: string) {
  try {
    const result = await db
      .select()
      .from(feedback)
      .where(eq(feedback.category, category))
      .orderBy(desc(feedback.createdAt));
    
    return { success: true, data: result };
  } catch (error) {
    console.error("Error getting feedback by category:", error);
    return { success: false, error: "Failed to get feedback" };
  }
}

export async function deleteFeedback(id: string) {
  try {
    await db.delete(feedback).where(eq(feedback.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return { success: false, error: "Failed to delete feedback" };
  }
}

// Create leave request
export async function createLeaveRequest({
  employeeId,
  startDate,
  endDate,
  leaveType,
  reason,
}: {
  employeeId: string;
  startDate: Date;
  endDate: Date; 
  leaveType: string;
  reason: string;
}) {
  try {
    const result = await sql`
      INSERT INTO "LeaveRequest" (
        employee_id,
        start_date,
        end_date,
        leave_type,
        reason,
        status
      )
      VALUES (
        ${employeeId},
        ${startDate},
        ${endDate},
        ${leaveType},
        ${reason},
        'pending'
      )
      RETURNING *
    `;
    
    return result[0];
  } catch (error) {
    console.error("Failed to create leave request:", error);
    throw error;
  }
}

// Get all leave requests for a user
export async function getLeaveRequestsByEmployeeId({
  employeeId,
}: {
  employeeId: string;
}) {
  try {
    // Use raw SQL query instead of Drizzle ORM
    const requests = await sql`
      SELECT * FROM "LeaveRequest"
      WHERE "employee_id" = ${employeeId}
      ORDER BY "created_at" DESC
    `;
    
    return requests;
  } catch (error) {
    console.error("Failed to get leave requests:", error);
    throw error;
  }
}

// Get specific leave request by ID
export async function getLeaveRequestById({
  id,
}: {
  id: string;
}) {
  try {
    // Use raw SQL query instead of Drizzle ORM
    const request = await sql`
      SELECT * FROM "LeaveRequest"
      WHERE "id" = ${id}
      LIMIT 1
    `;
    
    return request[0];
  } catch (error) {
    console.error("Failed to get leave request:", error);
    throw error;
  }
}

// Update leave request status
export async function updateLeaveRequestStatus({
  id,
  status,
  approverNote,
  approverId,
}: {
  id: string;
  status: string;
  approverNote?: string;
  approverId?: string;
}) {
  try {
    // Use raw SQL query instead of Drizzle ORM
    const result = await sql`
      UPDATE "LeaveRequest"
      SET 
        "status" = ${status},
        "approver_note" = ${approverNote || null},
        "approver_id" = ${approverId || null},
        "approved_at" = NOW(),
        "updated_at" = NOW()
      WHERE "id" = ${id}
      RETURNING *
    `;
    
    return result[0];
  } catch (error) {
    console.error("Failed to update leave request status:", error);
    throw error;
  }
}

// Create multiple leave requests at once
// This function is temporarily disabled due to type issues
// export async function createBulkLeaveRequests(leaveRequests: {
//   startDate: string;
//   endDate: string;
//   leaveType: string;
//   reason: string;
//   employeeId: string;
//   status?: string;
// }[]) {
//   try {
//     // Format the requests properly for insertion
//     const formattedRequests = leaveRequests.map(request => ({
//       startDate: request.startDate,
//       endDate: request.endDate,
//       leaveType: request.leaveType,
//       reason: request.reason,
//       employeeId: request.employeeId,
//       status: request.status || "pending",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }));

//     const result = await db
//       .insert(leaveRequest)
//       .values(formattedRequests)
//       .returning();
    
//     return result;
//   } catch (error) {
//     console.error("Failed to create bulk leave requests:", error);
//     throw error;
//   }
// }

// Chat-related functions
export async function getChatsByUserId({ id }: { id: string }) {
  try {
    const result = await sql`
      SELECT * FROM "Chat"
      WHERE "userId" = ${id}
      ORDER BY "createdAt" DESC
    `;
    
    return result;
  } catch (error) {
    console.error("Failed to get chat history:", error);
    return [];
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const result = await sql`
      SELECT * FROM "Chat"
      WHERE id = ${id}
    `;
    
    if (result.length === 0) {
      throw new Error("Chat not found");
    }
    
    return result[0];
  } catch (error) {
    console.error("Failed to get chat by ID:", error);
    throw error;
  }
}

export async function saveChat({ 
  id,
  messages,
  userId 
}: { 
  id: string; 
  messages: any[];
  userId: string;
}) {
  try {
    // Check if chat exists
    const existingChat = await sql`
      SELECT * FROM "Chat"
      WHERE id = ${id}
    `;
    
    if (existingChat.length > 0) {
      // Update existing chat
      await sql`
        UPDATE "Chat"
        SET messages = ${JSON.stringify(messages)}
        WHERE id = ${id}
      `;
      return existingChat[0];
    } else {
      // Create new chat
      const result = await sql`
        INSERT INTO "Chat" (
          id,
          "createdAt",
          messages,
          "userId"
        )
        VALUES (
          ${id},
          ${new Date()},
          ${JSON.stringify(messages)},
          ${userId}
        )
        RETURNING *
      `;
      return result[0];
    }
  } catch (error) {
    console.error("Failed to save chat:", error);
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await sql`
      DELETE FROM "Chat"
      WHERE id = ${id}
    `;
    return true;
  } catch (error) {
    console.error("Failed to delete chat:", error);
    throw error;
  }
}

// Reservation functions
export async function getReservationById({ id }: { id: string }) {
  try {
    const result = await sql`
      SELECT * FROM "Reservation"
      WHERE id = ${id}
    `;
    
    return result[0];
  } catch (error) {
    console.error("Failed to get reservation:", error);
    throw error;
  }
}

export async function updateReservation({ 
  id, 
  hasCompletedPayment 
}: { 
  id: string; 
  hasCompletedPayment: boolean 
}) {
  try {
    const result = await sql`
      UPDATE "Reservation"
      SET "hasCompletedPayment" = ${hasCompletedPayment}
      WHERE id = ${id}
      RETURNING *
    `;
    
    return result[0];
  } catch (error) {
    console.error("Failed to update reservation:", error);
    throw error;
  }
}

// User role functions
export async function updateUserRole({ 
  userId, 
  role, 
  organizationId 
}: { 
  userId: string; 
  role: string;
  organizationId: string;
}) {
  try {
    // First, get the role ID
    const roleResult = await sql`
      SELECT id FROM "Role"
      WHERE name = ${role}
    `;
    
    if (!roleResult.length) {
      throw new Error(`Role ${role} not found`);
    }
    
    const roleId = roleResult[0].id;
    
    // Check if user already has a role in this organization
    const existingRoleResult = await sql`
      SELECT * FROM "UserRole"
      WHERE user_id = ${userId}
      AND organization_id = ${organizationId}
    `;
    
    if (existingRoleResult.length) {
      // Update existing role
      const result = await sql`
        UPDATE "UserRole"
        SET role_id = ${roleId},
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId}
        AND organization_id = ${organizationId}
        RETURNING *
      `;
      
      // Also update the primary_role_id in User table
      await sql`
        UPDATE "User"
        SET primary_role_id = ${roleId},
            role = ${role},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${userId}
      `;
      
      return result[0];
    } else {
      // Create new role assignment
      const result = await sql`
        INSERT INTO "UserRole" (
          user_id,
          role_id,
          organization_id
        )
        VALUES (
          ${userId},
          ${roleId},
          ${organizationId}
        )
        RETURNING *
      `;
      
      // Also update the primary_role_id in User table
      await sql`
        UPDATE "User"
        SET primary_role_id = ${roleId},
            role = ${role},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${userId}
      `;
      
      return result[0];
    }
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw error;
  }
}
