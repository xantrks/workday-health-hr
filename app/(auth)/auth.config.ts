import { NextAuthConfig } from "next-auth";

export const authConfig = {
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    newUser: "/",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log("Auth config authorized called, path:", nextUrl.pathname);
      console.log("Auth status:", auth?.user ? "logged in" : "not logged in");
      
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/hr-dashboard') || 
                           nextUrl.pathname.startsWith('/employee-dashboard') ||
                           nextUrl.pathname.startsWith('/admin-dashboard') ||
                           nextUrl.pathname.startsWith('/manager-dashboard') ||
                           nextUrl.pathname.startsWith('/super-admin');
      const isOnAuth = nextUrl.pathname.startsWith('/login') || 
                      nextUrl.pathname.startsWith('/register');

      // Allow access to login and registration pages
      if (isOnAuth) return true;

      // Dashboard pages require authentication
      if (isOnDashboard) return isLoggedIn;

      // Default allow access to other pages
      return true;
    },
  },
} satisfies NextAuthConfig;
