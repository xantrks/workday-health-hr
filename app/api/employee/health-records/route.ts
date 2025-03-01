import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { sql } from "@/lib/db";

// 获取健康记录
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = token.id as string;
    const url = new URL(req.url);
    const startDateParam = url.searchParams.get("startDate");
    const endDateParam = url.searchParams.get("endDate");
    const recordType = url.searchParams.get("recordType");
    
    let query = `
      SELECT * FROM "HealthRecord" 
      WHERE "userId" = $1
    `;
    
    const queryParams: any[] = [userId];
    let paramIndex = 2;
    
    if (recordType) {
      query += ` AND record_type = $${paramIndex}`;
      queryParams.push(recordType);
      paramIndex++;
    }
    
    if (startDateParam) {
      query += ` AND date >= $${paramIndex}`;
      queryParams.push(new Date(startDateParam));
      paramIndex++;
    }
    
    if (endDateParam) {
      query += ` AND date <= $${paramIndex}`;
      queryParams.push(new Date(endDateParam));
      paramIndex++;
    }
    
    query += ` ORDER BY date DESC`;
    
    const records = await sql.query(query, queryParams);
    
    return NextResponse.json({ data: records.rows });
  } catch (error) {
    console.error("Error fetching health records:", error);
    return NextResponse.json({ error: "Failed to fetch health records" }, { status: 500 });
  }
}

// 创建健康记录
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    
    // 验证请求数据
    if (!body.date || !body.recordType) {
      return NextResponse.json({ error: "Date and record type are required" }, { status: 400 });
    }
    
    const userId = token.id as string;
    
    const result = await sql.query(
      `INSERT INTO "HealthRecord" (
        "userId", date, record_type, period_flow, symptoms, mood, sleep_hours, stress_level, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        userId,
        new Date(body.date),
        body.recordType,
        body.periodFlow || null,
        body.symptoms ? JSON.stringify(body.symptoms) : null,
        body.mood || null,
        body.sleepHours || null,
        body.stressLevel || null,
        body.notes || null
      ]
    );
    
    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating health record:", error);
    return NextResponse.json({ error: "Failed to create health record" }, { status: 500 });
  }
}

// 更新健康记录
export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }
    
    const userId = token.id as string;
    
    // 检查记录是否存在并属于该用户
    const check = await sql.query(
      `SELECT * FROM "HealthRecord" WHERE id = $1 AND "userId" = $2`,
      [body.id, userId]
    );
    
    if (check.rows.length === 0) {
      return NextResponse.json({ error: "Record not found or unauthorized" }, { status: 404 });
    }
    
    // 构建更新语句
    let updateFields = [];
    let params = [body.id, userId]; // id 和 userId 是第一个和第二个参数
    let paramIndex = 3;
    
    if (body.periodFlow !== undefined) {
      updateFields.push(`period_flow = $${paramIndex}`);
      params.push(body.periodFlow);
      paramIndex++;
    }
    
    if (body.symptoms !== undefined) {
      updateFields.push(`symptoms = $${paramIndex}`);
      params.push(JSON.stringify(body.symptoms));
      paramIndex++;
    }
    
    if (body.mood !== undefined) {
      updateFields.push(`mood = $${paramIndex}`);
      params.push(body.mood);
      paramIndex++;
    }
    
    if (body.sleepHours !== undefined) {
      updateFields.push(`sleep_hours = $${paramIndex}`);
      params.push(body.sleepHours);
      paramIndex++;
    }
    
    if (body.stressLevel !== undefined) {
      updateFields.push(`stress_level = $${paramIndex}`);
      params.push(body.stressLevel);
      paramIndex++;
    }
    
    if (body.notes !== undefined) {
      updateFields.push(`notes = $${paramIndex}`);
      params.push(body.notes);
      paramIndex++;
    }
    
    updateFields.push(`updated_at = $${paramIndex}`);
    params.push(new Date());
    
    const result = await sql.query(
      `UPDATE "HealthRecord" SET ${updateFields.join(", ")} 
       WHERE id = $1 AND "userId" = $2 RETURNING *`,
      params
    );
    
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error updating health record:", error);
    return NextResponse.json({ error: "Failed to update health record" }, { status: 500 });
  }
}

// 删除健康记录
export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }
    
    const userId = token.id as string;
    
    // 检查记录是否存在并属于该用户
    const check = await sql.query(
      `SELECT * FROM "HealthRecord" WHERE id = $1 AND "userId" = $2`,
      [id, userId]
    );
    
    if (check.rows.length === 0) {
      return NextResponse.json({ error: "Record not found or unauthorized" }, { status: 404 });
    }
    
    await sql.query(
      `DELETE FROM "HealthRecord" WHERE id = $1 AND "userId" = $2`,
      [id, userId]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting health record:", error);
    return NextResponse.json({ error: "Failed to delete health record" }, { status: 500 });
  }
} 