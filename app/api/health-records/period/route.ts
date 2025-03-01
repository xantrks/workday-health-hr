import { parseISO, format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/app/(auth)/auth";
import { getPeriodRecordsByUserId, createHealthRecord, updateHealthRecord } from "@/db/queries";

// Helper function: Parse date string, preserving original date without timezone effects
function parseDate(dateString: string): Date {
  // Ensure date format is YYYY-MM-DD
  const normalizedDateString = dateString.includes('T') 
    ? dateString.split('T')[0] 
    : dateString;
  
  // Use parseISO to parse the date, then create a new date object preserving year, month, day
  const parsed = parseISO(normalizedDateString);
  const year = parsed.getFullYear();
  const month = parsed.getMonth();
  const day = parsed.getDate();
  
  // Create a UTC date to avoid timezone conversion
  const utcDate = new Date(Date.UTC(year, month, day));
  
  console.log(`Parsed date: ${dateString} -> ${format(utcDate, 'yyyy-MM-dd')}`);
  return utcDate;
}

// Helper function: Format date to YYYY-MM-DD string
function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    // If already a string, ensure correct format
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
    }
    // Otherwise parse and format
    return format(parseDate(date), 'yyyy-MM-dd');
  }
  
  // If it's a Date object, just format it
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
      // Set to end of day
      endDate.setUTCHours(23, 59, 59, 999);
    }
    
    const records = await getPeriodRecordsByUserId({ 
      userId, 
      startDate, 
      endDate 
    });
    
    console.log("GET /api/health-records/period - records:", records);
    
    // Ensure returned records are in correct format
    const formattedRecords = records.map(record => {
      return {
        id: record.id,
        date: formatDate(record.date),
        periodFlow: record.period_flow || 0,
        symptoms: record.symptoms ? 
          (typeof record.symptoms === 'string' ? JSON.parse(record.symptoms) : record.symptoms) 
          : [],
        mood: record.mood || "none",
        sleepHours: record.sleep_hours || 0,
        stressLevel: record.stress_level || 0,
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
    
    // Validate request data
    if (!body.date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }
    
    // Parse date, preserving user-selected original date
    const recordDate = parseDate(body.date);
    console.log("POST /api/health-records/period - User selected date:", body.date);
    console.log("POST /api/health-records/period - Parsed date:", format(recordDate, 'yyyy-MM-dd'));
    
    // Check if record already exists for the same date
    const existingRecords = await getPeriodRecordsByUserId({
      userId,
      startDate: recordDate,
      endDate: recordDate
    });
    
    console.log("POST /api/health-records/period - existingRecords:", existingRecords);
    
    let result;
    
    // If record exists, update record
    if (existingRecords.length > 0) {
      // If ID is provided, update specified ID record
      if (body.id) {
        console.log("POST /api/health-records/period - Updating existing record with id:", body.id);
        
        const updatedRecord = await updateHealthRecord({
          id: body.id,
          periodFlow: body.periodFlow,
          symptoms: body.symptoms,
          mood: body.mood,
          sleepHours: body.sleepHours,
          stressLevel: body.stressLevel,
          notes: body.notes
        });
        
        console.log("POST /api/health-records/period - Updated record:", updatedRecord);
        result = updatedRecord;
      } else {
        // If no ID is provided, update the first valid record for that date
        const validRecord = existingRecords.find(r => r.period_flow !== null && r.period_flow !== undefined && r.period_flow > 0);
        const recordToUpdate = validRecord || existingRecords[0];
        
        console.log("POST /api/health-records/period - Updating existing record without id:", recordToUpdate.id);
        
        const updatedRecord = await updateHealthRecord({
          id: recordToUpdate.id,
          periodFlow: body.periodFlow,
          symptoms: body.symptoms,
          mood: body.mood,
          sleepHours: body.sleepHours,
          stressLevel: body.stressLevel,
          notes: body.notes
        });
        
        console.log("POST /api/health-records/period - Updated record:", updatedRecord);
        result = updatedRecord;
      }
    } else {
      // Otherwise create new record
      console.log("POST /api/health-records/period - Creating new record");
      
      result = await createHealthRecord({
        userId,
        date: recordDate,
        recordType: 'period',
        periodFlow: body.periodFlow,
        symptoms: body.symptoms,
        mood: body.mood,
        sleepHours: body.sleepHours,
        stressLevel: body.stressLevel,
        notes: body.notes
      });
    }
    
    console.log("POST /api/health-records/period - result:", result);
    
    // Return formatted record, ensuring date format is correct
    const formattedRecord = {
      id: result.id,
      date: formatDate(result.date),
      periodFlow: result.period_flow || 0,
      symptoms: result.symptoms ? 
        (typeof result.symptoms === 'string' ? JSON.parse(result.symptoms) : result.symptoms) 
        : [],
      mood: result.mood || "none",
      sleepHours: result.sleep_hours || 0,
      stressLevel: result.stress_level || 0,
      notes: result.notes
    };
    
    console.log("POST /api/health-records/period - formattedRecord:", formattedRecord);
    
    return NextResponse.json({ success: true, data: formattedRecord }, { status: 201 });
  } catch (error) {
    console.error("Error creating period record:", error);
    return NextResponse.json({ error: "Failed to create period record" }, { status: 500 });
  }
} 