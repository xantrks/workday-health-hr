import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getToken } from 'next-auth/jwt';

interface Token {
  id: string;
  role?: string;
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  }) as Token | null;

  const path = request.nextUrl.pathname;
  const origin = request.nextUrl.origin;
  
  // Handle root path access logic - redirect to appropriate page
  if (path === '/' || path === '') {
    if (token) {
      // Redirect logged-in users to their dashboard
      const dashboardPath = token.role === 'hr' ? 
        `/hr-dashboard/${token.id}` : 
        `/employee-dashboard/${token.id}`;
      return NextResponse.redirect(new URL(dashboardPath, origin));
    } else {
      // Redirect non-logged-in users to login page
      return NextResponse.redirect(new URL('/login', origin));
    }
  }
  
  // If on login page and already logged in, redirect to appropriate dashboard
  if (path === '/login' && token) {
    const dashboardPath = token.role === 'hr' ? 
      `/hr-dashboard/${token.id}` : 
      `/employee-dashboard/${token.id}`;
    return NextResponse.redirect(new URL(dashboardPath, origin));
  }

  // If accessing dashboard but not logged in, redirect to login page
  if ((path.startsWith('/hr-dashboard') || path.startsWith('/employee-dashboard')) && !token) {
    return NextResponse.redirect(new URL('/login', origin));
  }

  // If accessing HR dashboard but not HR role, redirect to unauthorized page
  if (path.startsWith('/hr-dashboard') && token?.role !== 'hr') {
    return NextResponse.redirect(new URL('/unauthorized', origin));
  }

  // If accessing employee dashboard but is HR role, redirect to unauthorized page
  if (path.startsWith('/employee-dashboard') && token?.role === 'hr') {
    return NextResponse.redirect(new URL('/unauthorized', origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/hr-dashboard/:path*',
    '/employee-dashboard/:path*'
  ]
};
