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
  
  // 如果是登录页面，已登录用户重定向到对应仪表盘
  if (path === '/login' && token) {
    const dashboardPath = token.role === 'HR' ? 
      `/hr-dashboard/${token.id}` : 
      `/employee-dashboard/${token.id}`;
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // 如果访问仪表盘但未登录，重定向到登录页
  if ((path.startsWith('/hr-dashboard') || path.startsWith('/employee-dashboard')) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 如果访问HR仪表盘但不是HR角色，重定向到未授权页面
  if (path.startsWith('/hr-dashboard') && token?.role !== 'HR') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // 如果访问员工仪表盘但是HR角色，重定向到未授权页面
  if (path.startsWith('/employee-dashboard') && token?.role === 'HR') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/hr-dashboard/:path*',
    '/employee-dashboard/:path*'
  ]
};
