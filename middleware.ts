import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getToken } from 'next-auth/jwt';

interface Token {
  id: string;
  role?: string;
}

export async function middleware(request: NextRequest) {
  console.log("中间件执行，路径:", request.nextUrl.pathname);
  
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  }) as Token | null;

  if (token) {
    console.log("Token存在:", token.id, "角色:", token.role);
  }

  const path = request.nextUrl.pathname;
  const origin = request.nextUrl.origin;
  
  // Handle root path access logic - redirect to appropriate page
  if (path === '/' || path === '') {
    if (token) {
      // 统一使用小写角色名
      const role = token.role?.toLowerCase();
      console.log("处理根路径重定向，角色:", role);
      
      // Redirect logged-in users to their dashboard
      const dashboardPath = role === 'hr' ? 
        `/hr-dashboard/${token.id}` : 
        `/employee-dashboard/${token.id}`;
        
      console.log("重定向到:", dashboardPath);
      return NextResponse.redirect(new URL(dashboardPath, origin));
    } else {
      // Redirect non-logged-in users to login page
      return NextResponse.redirect(new URL('/login', origin));
    }
  }
  
  // If on login page and already logged in, redirect to appropriate dashboard
  if (path === '/login' && token) {
    // 统一使用小写角色名
    const role = token.role?.toLowerCase();
    console.log("登录页检测到已登录用户，角色:", role);
    
    const dashboardPath = role === 'hr' ? 
      `/hr-dashboard/${token.id}` : 
      `/employee-dashboard/${token.id}`;
      
    console.log("重定向到:", dashboardPath);
    return NextResponse.redirect(new URL(dashboardPath, origin));
  }

  // If accessing dashboard but not logged in, redirect to login page
  if ((path.startsWith('/hr-dashboard') || path.startsWith('/employee-dashboard')) && !token) {
    return NextResponse.redirect(new URL('/login', origin));
  }

  // If accessing HR dashboard but not HR role, redirect to unauthorized page
  if (path.startsWith('/hr-dashboard') && token?.role?.toLowerCase() !== 'hr') {
    return NextResponse.redirect(new URL('/unauthorized', origin));
  }

  // If accessing employee dashboard but is HR role, redirect to unauthorized page
  if (path.startsWith('/employee-dashboard') && token?.role?.toLowerCase() === 'hr') {
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
