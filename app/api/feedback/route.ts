import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { createFeedback, getAllFeedback, getFeedbackByCategory } from "@/db/queries";

// Handle GET requests - Get feedback
export async function GET(request: NextRequest) {
  try {
    // Verify the user is an HR admin
    const session = await auth();
    if (!session?.user || session.user.role !== "hr") {
      return NextResponse.json(
        { error: "Unauthorized. Only HR personnel can view feedback." },
        { status: 403 }
      );
    }

    // Check for category query parameter
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let result;
    if (category) {
      result = await getFeedbackByCategory(category);
    } else {
      result = await getAllFeedback();
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to retrieve feedback" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("Error in feedback GET:", error);
    return NextResponse.json(
      { error: "An error occurred while retrieving feedback" },
      { status: 500 }
    );
  }
}

// Handle POST requests - Submit feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, category, anonymous } = body;

    // Validate required fields
    if (!content || !category) {
      return NextResponse.json(
        { error: "Content and category are required" },
        { status: 400 }
      );
    }

    // Get user from session (for non-anonymous feedback)
    let userId;
    if (!anonymous) {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json(
          { error: "User not authenticated" },
          { status: 401 }
        );
      }
      userId = session.user.id;
    }

    // Create feedback in database
    const result = await createFeedback({
      content,
      category,
      anonymous: anonymous === true,
      userId,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to submit feedback" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: "Feedback submitted successfully",
      data: result.data
    }, { status: 201 });
  } catch (error) {
    console.error("Error in feedback POST:", error);
    return NextResponse.json(
      { error: "An error occurred while submitting feedback" },
      { status: 500 }
    );
  }
} 