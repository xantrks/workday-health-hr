import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/app/(auth)/auth";

/**
 * API route handler for redirecting to the appropriate dashboard based on user role
 */
export async function GET(request: NextRequest) {
  console.log("[API] Dashboard redirect request received");
  
  // Get user session
  const session = await auth();
  const user = session?.user;
  
  console.log("[API] User session for redirect:", user ? "Found" : "Not found");
  
  // If no user, redirect to login
  if (!user) {
    console.log("[API] No user found, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }
  
  try {
    // Get user role and ID
    const role = (user.role || "").toLowerCase().trim();
    const userId = user.id;
    
    console.log("[API] User role for redirect:", role);
    console.log("[API] User ID for redirect:", userId);
    
    // Determine dashboard path based on role
    let dashboardPath = "/";
    
    if (user.isSuperAdmin) {
      dashboardPath = `/super-admin/${userId}`;
    } else if (role === "superadmin") {
      dashboardPath = `/super-admin/${userId}`;
    } else if (role === "orgadmin" || role === "admin") {
      dashboardPath = `/admin-dashboard/${userId}`;
    } else if (role === "hr") {
      dashboardPath = `/hr-dashboard/${userId}`;
    } else if (role === "manager") {
      dashboardPath = `/manager-dashboard/${userId}`;
    } else {
      // Default to employee dashboard
      dashboardPath = `/employee-dashboard/${userId}`;
    }
    
    console.log("[API] Redirecting to dashboard:", dashboardPath);
    
    // Redirect to appropriate dashboard
    return NextResponse.redirect(new URL(dashboardPath, request.nextUrl.origin));
  } catch (error) {
    console.error("[API] Dashboard redirect error:", error);
    
    // Fallback to login on error
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }
} 