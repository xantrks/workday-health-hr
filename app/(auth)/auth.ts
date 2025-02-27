import { compare } from "bcrypt-ts";
import NextAuth, { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NeonQueryFunction } from '@neondatabase/serverless';

import { getUser } from "@/db/queries";
import { sql } from "@/lib/db";

import { authConfig } from "./auth.config";

interface ExtendedSession extends Session {
  user: DefaultUser;
}

// 添加凭证类型定义
interface Credential {
  email: string;
  password: string;
}

// 改名为 DbUser 以避免与 next-auth 的 User 冲突
interface DbUser {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

// 定义返回给前端的用户类型
interface DefaultUser {
  id: string;
  email: string;
  name: string;
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
      async authorize(credentials: Credential | undefined) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // 使用模板字符串方式，并正确处理类型
          const result = await sql`
            SELECT id, email, password, first_name, last_name 
            FROM "User" 
            WHERE email = ${credentials.email}
          ` as unknown as DbUser[];

          if (!result || result.length === 0) return null;

          const user = result[0];
          // 确保密码是字符串类型
          const passwordsMatch = await compare(
            credentials.password.toString(),
            user.password.toString()
          );
          
          if (!passwordsMatch) return null;

          return {
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
