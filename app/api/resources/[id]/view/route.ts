import { NextResponse } from "next/server";

import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";

// POST - Increase resource view count
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  // Login required to record views
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing resource ID" }, { status: 400 });
  }

  try {
    // Get current resource
    const existingResource = db.healthRecords.findUnique(id);

    if (!existingResource) {
      return NextResponse.json({ error: "Resource does not exist" }, { status: 404 });
    }

    // Update view count
    const updated = db.healthRecords.update(id, {
      viewCount: existingResource.viewCount + 1,
      updatedAt: new Date(),
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update resource view count:", error);
    return NextResponse.json(
      { error: "Failed to update resource view count" },
      { status: 500 }
    );
  }
} 