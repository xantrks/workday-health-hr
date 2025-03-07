import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { resourceFile } from "@/db/schema";

// POST - 增加资源查看次数
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 需要登录才能记录查看
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const resourceId = params.id;
  
  if (!resourceId) {
    return NextResponse.json({ error: "缺少资源ID" }, { status: 400 });
  }
  
  try {
    // 获取当前资源
    const resource = await db
      .select()
      .from(resourceFile)
      .where(eq(resourceFile.id, resourceId))
      .limit(1);
    
    if (resource.length === 0) {
      return NextResponse.json({ error: "资源不存在" }, { status: 404 });
    }
    
    // 更新查看次数
    const updatedResource = await db
      .update(resourceFile)
      .set({ 
        viewCount: resource[0].viewCount + 1 
      })
      .where(eq(resourceFile.id, resourceId))
      .returning();
    
    return NextResponse.json({ 
      success: true, 
      viewCount: updatedResource[0].viewCount 
    });
  } catch (error) {
    console.error("更新资源查看次数失败:", error);
    return NextResponse.json(
      { error: "更新资源查看次数失败" },
      { status: 500 },
    );
  }
} 