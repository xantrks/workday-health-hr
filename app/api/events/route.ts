import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";

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
    
    let events = db.events.findMany();

    if (eventType) {
      events = events.filter(event => event.eventType === eventType);
    }

    if (upcomingOnly) {
      const now = new Date();
      events = events.filter(event => new Date(event.startDate) >= now);
    }

    events = events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

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
    
    const newEvent = db.events.create(validatedData.data);
    
    return NextResponse.json(newEvent);
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
    db.events.delete(id);
    
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Failed to delete event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 },
    );
  }
} 