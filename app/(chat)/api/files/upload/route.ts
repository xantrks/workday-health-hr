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
      message: "文件大小应小于20MB",
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
        message: "文件类型应为JPEG、PNG、PDF、Word文档(DOC/DOCX)、PPT、Excel或视频文件",
      },
    ),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  if (request.body === null) {
    return new Response("请求正文为空", { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string || file.name;
    const description = formData.get("description") as string || "";
    const category = formData.get("category") as string || "未分类";
    const tagsInput = formData.get("tags") as string || "";
    
    if (!file) {
      return NextResponse.json({ error: "未上传文件" }, { status: 400 });
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
      // 上传到Vercel Blob
      const data = await put(filename, fileBuffer, {
        access: "public",
      });

      // 处理标签：将逗号分隔的字符串转换为数组
      let tags = [];
      if (tagsInput && tagsInput !== '[]') {
        // 尝试解析为JSON，如果失败则按逗号分隔
        try {
          tags = JSON.parse(tagsInput);
        } catch (e) {
          // 不是有效的JSON，按逗号分隔处理
          tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
      }

      try {
        // 直接在此API中保存资源记录，避免跨API调用
        const newResource = await db.insert(resourceFile).values({
          title,
          description: description || null,
          fileUrl: data.url,
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
          throw new Error("资源创建失败");
        }

        return NextResponse.json({
          ...data,
          resource: newResource[0],
        });
      } catch (error) {
        console.error("资源保存失败:", error);
        return NextResponse.json(
          { error: "无法保存资源文件记录" },
          { status: 500 },
        );
      }
    } catch (error) {
      console.error("上传失败:", error);
      return NextResponse.json({ error: "上传失败" }, { status: 500 });
    }
  } catch (error) {
    console.error("处理请求失败:", error);
    return NextResponse.json(
      { error: "处理请求失败" },
      { status: 500 },
    );
  }
}
