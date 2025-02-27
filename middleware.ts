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

  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  }) as Token | null;

  // 从URL中提取用户ID
  const urlParts = request.nextUrl.pathname.split('/');
  const urlUserId = urlParts[2]; // 获取URL中的用户ID

  if (request.nextUrl.pathname.startsWith('/hr-dashboard/')) {
    if (!token?.role || token.role.toLowerCase() !== 'hr') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // 验证URL中的用户ID是否匹配当前登录用户
    if (token.id !== urlUserId) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/employee-dashboard/')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // 验证URL中的用户ID是否匹配当前登录用户
    if (token.id !== urlUserId) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/hr-dashboard/:userId*', 
    '/employee-dashboard/:userId*', 
    '/login'
  ]
};
