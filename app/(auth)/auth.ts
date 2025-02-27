import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import type { Session, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { sql } from "@/lib/db";
import { authConfig } from "./auth.config";

// 定义基础用户类型
interface BaseUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// 声明模块扩展来扩展默认的 Session 类型
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: BaseUser & DefaultSession["user"]
  }

  interface User extends BaseUser {}
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
      async authorize(credentials): Promise<BaseUser | null> {
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

          // 返回用户对象
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
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token as ExtendedJWT;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
});
