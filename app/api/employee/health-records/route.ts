import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { sql } from "@/lib/db";

// Get health records
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
    
    // Use dynamically built SQL query
    let sqlQuery = sql`SELECT * FROM "HealthRecord" WHERE "userId" = ${userId}`;
    
    if (recordType) {
      sqlQuery = sql`${sqlQuery} AND record_type = ${recordType}`;
    }
    
    if (startDateParam) {
      sqlQuery = sql`${sqlQuery} AND date >= ${new Date(startDateParam)}`;
    }
    
    if (endDateParam) {
      sqlQuery = sql`${sqlQuery} AND date <= ${new Date(endDateParam)}`;
    }
    
    sqlQuery = sql`${sqlQuery} ORDER BY date DESC`;
    
    const records = await sqlQuery;
    
    return NextResponse.json({ data: records });
  } catch (error) {
    console.error("Error fetching health records:", error);
    return NextResponse.json({ error: "Failed to fetch health records" }, { status: 500 });
  }
}

// Create health record
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    
    // Validate request data
    if (!body.date || !body.recordType) {
      return NextResponse.json({ error: "Date and record type are required" }, { status: 400 });
    }
    
    const userId = token.id as string;
    
    const result = await sql`
      INSERT INTO "HealthRecord" (
        "userId", date, record_type, period_flow, symptoms, mood, sleep_hours, stress_level, notes
      ) VALUES (
        ${userId},
        ${new Date(body.date)},
        ${body.recordType},
        ${body.periodFlow || null},
        ${body.symptoms ? JSON.stringify(body.symptoms) : null},
        ${body.mood || null},
        ${body.sleepHours || null},
        ${body.stressLevel || null},
        ${body.notes || null}
      ) RETURNING *
    `;
    
    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating health record:", error);
    return NextResponse.json({ error: "Failed to create health record" }, { status: 500 });
  }
}

// Update health record
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
    
    // Check if record exists and belongs to the user
    const check = await sql`
      SELECT * FROM "HealthRecord" WHERE id = ${body.id} AND "userId" = ${userId}
    `;
    
    if (check.length === 0) {
      return NextResponse.json({ error: "Record not found or unauthorized" }, { status: 404 });
    }
    
    // Use separate update statement
    let result;
    
    // Build update statement based on provided fields
    if (body.periodFlow !== undefined && body.symptoms !== undefined && body.mood !== undefined && 
        body.sleepHours !== undefined && body.stressLevel !== undefined && body.notes !== undefined) {
      // All fields are provided
      result = await sql`
        UPDATE "HealthRecord" SET 
          period_flow = ${body.periodFlow},
          symptoms = ${JSON.stringify(body.symptoms)},
          mood = ${body.mood},
          sleep_hours = ${body.sleepHours},
          stress_level = ${body.stressLevel},
          notes = ${body.notes},
          updated_at = ${new Date()}
        WHERE id = ${body.id} AND "userId" = ${userId}
        RETURNING *
      `;
    } else {
      // Only update provided fields
      let updateQuery = sql`UPDATE "HealthRecord" SET `;
      let isFirst = true;
      
      if (body.periodFlow !== undefined) {
        updateQuery = isFirst 
          ? sql`${updateQuery} period_flow = ${body.periodFlow}`
          : sql`${updateQuery}, period_flow = ${body.periodFlow}`;
        isFirst = false;
      }
      
      if (body.symptoms !== undefined) {
        updateQuery = isFirst 
          ? sql`${updateQuery} symptoms = ${JSON.stringify(body.symptoms)}`
          : sql`${updateQuery}, symptoms = ${JSON.stringify(body.symptoms)}`;
        isFirst = false;
      }
      
      if (body.mood !== undefined) {
        updateQuery = isFirst 
          ? sql`${updateQuery} mood = ${body.mood}`
          : sql`${updateQuery}, mood = ${body.mood}`;
        isFirst = false;
      }
      
      if (body.sleepHours !== undefined) {
        updateQuery = isFirst 
          ? sql`${updateQuery} sleep_hours = ${body.sleepHours}`
          : sql`${updateQuery}, sleep_hours = ${body.sleepHours}`;
        isFirst = false;
      }
      
      if (body.stressLevel !== undefined) {
        updateQuery = isFirst 
          ? sql`${updateQuery} stress_level = ${body.stressLevel}`
          : sql`${updateQuery}, stress_level = ${body.stressLevel}`;
        isFirst = false;
      }
      
      if (body.notes !== undefined) {
        updateQuery = isFirst 
          ? sql`${updateQuery} notes = ${body.notes}`
          : sql`${updateQuery}, notes = ${body.notes}`;
        isFirst = false;
      }
      
      // Add update timestamp
      updateQuery = isFirst 
        ? sql`${updateQuery} updated_at = ${new Date()}`
        : sql`${updateQuery}, updated_at = ${new Date()}`;
      
      // Add WHERE condition and RETURNING
      updateQuery = sql`${updateQuery} WHERE id = ${body.id} AND "userId" = ${userId} RETURNING *`;
      
      result = await updateQuery;
    }
    
    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error updating health record:", error);
    return NextResponse.json({ error: "Failed to update health record" }, { status: 500 });
  }
}

// Delete health record
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
    
    // Check if record exists and belongs to the user
    const check = await sql`
      SELECT * FROM "HealthRecord" WHERE id = ${id} AND "userId" = ${userId}
    `;
    
    if (check.length === 0) {
      return NextResponse.json({ error: "Record not found or unauthorized" }, { status: 404 });
    }
    
    await sql`
      DELETE FROM "HealthRecord" WHERE id = ${id} AND "userId" = ${userId}
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting health record:", error);
    return NextResponse.json({ error: "Failed to delete health record" }, { status: 500 });
  }
} 