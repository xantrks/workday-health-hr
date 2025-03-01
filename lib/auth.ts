import bcrypt from "bcryptjs";
import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getUser } from "@/db/queries";

// 扩展DbUser类型以包含role属性
interface DbUser {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: string;
  agreed_to_terms: boolean;
  created_at: Date;
  updated_at: Date;
}

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<string, unknown>) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const [user] = await getUser(credentials.email as string);

          if (!user) {
            return null;
          }

          const passwordValid = await bcrypt.compare(
            credentials.password as string, 
            user.password as string
          );

          if (!passwordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            role: (user as any).role || "employee"
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
}; 