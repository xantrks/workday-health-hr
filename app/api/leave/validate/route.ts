import { NextRequest, NextResponse } from "next/server";

import { validateLeaveRequest } from "@/ai/actions";
import { auth } from "@/app/(auth)/auth";

// Validate leave request with AI assistance
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

    const validation = await validateLeaveRequest({
      startDate,
      endDate,
      leaveType,
      reason
    });

    return NextResponse.json(validation);
  } catch (error) {
    console.error("Failed to validate leave request:", error);
    return new NextResponse("An error occurred while validating leave request", { status: 500 });
  }
}