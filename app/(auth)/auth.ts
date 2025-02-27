import { compare } from "bcrypt-ts";
import NextAuth, { User, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getUser } from "@/db/queries";
import { sql } from "@/lib/db";

import { authConfig } from "./auth.config";

interface ExtendedSession extends Session {
  user: User;
}

interface User {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
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
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const result = await sql<User[]>`
            SELECT * FROM "User"
            WHERE email = ${credentials.email}
          `;

          if (result.length === 0) return null;

          const user = result[0];
          const passwordsMatch = await compare(credentials.password, user.password);
          
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
