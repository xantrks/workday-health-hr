import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getToken } from 'next-auth/jwt';

interface Token {
  id: string;
  role?: string;
}

export async function middleware(request: NextRequest) {
  // 仅记录访问日志，不进行任何重定向
  console.log("[Middleware] 访问路径:", request.nextUrl.pathname);
  
  // 返回继续处理请求
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
};
