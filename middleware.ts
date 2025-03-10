import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getToken } from 'next-auth/jwt';

interface Token {
  id: string;
  role?: string;
}

export async function middleware(request: NextRequest) {
  console.log("[Middleware] 访问路径:", request.nextUrl.pathname);
  
  const path = request.nextUrl.pathname;
  
  // 仅为根路径提供重定向逻辑
  if (path === '/' || path === '') {
    console.log("[Middleware] 检测到根路径访问，处理重定向...");
    
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    }) as Token | null;
    
    const origin = request.nextUrl.origin;
    
    if (token) {
      // 已登录用户重定向到仪表盘
      console.log("[Middleware] 用户已登录，重定向到仪表盘");
      
      // 确定用户角色，默认为employee
      const role = (token.role || 'employee').toLowerCase();
      
      // 根据角色选择仪表盘
      const dashboardPath = role === 'hr' ? 
        `/hr-dashboard/${token.id}` : 
        `/employee-dashboard/${token.id}`;
      
      console.log("[Middleware] 重定向到:", dashboardPath);
      return NextResponse.redirect(new URL(dashboardPath, origin));
    } else {
      // 未登录用户重定向到登录页
      console.log("[Middleware] 用户未登录，重定向到登录页");
      return NextResponse.redirect(new URL('/login', origin));
    }
  }
  
  // 对于所有其他路径，不执行任何重定向
  return NextResponse.next();
}

export const config = {
  matcher: [
    // 仅匹配根路径和常见必要路径
    '/',
    '/login',
    '/dashboard',
    '/employee-dashboard/:path*',
    '/hr-dashboard/:path*',
  ]
};
