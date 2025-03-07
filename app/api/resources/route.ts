import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";

import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { resourceFile } from "@/db/schema";

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

// Verify if file exists
async function fileExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Failed to check file existence:', error);
    return false;
  }
}

// GET - Retrieve all resource files or filter by criteria
export async function GET(request: Request) {
  const session = await auth();
  const url = new URL(request.url);
  
  // Check if user has HR role or admin, only HR and admin can see all resources
  const isAuthorized = session?.user?.role === "hr" || session?.user?.role === "admin";
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    // Get filter criteria from query parameters
    const category = url.searchParams.get("category");
    const fileType = url.searchParams.get("fileType");
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : undefined;
    
    // Build query conditions
    let whereClause = {};
    
    if (category) {
      whereClause = { ...whereClause, category };
    }
    
    if (fileType) {
      whereClause = { ...whereClause, fileType };
    }
    
    // Execute query
    let resources = await db.select().from(resourceFile).orderBy(resourceFile.createdAt);
    
    // Apply limit
    if (limit && limit > 0) {
      resources = resources.slice(0, limit);
    }
    
    // Verify file existence
    const validatedResources = await Promise.all(
      resources.map(async (resource) => {
        const exists = await fileExists(resource.fileUrl);
        return { ...resource, fileExists: exists };
      })
    );
    
    // Return only existing files
    const existingResources = validatedResources.filter(r => r.fileExists);
    
    // Remove fileExists field from results
    const cleanedResources = existingResources.map(({ fileExists, ...rest }) => rest);
    
    return NextResponse.json(cleanedResources);
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
    
    const { title, description, fileUrl, fileType, category, tags, createdById } = validatedData.data;
    
    // Insert into database
    const newResource = await db.insert(resourceFile).values({
      title,
      description: description || null,
      fileUrl,
      fileType,
      category,
      tags: tags || [],
      createdById,
    }).returning();
    
    return NextResponse.json(newResource[0]);
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
    // Delete resource
    const deleted = await db.delete(resourceFile)
      .where(eq(resourceFile.id, id))
      .returning();
    
    if (deleted.length === 0) {
      return NextResponse.json({ error: "Resource does not exist" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Failed to delete resource file:", error);
    return NextResponse.json(
      { error: "Failed to delete resource file" },
      { status: 500 },
    );
  }
} 