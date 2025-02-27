import "server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { put } from "@vercel/blob";
import { sql } from '@/lib/db';
import { redis } from '@/lib/db';

import { user, chat, User, reservation } from "./schema";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

// 定义用户类型
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
  profileImage?: File;
}) {
  const salt = genSaltSync(10);
  const hashedPassword = hashSync(userData.password, salt);

  try {
    // Store user in Postgres
    const result = await sql`
      INSERT INTO "User" (
        first_name, 
        last_name,
        email,
        password,
        agreed_to_terms,
        created_at,
        updated_at
      )
      VALUES (
        ${userData.firstName},
        ${userData.lastName},
        ${userData.email},
        ${hashedPassword},
        ${userData.agreedToTerms},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    const newUser = result[0];

    // Store profile image if provided
    if (userData.profileImage) {
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
    }

    // Cache the new user
    await redis.set(`user:${userData.email}`, newUser, {
      ex: 3600 // Expire in 1 hour
    });

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
