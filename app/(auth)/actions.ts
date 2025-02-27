"use server";

import { z } from "zod";
import { hashSync } from "bcrypt-ts";
import { sql } from "@/lib/db";
import { redis } from "@/lib/db";

import { createUser, getUser } from "@/db/queries";

import { signIn } from "./auth";

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
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

    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    if (result?.error) {
      return { status: "failed" };
    }

    return { status: "success" };
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

    // 验证表单数据
    const validatedData = registerFormSchema.safeParse(rawFormData);
    
    if (!validatedData.success) {
      return {
        status: "invalid_data",
        errors: validatedData.error.errors.map(error => ({
          message: error.message
        }))
      };
    }

    // 检查用户是否已存在
    const existingUser = await sql`
      SELECT email FROM "User" 
      WHERE email = ${validatedData.data.email}
    `;

    if (existingUser.length > 0) {
      return {
        status: "user_exists"
      };
    }

    // 对密码进行哈希处理
    const hashedPassword = hashSync(validatedData.data.password, 10);

    try {
      // 创建新用户，传入 profileImage
      await createUser({
        firstName: validatedData.data.firstName,
        lastName: validatedData.data.lastName,
        email: validatedData.data.email,
        password: hashedPassword,
        agreedToTerms: validatedData.data.agreedToTerms,
        profileImage: rawFormData.profileImage || undefined
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return {
        status: "failed",
        errors: [{
          message: "Database error occurred while creating account"
        }]
      };
    }

    // 缓存用户数据到 Redis
    await redis.set(`user:${validatedData.data.email}`, {
      firstName: validatedData.data.firstName,
      lastName: validatedData.data.lastName,
      email: validatedData.data.email
    }, {
      ex: 3600 // 1小时过期
    });

    return {
      status: "success"
    };

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
