import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NeonQueryFunction } from '@neondatabase/serverless';

import { getUser } from "@/db/queries";
import { sql } from "@/lib/db";

import { authConfig } from "./auth.config";

interface ExtendedJWT extends JWT {
  id: string;
  role: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface ExtendedSession extends Session {
  user: User;
}

// 定义返回给前端的用户类型
interface DefaultUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// 改名为 DbUser 以避免与 next-auth 的 User 冲突
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
      async authorize(credentials) {
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

          return {
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 初始登录时
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // 确保这些字段存在于session.user中
        (session.user as User).id = token.id as string;
        (session.user as User).role = token.role as string;
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
