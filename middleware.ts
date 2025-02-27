import NextAuth from "next-auth";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { authConfig } from "@/app/(auth)/auth.config";

export default NextAuth(authConfig).auth;

export function middleware(request: NextRequest) {
  // 克隆请求头
  const requestHeaders = new Headers(request.headers);
  // 添加当前路径到请求头
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  // 返回带有修改后请求头的响应
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/", "/:id", "/api/:path*", "/login", "/register"],
};
