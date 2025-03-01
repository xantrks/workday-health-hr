import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/app/(auth)/auth";
import { 
  getHealthRecordById, 
  updateHealthRecord, 
  deleteHealthRecord 
} from "@/db/queries";

// 获取单个经期记录
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const recordId = params.id;
    console.log("GET /api/health-records/period/[id] - recordId:", recordId);
    
    const record = await getHealthRecordById(recordId);
    
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    
    // 验证记录是否属于当前用户
    if (record.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // 格式化日期
    let formattedDate;
    if (typeof record.date === 'string') {
      formattedDate = record.date;
    } else {
      const dateObj = new Date(record.date);
      formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    }
    
    // 格式化记录
    const formattedRecord = {
      id: record.id,
      date: formattedDate,
      periodFlow: record.period_flow || 0,
      symptoms: record.symptoms ? 
        (typeof record.symptoms === 'string' ? JSON.parse(record.symptoms) : record.symptoms) 
        : [],
      notes: record.notes
    };
    
    return NextResponse.json({ data: formattedRecord });
  } catch (error) {
    console.error("Error fetching period record:", error);
    return NextResponse.json({ error: "Failed to fetch period record" }, { status: 500 });
  }
}

// 更新单个经期记录
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const recordId = params.id;
    const body = await req.json();
    
    console.log("PUT /api/health-records/period/[id] - recordId:", recordId);
    console.log("PUT /api/health-records/period/[id] - body:", body);
    
    // 获取记录以验证所有权
    const existingRecord = await getHealthRecordById(recordId);
    
    if (!existingRecord) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    
    // 验证记录是否属于当前用户
    if (existingRecord.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // 更新记录
    await updateHealthRecord({
      id: recordId,
      periodFlow: body.periodFlow,
      symptoms: body.symptoms,
      notes: body.notes
    });
    
    // 获取更新后的记录
    const updatedRecord = await getHealthRecordById(recordId);
    
    // 格式化日期
    let formattedDate;
    if (typeof updatedRecord.date === 'string') {
      formattedDate = updatedRecord.date;
    } else {
      const dateObj = new Date(updatedRecord.date);
      formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    }
    
    // 格式化记录
    const formattedRecord = {
      id: updatedRecord.id,
      date: formattedDate,
      periodFlow: updatedRecord.period_flow || 0,
      symptoms: updatedRecord.symptoms ? 
        (typeof updatedRecord.symptoms === 'string' ? JSON.parse(updatedRecord.symptoms) : updatedRecord.symptoms) 
        : [],
      notes: updatedRecord.notes
    };
    
    return NextResponse.json({ success: true, data: formattedRecord });
  } catch (error) {
    console.error("Error updating period record:", error);
    return NextResponse.json({ error: "Failed to update period record" }, { status: 500 });
  }
}

// 删除单个经期记录
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const recordId = params.id;
    console.log("DELETE /api/health-records/period/[id] - recordId:", recordId);
    
    // 获取记录以验证所有权
    const existingRecord = await getHealthRecordById(recordId);
    
    if (!existingRecord) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    
    // 验证记录是否属于当前用户
    if (existingRecord.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // 删除记录
    await deleteHealthRecord(recordId);
    
    return NextResponse.json({ success: true, message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting period record:", error);
    return NextResponse.json({ error: "Failed to delete period record" }, { status: 500 });
  }
} 