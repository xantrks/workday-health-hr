import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/app/(auth)/auth";
import { createLeaveRequest, getLeaveRequestById, getLeaveRequestsByEmployeeId, updateLeaveRequestStatus } from "@/db/queries";

// Get current user's leave requests
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // If ID is provided, get specific leave request
    if (id) {
      const leaveRequest = await getLeaveRequestById({ id });
      
      // Check if it's the current user's leave request
      if (leaveRequest.employeeId !== session.user.id) {
        return new NextResponse("No permission to access this leave request", { status: 403 });
      }
      
      return NextResponse.json(leaveRequest);
    } 
    
    // Otherwise get all leave requests for the current user
    const leaveRequests = await getLeaveRequestsByEmployeeId({
      employeeId: session.user.id
    });
    
    return NextResponse.json(leaveRequests);
  } catch (error) {
    console.error("Failed to get leave request:", error);
    return new NextResponse("An error occurred while getting leave request", { status: 500 });
  }
}

// Create new leave request
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { startDate, endDate, leaveType, reason } = await request.json();

    if (!startDate || !endDate || !leaveType || !reason) {
      return new NextResponse("Missing required leave information", { status: 400 });
    }

    try {
      console.log("Creating leave request with data:", {
        employeeId: session.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        leaveType,
        reason,
        organizationId: session.user.organizationId
      });

      // Create the leave request with organization ID if available
      const leaveRequest = await createLeaveRequest({
        employeeId: session.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        leaveType,
        reason,
        organizationId: session.user.organizationId
      });

      if (!leaveRequest || !leaveRequest.id) {
        throw new Error("Failed to create leave request in database - no ID returned");
      }

      console.log("Leave request created successfully:", leaveRequest);
      return NextResponse.json(leaveRequest);
    } catch (dbError) {
      console.error("Database error when creating leave request:", dbError);
      
      // Return a proper error with full details
      return new NextResponse(
        JSON.stringify({ 
          error: "Database error", 
          message: "Failed to save leave request to database",
          details: dbError instanceof Error ? dbError.message : String(dbError),
          stack: dbError instanceof Error ? dbError.stack : undefined
        }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (error) {
    console.error("Failed to create leave request:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Server error",
        message: "An error occurred while creating leave request",
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Update leave request status (HR or admin only)
export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Leave request ID not provided", { status: 400 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Confirm user is HR or admin
  if (session.user.role !== "hr" && session.user.role !== "admin") {
    return new NextResponse("You don't have permission to update leave request status", { status: 403 });
  }

  try {
    const { status, approverNote } = await request.json();

    if (!status) {
      return new NextResponse("Status information missing", { status: 400 });
    }

    const updatedRequest = await updateLeaveRequestStatus({
      id,
      status,
      approverNote,
      approverId: session.user.id,
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Failed to update leave request status:", error);
    return new NextResponse("An error occurred while updating leave request status", { status: 500 });
  }
} 