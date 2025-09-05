import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";

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
    const endDateParam = url.search_params.get("endDate");
    const recordType = url.searchParams.get("recordType");
    
    let records = db.healthRecords.findMany().filter(record => record.userId === userId);

    if (recordType) {
      records = records.filter(record => record.recordType === recordType);
    }

    if (startDateParam) {
      records = records.filter(record => new Date(record.date) >= new Date(startDateParam));
    }

    if (endDateParam) {
      records = records.filter(record => new Date(record.date) <= new Date(endDateParam));
    }

    records = records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
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
    
    const newRecord = db.healthRecords.create({
      userId,
      ...body,
    });
    
    return NextResponse.json({ success: true, data: newRecord }, { status: 201 });
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
    
    const record = db.healthRecords.findUnique(body.id);

    if (!record || record.userId !== userId) {
      return NextResponse.json({ error: "Record not found or unauthorized" }, { status: 404 });
    }

    const updatedRecord = db.healthRecords.update(body.id, body);
    
    return NextResponse.json({ success: true, data: updatedRecord });
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
    
    const record = db.healthRecords.findUnique(id);

    if (!record || record.userId !== userId) {
      return NextResponse.json({ error: "Record not found or unauthorized" }, { status: 404 });
    }

    db.healthRecords.delete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting health record:", error);
    return NextResponse.json({ error: "Failed to delete health record" }, { status: 500 });
  }
} 