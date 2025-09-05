import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { JWT } from "next-auth/jwt";
import type { Session, DefaultSession } from "next-auth";

import { authConfig } from "./auth.config";

// 定义基础用户类型
interface BaseUser {
  id: string;
  email: string;
  name: string;
  role: string;
  profileImageUrl?: string;
  organizationId?: string;
  isSuperAdmin?: boolean;
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
  profileImageUrl?: string;
  organizationId?: string;
  isSuperAdmin?: boolean;
}

// Make sure NEXTAUTH_SECRET is set
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please set NEXTAUTH_SECRET environment variable in .env.local");
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
        const username = credentials?.username as string;
        const password = credentials?.password as string;

        if (!username || !password) return null;

        if (username === 'user1' && password === '12345') {
          return {
            id: '1',
            email: 'user1@workday.com',
            name: 'User One',
            role: 'employee',
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.profileImageUrl = user.profileImageUrl;
        token.organizationId = user.organizationId;
        token.isSuperAdmin = user.isSuperAdmin;
      }
      return token as ExtendedJWT;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.profileImageUrl = token.profileImageUrl as string;
        session.user.organizationId = token.organizationId as string;
        session.user.isSuperAdmin = token.isSuperAdmin as boolean;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
});
