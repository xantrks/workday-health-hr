import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/app/(auth)/auth";
import { createHealthRecord, getHealthRecordsByUserId, updateHealthRecord, deleteHealthRecord } from "@/db/queries";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    
    // Validate request data
    if (!body.date || !body.recordType) {
      return NextResponse.json({ error: "Date and record type are required" }, { status: 400 });
    }
    
    const userId = session.user.id;
    
    const result = await createHealthRecord({
      userId,
      date: new Date(body.date),
      recordType: body.recordType,
      periodFlow: body.periodFlow,
      symptoms: body.symptoms,
      mood: body.mood,
      sleepHours: body.sleepHours,
      stressLevel: body.stressLevel,
      notes: body.notes
    });
    
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("Error creating health record:", error);
    return NextResponse.json({ error: "Failed to create health record" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    const url = new URL(req.url);
    const startDateParam = url.searchParams.get("startDate");
    const endDateParam = url.searchParams.get("endDate");
    
    let startDate, endDate;
    
    if (startDateParam) {
      startDate = new Date(startDateParam);
    }
    
    if (endDateParam) {
      endDate = new Date(endDateParam);
    }
    
    const records = await getHealthRecordsByUserId({ 
      userId, 
      startDate, 
      endDate 
    });
    
    return NextResponse.json({ data: records });
  } catch (error) {
    console.error("Error fetching health records:", error);
    return NextResponse.json({ error: "Failed to fetch health records" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }
    
    const result = await updateHealthRecord({
      id: body.id,
      periodFlow: body.periodFlow,
      symptoms: body.symptoms,
      mood: body.mood,
      sleepHours: body.sleepHours,
      stressLevel: body.stressLevel,
      notes: body.notes
    });
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating health record:", error);
    return NextResponse.json({ error: "Failed to update health record" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }
    
    await deleteHealthRecord(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting health record:", error);
    return NextResponse.json({ error: "Failed to delete health record" }, { status: 500 });
  }
} 