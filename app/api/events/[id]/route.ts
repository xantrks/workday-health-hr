import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";

// Event update validation schema
const EventUpdateSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  description: z.string().optional(),
  eventType: z.string().min(1, "Event type cannot be empty").optional(),
  startDate: z.string().or(z.date()).optional(),
  endDate: z.string().or(z.date()).optional(),
  location: z.string().optional(),
  maxAttendees: z.number().int().positive().optional(),
  registrationLink: z.string().url("Invalid registration link").optional(),
  resourceMaterials: z.array(z.string()).optional(),
});

// GET - Retrieve a specific event by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const id = params.id;
    
    const selectedEvent = db.events.findUnique(id);
    
    if (!selectedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    
    return NextResponse.json(selectedEvent);
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 },
    );
  }
}

// PATCH - Update event information
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  
  // Only HR role or admin can update events
  if (!session || (session.user.role !== "hr" && session.user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized, only HR or admin can update events" }, { status: 403 });
  }
  
  try {
    const id = params.id;
    const body = await request.json();
    
    const validatedData = EventUpdateSchema.safeParse(body);
    
    if (!validatedData.success) {
      const errorMessage = validatedData.error.errors
        .map((error) => error.message)
        .join(", ");
        
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    
    const updatedEvent = db.events.update(id, validatedData.data);
    
    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Failed to update event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a specific event
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  
  // Only HR role or admin can delete events
  if (!session || (session.user.role !== "hr" && session.user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized, only HR or admin can delete events" }, { status: 403 });
  }
  
  try {
    const id = params.id;
    
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