import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/app/(auth)/auth";
import { getChatsByUserId } from "@/db/queries";

/**
 * API handler for getting chat history
 * Migrated to support IBM Watson X chats
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const chats = await getChatsByUserId({ id: session.user.id });
    
    return NextResponse.json(chats);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
} 