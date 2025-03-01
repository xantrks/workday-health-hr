import { parseISO, format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/app/(auth)/auth";
import { getPeriodRecordsByUserId, createHealthRecord, updateHealthRecord } from "@/db/queries";

// 辅助函数：解析日期字符串，保留原始日期而不受时区影响
function parseDate(dateString: string): Date {
  // 确保日期格式为 YYYY-MM-DD
  const normalizedDateString = dateString.includes('T') 
    ? dateString.split('T')[0] 
    : dateString;
  
  // 使用parseISO解析日期，然后创建一个新的日期对象，保留年月日
  const parsed = parseISO(normalizedDateString);
  const year = parsed.getFullYear();
  const month = parsed.getMonth();
  const day = parsed.getDate();
  
  // 创建一个UTC日期，避免时区转换
  const utcDate = new Date(Date.UTC(year, month, day));
  
  console.log(`解析日期: ${dateString} -> ${format(utcDate, 'yyyy-MM-dd')}`);
  return utcDate;
}

// 辅助函数：格式化日期为YYYY-MM-DD字符串
function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    // 如果已经是字符串，确保格式正确
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
    }
    // 否则解析并格式化
    return format(parseDate(date), 'yyyy-MM-dd');
  }
  
  // 如果是Date对象，直接格式化
  return format(date, 'yyyy-MM-dd');
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    console.log("GET /api/health-records/period - userId:", userId);
    
    const url = new URL(req.url);
    const startDateParam = url.searchParams.get("startDate");
    const endDateParam = url.searchParams.get("endDate");
    
    let startDate, endDate;
    
    if (startDateParam) {
      startDate = parseDate(startDateParam);
    }
    
    if (endDateParam) {
      endDate = parseDate(endDateParam);
      // 设置为当天的结束时间
      endDate.setUTCHours(23, 59, 59, 999);
    }
    
    const records = await getPeriodRecordsByUserId({ 
      userId, 
      startDate, 
      endDate 
    });
    
    console.log("GET /api/health-records/period - records:", records);
    
    // 确保返回的记录格式正确
    const formattedRecords = records.map(record => {
      return {
        id: record.id,
        date: formatDate(record.date),
        periodFlow: record.period_flow || 0,
        symptoms: record.symptoms ? 
          (typeof record.symptoms === 'string' ? JSON.parse(record.symptoms) : record.symptoms) 
          : [],
        notes: record.notes
      };
    });
    
    console.log("GET /api/health-records/period - formattedRecords:", formattedRecords);
    
    return NextResponse.json({ data: formattedRecords });
  } catch (error) {
    console.error("Error fetching period records:", error);
    return NextResponse.json({ error: "Failed to fetch period records" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    const body = await req.json();
    
    console.log("POST /api/health-records/period - userId:", userId);
    console.log("POST /api/health-records/period - body:", body);
    
    // 验证请求数据
    if (!body.date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }
    
    // 解析日期，保留用户选择的原始日期
    const recordDate = parseDate(body.date);
    console.log("POST /api/health-records/period - 用户选择的日期:", body.date);
    console.log("POST /api/health-records/period - 解析后的日期:", format(recordDate, 'yyyy-MM-dd'));
    
    // 检查是否已存在同一日期的记录
    const existingRecords = await getPeriodRecordsByUserId({
      userId,
      startDate: recordDate,
      endDate: recordDate
    });
    
    console.log("POST /api/health-records/period - existingRecords:", existingRecords);
    
    let result;
    
    // 如果已存在记录，则更新记录
    if (existingRecords.length > 0) {
      // 如果提供了 ID，则更新指定 ID 的记录
      if (body.id) {
        console.log("POST /api/health-records/period - Updating existing record with id:", body.id);
        
        await updateHealthRecord({
          id: body.id,
          periodFlow: body.periodFlow,
          symptoms: body.symptoms,
          notes: body.notes
        });
        
        // 获取更新后的记录
        const updatedRecords = await getPeriodRecordsByUserId({
          userId,
          startDate: recordDate,
          endDate: recordDate
        });
        
        result = updatedRecords.find(r => r.id === body.id) || updatedRecords[0];
      } else {
        // 如果没有提供 ID，则更新该日期的第一条有效记录
        const validRecord = existingRecords.find(r => r.period_flow !== null && r.period_flow !== undefined && r.period_flow > 0);
        const recordToUpdate = validRecord || existingRecords[0];
        
        console.log("POST /api/health-records/period - Updating existing record without id:", recordToUpdate.id);
        
        await updateHealthRecord({
          id: recordToUpdate.id,
          periodFlow: body.periodFlow,
          symptoms: body.symptoms,
          notes: body.notes
        });
        
        // 获取更新后的记录
        const updatedRecords = await getPeriodRecordsByUserId({
          userId,
          startDate: recordDate,
          endDate: recordDate
        });
        
        result = updatedRecords.find(r => r.id === recordToUpdate.id) || updatedRecords[0];
      }
    } else {
      // 否则创建新记录
      console.log("POST /api/health-records/period - Creating new record");
      
      result = await createHealthRecord({
        userId,
        date: recordDate,
        recordType: 'period',
        periodFlow: body.periodFlow,
        symptoms: body.symptoms,
        notes: body.notes
      });
    }
    
    console.log("POST /api/health-records/period - result:", result);
    
    // 返回格式化的记录，确保日期格式正确
    const formattedRecord = {
      id: result.id,
      date: formatDate(result.date),
      periodFlow: result.period_flow || 0,
      symptoms: result.symptoms ? 
        (typeof result.symptoms === 'string' ? JSON.parse(result.symptoms) : result.symptoms) 
        : [],
      notes: result.notes
    };
    
    console.log("POST /api/health-records/period - formattedRecord:", formattedRecord);
    
    return NextResponse.json({ success: true, data: formattedRecord }, { status: 201 });
  } catch (error) {
    console.error("Error creating period record:", error);
    return NextResponse.json({ error: "Failed to create period record" }, { status: 500 });
  }
} 