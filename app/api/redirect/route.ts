import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  // 获取请求参数
  const searchParams = request.nextUrl.searchParams;
  const to = searchParams.get('to') || '/dashboard';
  
  try {
    // 获取认证令牌
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    console.log("API路由重定向 - 令牌:", token ? "存在" : "不存在");
    
    if (token) {
      // 如果URL中包含:userId占位符，则替换为实际用户ID
      let redirectUrl = to;
      if (redirectUrl.includes(':userId') && token.id) {
        redirectUrl = redirectUrl.replace(':userId', token.id as string);
      }
      
      console.log("执行服务器端重定向到:", redirectUrl);
      
      // 返回重定向响应
      return NextResponse.redirect(new URL(redirectUrl, request.nextUrl.origin));
    } else {
      // 如果未认证，重定向到登录页
      console.log("用户未认证，重定向到登录页");
      return NextResponse.redirect(new URL('/login', request.nextUrl.origin));
    }
  } catch (error) {
    console.error("重定向API错误:", error);
    // 出错时返回到登录页
    return NextResponse.redirect(new URL('/login', request.nextUrl.origin));
  }
}

export async function POST(request: NextRequest) {
  // POST请求也使用相同的逻辑
  return GET(request);
} 