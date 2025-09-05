import { NextResponse } from "next/server";

import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";

// POST - Register for an event
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const eventId = params.id;
    const userId = session.user.id;
    
    // Check if event exists and is not full
    const selectedEvent = db.events.findUnique(eventId);
    
    if (!selectedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    
    // Check if registration is still open (event hasn't started)
    const now = new Date();
    if (new Date(selectedEvent.startDate) < now) {
      return NextResponse.json({ error: "Event has already started or ended" }, { status: 400 });
    }
    
    // Check if max attendees limit has been reached
    if (selectedEvent.maxAttendees) {
      const registrations = db.eventRegistrations.findMany().filter(r => r.eventId === eventId);
      
      if (registrations.length >= selectedEvent.maxAttendees) {
        return NextResponse.json({ error: "Event has reached maximum attendees" }, { status: 400 });
      }
    }
    
    // Check if user is already registered
    const existingRegistration = db.eventRegistrations.findMany().find(r => r.eventId === eventId && r.userId === userId);
    
    if (existingRegistration) {
      return NextResponse.json({ error: "You are already registered for this event" }, { status: 400 });
    }
    
    // Create registration
    const registration = db.eventRegistrations.create({
      eventId,
      userId,
      registeredAt: now,
      attended: false,
    });
    
    return NextResponse.json({ 
      message: "Registration successful", 
      registration 
    });
  } catch (error) {
    console.error("Failed to register for event:", error);
    return NextResponse.json(
      { error: "Failed to register for event" },
      { status: 500 },
    );
  }
}

// DELETE - Cancel registration for an event
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const eventId = params.id;
    const userId = session.user.id;
    
    // Check if user is registered
    const registration = db.eventRegistrations.findMany().find(r => r.eventId === eventId && r.userId === userId);

    if (!registration) {
      return NextResponse.json({ error: "You are not registered for this event" }, { status: 404 });
    }

    db.eventRegistrations.delete(registration.id);
    
    return NextResponse.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    console.error("Failed to cancel registration:", error);
    return NextResponse.json(
      { error: "Failed to cancel registration" },
      { status: 500 },
    );
  }
} 