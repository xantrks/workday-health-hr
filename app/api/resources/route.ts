import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { resourceFile } from "@/db/schema";

// 资源文件验证schema
const ResourceFileSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  description: z.string().optional(),
  fileUrl: z.string().url("文件URL格式无效"),
  fileType: z.string().min(1, "文件类型不能为空"),
  category: z.string().min(1, "分类不能为空"),
  tags: z.array(z.string()).optional(),
  createdById: z.string().uuid("创建者ID无效"),
});

// 验证文件是否存在
async function fileExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('检查文件存在性失败:', error);
    return false;
  }
}

// GET - 获取所有资源文件或按条件筛选
export async function GET(request: Request) {
  const session = await auth();
  const url = new URL(request.url);
  
  // 检查是否是HR角色或管理员，只有HR和管理员可以看到所有资源
  const isAuthorized = session?.user?.role === "hr" || session?.user?.role === "admin";
  
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  
  try {
    // 从查询参数中获取筛选条件
    const category = url.searchParams.get("category");
    const fileType = url.searchParams.get("fileType");
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : undefined;
    
    // 构建查询条件
    let whereClause = {};
    
    if (category) {
      whereClause = { ...whereClause, category };
    }
    
    if (fileType) {
      whereClause = { ...whereClause, fileType };
    }
    
    // 执行查询
    let resources = await db.select().from(resourceFile).orderBy(resourceFile.createdAt);
    
    // 应用限制
    if (limit && limit > 0) {
      resources = resources.slice(0, limit);
    }
    
    // 验证文件是否存在
    const validatedResources = await Promise.all(
      resources.map(async (resource) => {
        const exists = await fileExists(resource.fileUrl);
        return { ...resource, fileExists: exists };
      })
    );
    
    // 只返回存在的文件
    const existingResources = validatedResources.filter(r => r.fileExists);
    
    // 从结果中移除fileExists字段
    const cleanedResources = existingResources.map(({ fileExists, ...rest }) => rest);
    
    return NextResponse.json(cleanedResources);
  } catch (error) {
    console.error("获取资源文件失败:", error);
    return NextResponse.json(
      { error: "获取资源文件失败" },
      { status: 500 },
    );
  }
}

// POST - 创建新的资源文件记录
export async function POST(request: Request) {
  const session = await auth();
  
  // 只有HR角色或管理员可以上传资源
  if (!session || (session.user.role !== "hr" && session.user.role !== "admin")) {
    return NextResponse.json({ error: "未授权，只有HR或管理员可以上传资源" }, { status: 403 });
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
    
    // 插入数据库
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
    console.error("创建资源文件失败:", error);
    return NextResponse.json(
      { error: "创建资源文件失败" },
      { status: 500 },
    );
  }
}

// DELETE - 删除资源文件
export async function DELETE(request: Request) {
  const session = await auth();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  
  // 只有HR角色或管理员可以删除资源
  if (!session || (session.user.role !== "hr" && session.user.role !== "admin")) {
    return NextResponse.json({ error: "未授权，只有HR或管理员可以删除资源" }, { status: 403 });
  }
  
  if (!id) {
    return NextResponse.json({ error: "缺少资源ID" }, { status: 400 });
  }
  
  try {
    // 删除资源
    const deleted = await db.delete(resourceFile).where({ id }).returning();
    
    if (deleted.length === 0) {
      return NextResponse.json({ error: "资源不存在" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "资源已成功删除" });
  } catch (error) {
    console.error("删除资源文件失败:", error);
    return NextResponse.json(
      { error: "删除资源文件失败" },
      { status: 500 },
    );
  }
} 