import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";

// Resource file validation schema
const ResourceFileSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  description: z.string().optional(),
  fileUrl: z.string().url("Invalid file URL format"),
  fileType: z.string().min(1, "File type cannot be empty"),
  category: z.string().min(1, "Category cannot be empty"),
  tags: z.array(z.string()).optional(),
  createdById: z.string().uuid("Invalid creator ID"),
});

// GET - Retrieve all resource files or filter by criteria
export async function GET(request: Request) {
  const session = await auth();
  const url = new URL(request.url);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    // Get filter criteria from query parameters
    const category = url.searchParams.get("category");
    const fileType = url.searchParams.get("fileType");
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : undefined;
    
    let resources = db.healthRecords.findMany();

    if (category) {
      resources = resources.filter(r => r.category === category);
    }

    if (fileType) {
      resources = resources.filter(r => r.fileType === fileType);
    }

    resources = resources.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (limit && limit > 0) {
      resources = resources.slice(0, limit);
    }
    
    return NextResponse.json(resources);
  } catch (error) {
    console.error("Failed to fetch resource files:", error);
    return NextResponse.json(
      { error: "Failed to fetch resource files" },
      { status: 500 },
    );
  }
}

// POST - Create new resource file record
export async function POST(request: Request) {
  const session = await auth();
  
  // Only HR role or admin can upload resources
  if (!session || (session.user.role !== "hr" && session.user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized, only HR or admin can upload resources" }, { status: 403 });
  }
  
  try {
    const body = await request.json();
    
    const validatedData = ResourceFileSchema.safeParse(body);
    
    if (!validatedData.success) {
      const errorMessage = validatedData.error.errors
        .map((error) => error.message)
        .join(", ");
        
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    
    const newResource = db.healthRecords.create(validatedData.data);
    
    return NextResponse.json(newResource);
  } catch (error) {
    console.error("Failed to create resource file:", error);
    return NextResponse.json(
      { error: "Failed to create resource file" },
      { status: 500 },
    );
  }
}

// DELETE - Delete resource file
export async function DELETE(request: Request) {
  const session = await auth();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  
  // Only HR role or admin can delete resources
  if (!session || (session.user.role !== "hr" && session.user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized, only HR or admin can delete resources" }, { status: 403 });
  }
  
  if (!id) {
    return NextResponse.json({ error: "Missing resource ID" }, { status: 400 });
  }
  
  try {
    db.healthRecords.delete(id);
    
    return NextResponse.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Failed to delete resource file:", error);
    return NextResponse.json(
      { error: "Failed to delete resource file" },
      { status: 500 },
    );
  }
} 