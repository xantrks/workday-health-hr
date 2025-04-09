import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getToken } from 'next-auth/jwt';

interface Token {
  id: string;
  role?: string;
}

export async function middleware(request: NextRequest) {
  // Log access path
  console.log("[Middleware] Access path:", request.nextUrl.pathname);
  
  const path = request.nextUrl.pathname;
  const origin = request.nextUrl.origin;
  
  // Handle root path access - always redirect to login page
  if (path === '/' || path === '') {
    console.log("[Middleware] Root path access, redirecting to login page");
    return NextResponse.redirect(new URL('/login', origin));
  }
  
  // No processing for all other paths
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
  ]
};
