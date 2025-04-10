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
  
  const path = request.nextUrl.pathname;
  const origin = request.nextUrl.origin;
  
  // Handle root path access - always redirect to login page
  if (path === '/' || path === '') {
    console.log("[Middleware] Root path access, redirecting to login page");
    return NextResponse.redirect(new URL('/login', origin));
  }
  
  // Get token to check authentication and roles with explicit secret
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  }) as Token;
  
  // Handle role-specific access control
  if (token) {
    // Super Admin paths
    if (path.startsWith('/super-admin') && !token.isSuperAdmin) {
      console.log("[Middleware] Unauthorized super admin access, redirecting to unauthorized page");
      return NextResponse.redirect(new URL('/unauthorized', origin));
    }
    
    // Organization Admin paths
    if (path.startsWith('/admin-dashboard') && token.role !== 'orgadmin' && !token.isSuperAdmin) {
      console.log("[Middleware] Unauthorized admin access, redirecting to unauthorized page");
      return NextResponse.redirect(new URL('/unauthorized', origin));
    }
    
    // Manager paths
    if (path.startsWith('/manager-dashboard') && token.role !== 'manager' && !token.isSuperAdmin) {
      console.log("[Middleware] Unauthorized manager access, redirecting to unauthorized page");
      return NextResponse.redirect(new URL('/unauthorized', origin));
    }
    
    // HR paths
    if (path.startsWith('/hr-dashboard') && token.role !== 'hr' && !token.isSuperAdmin) {
      console.log("[Middleware] Unauthorized HR access, redirecting to unauthorized page");
      return NextResponse.redirect(new URL('/unauthorized', origin));
    }
    
    // Employee paths
    if (path.startsWith('/employee-dashboard') && token.role !== 'employee' && !token.isSuperAdmin) {
      console.log("[Middleware] Unauthorized employee access, redirecting to unauthorized page");
      return NextResponse.redirect(new URL('/unauthorized', origin));
    }
    
    // Dashboard redirect for all users (handles My Dashboard button)
    if (path === '/dashboard' && token.id) {
      // Redirect to the appropriate dashboard based on user role
      if (token.isSuperAdmin) {
        return NextResponse.redirect(new URL(`/super-admin/${token.id}`, origin));
      } else if (token.role === 'orgadmin') {
        return NextResponse.redirect(new URL(`/admin-dashboard/${token.id}`, origin));
      } else if (token.role === 'manager') {
        return NextResponse.redirect(new URL(`/manager-dashboard/${token.id}`, origin));
      } else if (token.role === 'hr') {
        return NextResponse.redirect(new URL(`/hr-dashboard/${token.id}`, origin));
      } else {
        // Default to employee dashboard
        return NextResponse.redirect(new URL(`/employee-dashboard/${token.id}`, origin));
      }
    }
    
    // API access control for organization-specific data
    if (path.startsWith('/api') && !token.isSuperAdmin) {
      // Extract organization ID from URL if it exists
      const orgIdMatch = path.match(/\/organizations\/([^\/]+)/);
      const requestedOrgId = orgIdMatch ? orgIdMatch[1] : null;
      
      // If accessing organization-specific data, check if user belongs to that organization
      if (requestedOrgId && requestedOrgId !== token.organizationId) {
        console.log("[Middleware] Cross-organization API access denied");
        return new NextResponse(JSON.stringify({ error: "Access denied" }), {
          status: 403,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }
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
