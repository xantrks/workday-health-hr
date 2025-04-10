"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { redis } from "@/lib/db";
import { sql } from "@/lib/db";
import { createAuditLog } from "@/lib/audit-log";

import { signIn } from "./auth";

import { 
  getUser, 
  createUser, 
  createOrganization, 
  createOrganizationAdmin,
  createUserRole,
  getRoleByName
} from "@/db/queries";

// Login functionality

export interface LoginActionState {
  status: "idle" | "success" | "failed" | "invalid_data";
  role: string | null;
  userId: string | null;
}

export async function login(
  _: LoginActionState | null,
  formData: FormData
): Promise<LoginActionState> {
  try {
    // Validate the email
    const email = formData.get("email");
    if (!email || typeof email !== "string") {
      return {
        status: "invalid_data",
        role: null,
        userId: null,
      };
    }

    // Validate the password
    const password = formData.get("password");
    if (!password || typeof password !== "string") {
      return {
        status: "invalid_data",
        role: null,
        userId: null,
      };
    }

    // Parse the email and convert to lowercase
    const lowercaseEmail = email.toLowerCase();

    // Fetch the user from the database
    const userRows = await getUser(lowercaseEmail);
    if (userRows.length === 0) {
      return {
        status: "failed",
        role: null,
        userId: null,
      };
    }

    // Get user data including role information
    const user = userRows[0];
    
    // Get additional user data including primary role
    const userRoleData = await sql`
      SELECT 
        u.id, 
        u.role, 
        u.organization_id, 
        u.is_super_admin,
        r.name as role_name,
        r.id as role_id
      FROM "User" u
      LEFT JOIN "Role" r ON u.primary_role_id = r.id
      WHERE u.id = ${user.id}
    `;
    
    const userData = userRoleData[0];

    // Compare the password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return {
        status: "failed",
        role: null,
        userId: null,
      };
    }

    // Log successful login
    await createAuditLog({
      userId: user.id,
      entityId: user.id,
      entityType: "user",
      action: 'login',
      organizationId: userData.organization_id,
      details: {
        email: lowercaseEmail,
        timestamp: new Date().toISOString()
      }
    });

    // Sign the user in
    await signIn("credentials", {
      redirect: false,
      email: lowercaseEmail,
      password,
    });

    return {
      status: "success",
      role: userData.role_name || userData.role || "employee",
      userId: user.id,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      status: "failed",
      role: null,
      userId: null,
    };
  }
}

// Registration functionality

export interface RegisterActionState {
  status:
    | "idle"
    | "success"
    | "user_exists"
    | "invalid_data"
    | "failed_organization_creation"
    | "failed_user_creation"
    | "failed_role_assignment"
    | "error";
  message?: string;
}

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters"),
    confirmPassword: z.string(),
    organizationName: z.string().min(2, "Organization name is required"),
    agreedToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
    subscriptionPlan: z.string().default("basic"),
    isNewOrganization: z.boolean().default(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function register(
  _: RegisterActionState | null,
  formData: FormData
): Promise<RegisterActionState> {
  try {
    // Parse and validate form data
    const validatedFields = registerSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      organizationName: formData.get("organizationName"),
      agreedToTerms: formData.get("agreedToTerms") === "true",
      subscriptionPlan: formData.get("subscriptionPlan") || "basic",
      isNewOrganization: formData.get("isNewOrganization") === "true",
    });

    if (!validatedFields.success) {
      return {
        status: "invalid_data",
        message: validatedFields.error.errors[0].message,
      };
    }

    const {
      firstName,
      lastName,
      email,
      password,
      organizationName,
      agreedToTerms,
      subscriptionPlan,
      isNewOrganization,
    } = validatedFields.data;

    const lowercaseEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await getUser(lowercaseEmail);
    if (existingUser.length > 0) {
      return {
        status: "user_exists",
        message: "A user with this email already exists",
      };
    }

    // Get organization admin role
    const orgAdminRole = await getRoleByName("orgadmin");
    if (!orgAdminRole) {
      return {
        status: "error",
        message: "Could not find organization admin role",
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Use transaction to ensure all operations succeed or fail together
    try {
      await sql`BEGIN`;
      
      try {
        // Create organization
        const newOrganization = await sql`
          INSERT INTO "Organization" (
            name,
            subscription_plan
          )
          VALUES (
            ${organizationName},
            ${subscriptionPlan}
          )
          RETURNING *
        `;

        if (!newOrganization || newOrganization.length === 0) {
          throw new Error("Failed to create organization");
        }

        const organizationId = newOrganization[0].id;

        // Create user with organization association
        const newUser = await sql`
          INSERT INTO "User" (
            first_name,
            last_name,
            email,
            password,
            agreed_to_terms,
            organization_id,
            primary_role_id,
            role
          )
          VALUES (
            ${firstName},
            ${lastName},
            ${lowercaseEmail},
            ${hashedPassword},
            ${agreedToTerms},
            ${organizationId},
            ${orgAdminRole.id},
            ${"orgadmin"}
          )
          RETURNING *
        `;

        if (!newUser || newUser.length === 0) {
          throw new Error("Failed to create user");
        }

        const userId = newUser[0].id;

        // Create organization admin record
        await sql`
          INSERT INTO "OrganizationAdmin" (
            user_id,
            organization_id,
            is_main_admin
          )
          VALUES (
            ${userId},
            ${organizationId},
            ${true}
          )
        `;

        // Create user role assignment
        await sql`
          INSERT INTO "UserRole" (
            user_id,
            role_id,
            organization_id
          )
          VALUES (
            ${userId},
            ${orgAdminRole.id},
            ${organizationId}
          )
        `;

        // Log registration in audit log
        await createAuditLog({
          userId: userId,
          entityId: userId,
          entityType: 'user',
          action: 'registration',
          organizationId: organizationId,
          details: {
            email: lowercaseEmail,
            timestamp: new Date().toISOString()
          }
        });
        
        await sql`COMMIT`;
      } catch (error) {
        await sql`ROLLBACK`;
        throw error;
      }
    } catch (txError) {
      console.error("Transaction error during registration:", txError);
      return {
        status: "error",
        message: `Registration failed: ${txError instanceof Error ? txError.message : "Unknown error"}`,
      };
    }

    // Cache the user data in Redis for faster login
    const userData = {
      email: lowercaseEmail,
      firstName,
      lastName,
      role: "orgadmin",
    };

    await redis.set(`user:${lowercaseEmail}`, JSON.stringify(userData), {
      ex: 3600, // Expire in 1 hour
    });

    return { status: "success" };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      status: "error",
      message: "An unexpected error occurred during registration",
    };
  }
}

// Helper functions
export async function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  return "http://localhost:3000";
}