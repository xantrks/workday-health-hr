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
  
  // Create a response object for adding headers
  const response = NextResponse.next();
  response.headers.set("x-pathname", path);
  
  // Handle root path access - always redirect to login page
  if (path === '/' || path === '') {
    console.log("[Middleware] Root path access, redirecting to login page");
    const redirectResponse = NextResponse.redirect(new URL('/login', origin));
    redirectResponse.headers.set("x-pathname", "/login");
    return redirectResponse;
  }
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || 
                      path === '/register' || 
                      path.startsWith('/login/') || 
                      path.startsWith('/register/') ||
                      path.includes('/_next/') || 
                      path.includes('/api/auth/') ||
                      path.includes('/images/') ||
                      path.includes('/fonts/') ||
                      path === '/favicon.ico' ||
                      path === '/terms' ||
                      path === '/privacy';
  
  // Get token to check authentication and roles with explicit secret
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  }) as Token;
  
  // Redirect unauthenticated users to login page except for public paths
  if (!token && !isPublicPath) {
    console.log("[Middleware] Unauthenticated access to protected path, redirecting to login page");
    const redirectResponse = NextResponse.redirect(new URL('/login', origin));
    redirectResponse.headers.set("x-pathname", "/login");
    return redirectResponse;
  }
  
  // Handle role-specific access control for authenticated users
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
      const redirectUrl = getDashboardPath(token);
      return NextResponse.redirect(new URL(redirectUrl, origin));
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
  
  // Return the response with headers for authenticated paths
  return response;
}

// Helper function to get the dashboard path based on user role
function getDashboardPath(token: Token): string {
  if (!token || !token.id) return "/dashboard";
  
  if (token.isSuperAdmin) {
    return `/super-admin/${token.id}`;
  } else if (token.role === 'orgadmin') {
    return `/admin-dashboard/${token.id}`;
  } else if (token.role === 'manager') {
    return `/manager-dashboard/${token.id}`;
  } else if (token.role === 'hr') {
    return `/hr-dashboard/${token.id}`;
  } else {
    // Default to employee dashboard
    return `/employee-dashboard/${token.id}`;
  }
}

// This matcher allows us to run the middleware on all paths except static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/',
  ],
};
