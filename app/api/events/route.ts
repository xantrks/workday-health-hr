import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, gte, SQL } from "drizzle-orm";

import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { event } from "@/db/schema";

// Event validation schema
const EventSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  description: z.string().optional(),
  eventType: z.string().min(1, "Event type cannot be empty"),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  location: z.string().optional(),
  maxAttendees: z.number().int().positive().optional().nullable(),
  registrationLink: z.string().url("Invalid registration link").optional().or(z.literal('')),
  resourceMaterials: z.array(z.string()).optional(),
  createdById: z.string().uuid("Invalid creator ID"),
});

// GET - Retrieve all events or filter by criteria
export async function GET(request: Request) {
  const session = await auth();
  const url = new URL(request.url);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    // Get filter criteria from query parameters
    const eventType = url.searchParams.get("eventType");
    const upcomingOnly = url.searchParams.get("upcoming") === "true";
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : undefined;
    
    // Build conditions array
    const conditions: SQL[] = [];
    
    // Apply filters to conditions
    if (eventType) {
      conditions.push(eq(event.eventType, eventType));
    }
    
    // Filter for upcoming events only
    if (upcomingOnly) {
      const now = new Date();
      conditions.push(gte(event.startDate, now));
    }
    
    // Execute query with conditions and order by start date
    let events;
    if (conditions.length > 0) {
      events = await db.select().from(event)
        .where(conditions[0])
        .orderBy(event.startDate);
    } else {
      events = await db.select().from(event)
        .orderBy(event.startDate);
    }
    
    // Apply limit
    const limitedEvents = limit && limit > 0 ? events.slice(0, limit) : events;
    
    return NextResponse.json(limitedEvents);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

// POST - Create new event
export async function POST(request: Request) {
  const session = await auth();
  
  // Only HR role or admin can create events
  if (!session || (session.user.role !== "hr" && session.user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized, only HR or admin can create events" }, { status: 403 });
  }
  
  try {
    const body = await request.json();
    
    const validatedData = EventSchema.safeParse(body);
    
    if (!validatedData.success) {
      const errorMessage = validatedData.error.errors
        .map((error) => error.message)
        .join(", ");
        
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    
    const { 
      title, 
      description, 
      eventType, 
      startDate, 
      endDate, 
      location, 
      maxAttendees, 
      registrationLink, 
      resourceMaterials, 
      createdById 
    } = validatedData.data;
    
    // Convert string dates to Date objects if needed
    const parsedStartDate = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const parsedEndDate = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    // Insert into database
    const newEvent = await db.insert(event).values({
      title,
      description: description || null,
      eventType,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      location: location || null,
      maxAttendees: maxAttendees === undefined || maxAttendees === null ? null : maxAttendees,
      registrationLink: registrationLink === undefined || registrationLink === '' ? null : registrationLink,
      resourceMaterials: resourceMaterials || [],
      createdById,
    }).returning();
    
    return NextResponse.json(newEvent[0]);
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}

// DELETE - Delete event
export async function DELETE(request: Request) {
  const session = await auth();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  
  // Only HR role or admin can delete events
  if (!session || (session.user.role !== "hr" && session.user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized, only HR or admin can delete events" }, { status: 403 });
  }
  
  if (!id) {
    return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
  }
  
  try {
    // Delete event
    const deleted = await db.delete(event)
      .where(eq(event.id, id))
      .returning();
    
    if (deleted.length === 0) {
      return NextResponse.json({ error: "Event does not exist" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Failed to delete event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 },
    );
  }
} 