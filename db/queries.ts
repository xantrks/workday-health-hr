import "server-only";

import { put } from "@vercel/blob";
import { genSaltSync, hashSync } from "bcryptjs";
import { desc, eq, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { sql } from '@/lib/db';
import { redis } from '@/lib/db';

import { user, chat, User, reservation, healthRecord, feedback } from "./schema";

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
}

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
        updated_at
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

export async function createUser(userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agreedToTerms: boolean;
  role?: string;
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
        role
      )
      VALUES (
        ${userData.firstName},
        ${userData.lastName},
        ${userData.email},
        ${userData.password},
        ${userData.agreedToTerms},
        ${userData.role || 'employee'}
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

export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: any;
  userId: string;
}) {
  try {
    const selectedChats = await db.select().from(chat).where(eq(chat.id, id));

    if (selectedChats.length > 0) {
      return await db
        .update(chat)
        .set({
          messages: JSON.stringify(messages),
        })
        .where(eq(chat.id, id));
    }

    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      messages: JSON.stringify(messages),
      userId,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function createReservation({
  id,
  userId,
  details,
}: {
  id: string;
  userId: string;
  details: any;
}) {
  return await db.insert(reservation).values({
    id,
    createdAt: new Date(),
    userId,
    hasCompletedPayment: false,
    details: JSON.stringify(details),
  });
}

export async function getReservationById({ id }: { id: string }) {
  const [selectedReservation] = await db
    .select()
    .from(reservation)
    .where(eq(reservation.id, id));

  return selectedReservation;
}

export async function updateReservation({
  id,
  hasCompletedPayment,
}: {
  id: string;
  hasCompletedPayment: boolean;
}) {
  return await db
    .update(reservation)
    .set({
      hasCompletedPayment,
    })
    .where(eq(reservation.id, id));
}

// Health record related query functions
export async function createHealthRecord({
  userId,
  date,
  recordType,
  periodFlow,
  symptoms,
  mood,
  sleepHours,
  stressLevel,
  notes
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
    // 构建更新数据对象，用于日志记录
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
    
    // 使用原始SQL查询而不是ORM
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
