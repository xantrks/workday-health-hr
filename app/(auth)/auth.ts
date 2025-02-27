import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import type { Session, User as NextAuthUser, DefaultUser } from "next-auth";
import type { AdapterUser } from "@auth/core/adapters";
import Credentials from "next-auth/providers/credentials";
import { NeonQueryFunction } from '@neondatabase/serverless';

import { getUser } from "@/db/queries";
import { sql } from "@/lib/db";

import { authConfig } from "./auth.config";

// 扩展 NextAuth 的基础用户类型
interface CustomUser extends DefaultUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// 扩展 Session 用户类型
interface ExtendedSession extends Session {
  user: CustomUser;
}

// 扩展 JWT 类型
interface ExtendedJWT extends JWT {
  id: string;
  role: string;
}

// 数据库用户类型
interface DbUser {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials): Promise<CustomUser | null> {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        try {
          const result = await sql`
            SELECT id, email, password, first_name, last_name, role 
            FROM "User" 
            WHERE email = ${email}
          `.then(rows => rows as unknown as DbUser[]);

          if (!result || result.length === 0) {
            console.log("User not found:", email);
            return null;
          }

          const user = result[0];
          const passwordsMatch = await compare(password, user.password);

          if (!passwordsMatch) {
            console.log("Password mismatch for user:", email);
            return null;
          }

          // 返回自定义用户对象
          const customUser: CustomUser = {
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            role: user.role,
          };

          return customUser;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // 使用类型断言确保安全访问
        const customUser = user as CustomUser;
        token.id = customUser.id;
        token.role = customUser.role;
      }
      return token as ExtendedJWT;
    },
    async session({ session, token }) {
      if (session.user) {
        const customUser = session.user as CustomUser;
        customUser.id = token.id as string;
        customUser.role = token.role as string;
      }
      return session as ExtendedSession;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
});
