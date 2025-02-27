import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // 验证管理员权限
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      return NextResponse.json(
        { message: "未授权访问" },
        { status: 401 }
      );
    }
    
    // 解析请求体
    const body = await req.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { message: "必须提供用户邮箱" },
        { status: 400 }
      );
    }
    
    // 查找用户
    const users = await sql`
      SELECT id, email, role FROM "User" 
      WHERE email = ${email}
    `;
    
    if (!users || users.length === 0) {
      return NextResponse.json(
        { message: "未找到该用户" },
        { status: 404 }
      );
    }
    
    // 更新用户角色为HR
    await sql`
      UPDATE "User"
      SET role = 'hr'
      WHERE email = ${email}
    `;
    
    // 返回成功响应
    return NextResponse.json({
      message: "用户角色已更新为HR",
      user: {
        email,
        role: 'hr'
      }
    });
  } catch (error: any) {
    console.error("设置HR角色时出错:", error);
    return NextResponse.json(
      { message: "处理请求时出错", error: error.message },
      { status: 500 }
    );
  }
} 