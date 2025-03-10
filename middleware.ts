import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getToken } from 'next-auth/jwt';

interface Token {
  id: string;
  role?: string;
}

export async function middleware(request: NextRequest) {
  // 记录访问日志
  console.log("[Middleware] 访问路径:", request.nextUrl.pathname);
  
  const path = request.nextUrl.pathname;
  const origin = request.nextUrl.origin;
  
  // 处理根路径访问 - 始终重定向到登录页
  if (path === '/' || path === '') {
    console.log("[Middleware] 根路径访问，重定向到登录页");
    return NextResponse.redirect(new URL('/login', origin));
  }
  
  // 所有其他路径不做处理
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|login|register).*)',
  ]
};
