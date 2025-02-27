import { compare } from "bcryptjs";
import NextAuth, { Session, User as NextAuthUser } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NeonQueryFunction } from '@neondatabase/serverless';

import { getUser } from "@/db/queries";
import { sql } from "@/lib/db";

import { authConfig } from "./auth.config";

// 扩展 NextAuth 的 User 类型
interface User extends NextAuthUser {
  role?: string;
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
          
          console.log("Comparing passwords for user:", email);
          console.log("Stored password hash:", user.password);

          const passwordsMatch = await compare(password, user.password);
          
          console.log("Password match result:", passwordsMatch);

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
      if (user) {
        token.id = user.id;
        token.role = (user as User).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as User).role = token.role as string;
      }
      return session as ExtendedSession;
    },
  },
});
