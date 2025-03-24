import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/app/(auth)/auth";
import { generateLeaveTypeOptions } from "@/ai/actions";

// GET all leave types from the database
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { leaveTypes } = await generateLeaveTypeOptions();
    return NextResponse.json(leaveTypes);
  } catch (error) {
    console.error("Failed to get leave types:", error);
    return new NextResponse("An error occurred while getting leave types", { status: 500 });
  }
} 