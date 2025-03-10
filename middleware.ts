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
    console.log("中间件Token存在:", token.id, "角色:", token.role);
  } else {
    console.log("中间件Token不存在");
  }

  const path = request.nextUrl.pathname;
  const origin = request.nextUrl.origin;
  
  console.log("当前路径:", path, "来源:", origin);
  
  // 处理根路径访问逻辑 - 重定向到适当的页面
  if (path === '/' || path === '') {
    if (token) {
      // 登录用户直接去通用仪表盘
      return NextResponse.redirect(new URL('/dashboard', origin));
    } else {
      // 未登录用户去登录页
      return NextResponse.redirect(new URL('/login', origin));
    }
  }
  
  // 已登录用户访问登录页，重定向到仪表盘
  if (path === '/login' && token) {
    console.log("登录页检测到已登录用户");
    return NextResponse.redirect(new URL('/dashboard', origin));
  }

  // 未登录用户访问仪表盘，重定向到登录页
  if ((path === '/dashboard' || path.startsWith('/hr-dashboard') || path.startsWith('/employee-dashboard')) && !token) {
    console.log("未授权访问仪表盘，重定向到登录页");
    return NextResponse.redirect(new URL('/login', origin));
  }

  // 允许所有其他请求通过
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard',
    '/hr-dashboard/:path*',
    '/employee-dashboard/:path*'
  ]
};
