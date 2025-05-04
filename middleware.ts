import { getToken } from 'next-auth/jwt';

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface Token {
  id?: string;
  role?: string;
  organizationId?: string;
  isSuperAdmin?: boolean;
}

export async function middleware(request: NextRequest) {
  // Log access path
  console.log("[Middleware] Access path:", request.nextUrl.pathname);
  
  // Create a response object to pass through the request
  const response = NextResponse.next();
  
  // Add the x-pathname header to every response for use in the Navbar component
  response.headers.set("x-pathname", request.nextUrl.pathname);
  
  // Return without redirecting to prevent conflicts with NextAuth
  return response;
}

// This matcher restricts middleware to only run on necessary paths
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
