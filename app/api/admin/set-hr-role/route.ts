import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { sql } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Verify admin permissions
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body = await req.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json(
        { message: "User email is required" },
        { status: 400 }
      );
    }
    
    // Find user
    const users = await sql`
      SELECT id, email, role FROM "User" 
      WHERE email = ${email}
    `;
    
    if (!users || users.length === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    
    // Update user role to HR
    await sql`
      UPDATE "User"
      SET role = 'hr'
      WHERE email = ${email}
    `;
    
    // Return success response
    return NextResponse.json({
      message: "User role has been updated to HR",
      user: {
        email,
        role: 'hr'
      }
    });
  } catch (error: any) {
    console.error("Error setting HR role:", error);
    return NextResponse.json(
      { message: "Error processing request", error: error.message },
      { status: 500 }
    );
  }
} 