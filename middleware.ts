import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';

interface Token {
  id: string;
  role?: string;
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
  iat?: number;
  exp?: number;
  jti?: string;
}

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  // 获取 token
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  }) as Token | null;
  
  // 检查是否访问受保护的路由
  if (request.nextUrl.pathname.startsWith('/hr-dashboard')) {
    if (!token?.role || token.role !== 'hr') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/employee-dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/hr-dashboard/:path*', '/employee-dashboard/:path*'],
}
