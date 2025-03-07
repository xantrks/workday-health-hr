import { put } from "@vercel/blob";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/app/(auth)/auth";
import { resourceFile } from "@/db/schema";
import { db } from "@/lib/db";

const FileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 20 * 1024 * 1024, {
      message: "File size should be less than 20MB",
    })
    .refine(
      (file) =>
        [
          "image/jpeg", 
          "image/png", 
          "application/pdf",
          "application/msword", 
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "video/mp4",
          "video/mpeg",
          "text/plain",
          "text/html",
        ].includes(file.type),
      {
        message: "File type should be JPEG, PNG, PDF, Word document (DOC/DOCX), PPT, Excel or video file",
      },
    ),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (request.body === null) {
    return new Response("Request body is empty", { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string || file.name;
    const description = formData.get("description") as string || "";
    const category = formData.get("category") as string || "Uncategorized";
    const tagsInput = formData.get("tags") as string || "";
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(", ");

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    let fileType = "document";
    
    if (file.type.includes("image")) {
      fileType = "image";
    } else if (file.type.includes("video") || file.type.includes("mpeg")) {
      fileType = "video";
    } else if (file.type.includes("pdf")) {
      fileType = "pdf";
    } else if (file.type.includes("word") || file.type.includes("document")) {
      fileType = "word";
    } else if (file.type.includes("presentation") || file.type.includes("powerpoint")) {
      fileType = "presentation";
    } else if (file.type.includes("excel") || file.type.includes("spreadsheet")) {
      fileType = "spreadsheet";
    } else if (file.type.includes("text") || file.type.includes("html")) {
      fileType = "text";
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const fileBuffer = await file.arrayBuffer();

    try {
      // Upload to Vercel Blob
      const blob = await put(filename, fileBuffer, {
        access: "public",
      });

      // Process tags: Convert comma-separated string to array
      let tags = [];
      if (tagsInput && tagsInput !== '[]') {
        // Try to parse as JSON, if fails then process as comma-separated
        try {
          tags = JSON.parse(tagsInput);
        } catch (e) {
          // Not valid JSON, process as comma-separated
          tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
      }

      try {
        // Save resource record directly in this API to avoid cross-API calls
        const newResource = await db.insert(resourceFile).values({
          title,
          description: description || null,
          fileUrl: blob.url,
          fileType,
          category,
          tags,
          createdById: session.user.id,
          viewCount: 0,
          downloadCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();

        if (!newResource || newResource.length === 0) {
          throw new Error("Resource creation failed");
        }

        return NextResponse.json({
          ...blob,
          resource: newResource[0],
        });
      } catch (error) {
        console.error("Resource save failed:", error);
        return NextResponse.json(
          { error: "Could not save resource file record" },
          { status: 500 },
        );
      }
    } catch (error) {
      console.error("Upload failed:", error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Request processing failed:", error);
    return NextResponse.json(
      { error: "Request processing failed" },
      { status: 500 },
    );
  }
}
