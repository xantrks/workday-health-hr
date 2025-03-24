"use server";

import { hashSync } from "bcryptjs";
import { SignInResponse } from "next-auth/react";
import { z } from "zod";

import { createUser, getUser } from "@/db/queries";
import { redis } from "@/lib/db";
import { sql } from "@/lib/db";

import { signIn } from "./auth";

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
  role?: string;
  userId?: string;
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Get user role and ID
    const userResult = await sql`
      SELECT id, role FROM "User" 
      WHERE email = ${validatedData.email}
    `;
    
    const user = userResult[0];
    if (!user) {
      console.log("User does not exist:", validatedData.email);
      return { status: "failed" };
    }
    
    console.log("Retrieved user from database:", user.id, "role:", user.role);

    try {
      const result = await signIn("credentials", {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false
      });

      if (result?.error) {
        console.error("SignIn error:", result.error);
        return { status: "failed" };
      }

      // Ensure returning user ID and role (using lowercase role name)
      const normalizedRole = typeof user.role === 'string' ? user.role.toLowerCase() : 'employee';
      console.log("Login successful, returning role:", normalizedRole, "User ID:", user.id.toString());
      
      return { 
        status: "success",
        role: normalizedRole,
        userId: user.id.toString() // Ensure ID is a string
      };
    } catch (signInError: any) {
      console.error("SignIn error:", signInError);
      return { status: "failed" };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }
    console.error("Login error:", error);
    return { status: "failed" };
  }
};

const registerFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"), 
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  agreedToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export interface RegisterActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "user_exists" | "invalid_data";
  errors?: Array<{ message: string }>;
}

export async function register(prevState: RegisterActionState, formData: FormData): Promise<RegisterActionState> {
  try {
    const rawFormData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      agreedToTerms: formData.get("agreedToTerms") === "on",
      profileImage: formData.get("profileImage") as File | null
    };

    // Validate form data
    const validatedData = registerFormSchema.safeParse(rawFormData);
    
    if (!validatedData.success) {
      return {
        status: "invalid_data",
        errors: validatedData.error.errors.map(error => ({
          message: error.message
        }))
      };
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT email FROM "User" 
      WHERE email = ${validatedData.data.email}
    `;

    if (existingUser.length > 0) {
      return {
        status: "user_exists"
      };
    }

    // Hash the password
    const hashedPassword = hashSync(validatedData.data.password, 10);

    let newUser;
    try {
      newUser = await createUser({
        firstName: validatedData.data.firstName,
        lastName: validatedData.data.lastName,
        email: validatedData.data.email,
        password: hashedPassword,
        agreedToTerms: validatedData.data.agreedToTerms,
        profileImage: rawFormData.profileImage || undefined
      });

      // After successfully creating the user, cache user data to Redis
      await redis.set(`user:${validatedData.data.email}`, {
        firstName: validatedData.data.firstName,
        lastName: validatedData.data.lastName,
        email: validatedData.data.email
      }, {
        ex: 3600 // 1 hour expiration
      });

      return {
        status: "success"
      };
      
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Add type checking
      if (typeof dbError === 'object' && dbError !== null && 'code' in dbError) {
        if (dbError.code === '23505') {
          return {
            status: "user_exists"
          };
        }
      }
      throw dbError;
    }

  } catch (error) {
    console.error("Registration error:", error);
    return {
      status: "failed",
      errors: [{
        message: error instanceof Error ? error.message : "Failed to create account"
      }]
    };
  }
}

const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}