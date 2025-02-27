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
  
  // 处理根路径访问逻辑 - 重定向到适当的页面
  if (path === '/' || path === '') {
    if (token) {
      // 已登录用户重定向到其仪表盘
      const dashboardPath = token.role === 'hr' ? 
        `/hr-dashboard/${token.id}` : 
        `/employee-dashboard/${token.id}`;
      return NextResponse.redirect(new URL(dashboardPath, origin));
    } else {
      // 未登录用户重定向到登录页
      return NextResponse.redirect(new URL('/login', origin));
    }
  }
  
  // 如果是登录页面，已登录用户重定向到对应仪表盘
  if (path === '/login' && token) {
    const dashboardPath = token.role === 'hr' ? 
      `/hr-dashboard/${token.id}` : 
      `/employee-dashboard/${token.id}`;
    return NextResponse.redirect(new URL(dashboardPath, origin));
  }

  // 如果访问仪表盘但未登录，重定向到登录页
  if ((path.startsWith('/hr-dashboard') || path.startsWith('/employee-dashboard')) && !token) {
    return NextResponse.redirect(new URL('/login', origin));
  }

  // 如果访问HR仪表盘但不是HR角色，重定向到未授权页面
  if (path.startsWith('/hr-dashboard') && token?.role !== 'hr') {
    return NextResponse.redirect(new URL('/unauthorized', origin));
  }

  // 如果访问员工仪表盘但是HR角色，重定向到未授权页面
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
