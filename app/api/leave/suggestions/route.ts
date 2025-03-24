import { NextRequest, NextResponse } from "next/server";

import { generateLeaveReasonSuggestions } from "@/ai/actions";
import { auth } from "@/app/(auth)/auth";

// GET leave reason suggestions based on leave type
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leaveType = searchParams.get("leaveType");
  
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!leaveType) {
    return new NextResponse("Leave type not provided", { status: 400 });
  }

  try {
    const { suggestions } = await generateLeaveReasonSuggestions({
      leaveType
    });
    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Failed to generate leave reason suggestions:", error);
    return new NextResponse("An error occurred while generating leave reason suggestions", { status: 500 });
  }
}