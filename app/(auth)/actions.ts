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
    // Validate login form
    const validationResult = authFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validationResult.success) {
      console.log("Form validation failed:", validationResult.error);
      return { status: "invalid_data" };
    }

    const validatedData = validationResult.data;

    // Get user role and ID
    const userResult = await getUser(validatedData.email);
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
    // Validate form data
    const validationResult = registerFormSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      agreedToTerms: formData.get("agreedToTerms") === "on",
      profileImage: formData.get("profileImage") as File | null
    });

    if (!validationResult.success) {
      return {
        status: "invalid_data",
        errors: validationResult.error.errors.map((error) => ({
          message: error.message,
        })),
      };
    }

    const validatedData = validationResult.data;

    // Check if user already exists
    const existingUser = await getUser(validatedData.email);
    if (existingUser.length > 0) {
      return {
        status: "user_exists",
        errors: [
          {
            message: "A user with this email already exists",
          },
        ],
      };
    }

    // Hash password
    const hashedPassword = hashSync(validatedData.password, 10);

    // Create user in database
    const user = await createUser({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email.toLowerCase(),
      password: hashedPassword,
      agreedToTerms: validatedData.agreedToTerms,
      profileImage: validatedData.profileImage || undefined
    });

    // After successfully creating user, cache user data to Redis
    const userId = user.userId;
    if (userId) {
      await redis.set(
        `user:${userId}`,
        JSON.stringify({
          id: userId,
          email: validatedData.email.toLowerCase(),
          firstName: validatedData.firstName,
          lastName: validatedData.lastName
        }),
        { ex: 3600 } // 1 hour expiration
      );
    }

    return {
      status: "success",
    };
  } catch (error) {
    // Add type checking
    if (error instanceof Error) {
      console.error("Registration error:", error.message);
    } else {
      console.error("Unknown registration error");
    }

    return {
      status: "failed",
      errors: [
        {
          message: "Failed to create account. Please try again later.",
        },
      ],
    };
  }
}

const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}