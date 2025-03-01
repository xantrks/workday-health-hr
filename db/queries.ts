import "server-only";

import { genSaltSync, hashSync } from "bcryptjs";
import { desc, eq, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { put } from "@vercel/blob";
import { sql } from '@/lib/db';
import { redis } from '@/lib/db';

import { user, chat, User, reservation, healthRecord } from "./schema";

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
    
    console.log("Creating health record with data:", {
      userId,
      date: formattedDate,
      recordType,
      periodFlow,
      symptoms: symptoms ? JSON.stringify(symptoms) : null,
      mood,
      sleepHours,
      stressLevel,
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
        ${periodFlow || null},
        ${symptoms ? JSON.stringify(symptoms) : null},
        ${mood || null},
        ${sleepHours || null},
        ${stressLevel || null},
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
    
    if (startDate && endDate) {
      query = query.where(
        and(
          gte(healthRecord.date, startDate),
          lte(healthRecord.date, endDate)
        )
      );
    }
    
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
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (periodFlow !== undefined) updateData.periodFlow = periodFlow;
    if (symptoms !== undefined) updateData.symptoms = JSON.stringify(symptoms);
    if (mood !== undefined) updateData.mood = mood;
    if (sleepHours !== undefined) updateData.sleepHours = sleepHours;
    if (stressLevel !== undefined) updateData.stressLevel = stressLevel;
    if (notes !== undefined) updateData.notes = notes;
    
    return await db
      .update(healthRecord)
      .set(updateData)
      .where(eq(healthRecord.id, id));
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
