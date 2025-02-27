import { auth } from "@/app/(auth)/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  // 获取当前用户会话
  const session = await auth();
  
  // 检查是否访问受保护的路由
  if (request.nextUrl.pathname.startsWith('/hr-dashboard')) {
    if (!session?.user || session.user.role !== 'hr') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/employee-dashboard')) {
    if (!session?.user) {
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
