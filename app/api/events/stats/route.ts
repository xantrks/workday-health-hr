import { eq, count } from "drizzle-orm";
import { NextResponse } from "next/server";

import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db";
import { event, eventRegistration } from "@/db/schema";

// GET - Retrieve events with registration counts
export async function GET(request: Request) {
  const session = await auth();
  
  // Only HR role or admin can view event stats
  if (!session || (session.user.role !== "hr" && session.user.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized, only HR or admin can access event statistics" }, { status: 403 });
  }
  
  try {
    // Get all events
    const events = await db.select().from(event).orderBy(event.startDate);
    
    // Get registration counts for each event
    const registrationCounts = await db
      .select({
        eventId: eventRegistration.eventId,
        count: count(eventRegistration.id),
      })
      .from(eventRegistration)
      .groupBy(eventRegistration.eventId);
    
    // Create a map of eventId -> count
    const countsMap = registrationCounts.reduce((acc, item) => {
      acc[item.eventId] = item.count;
      return acc;
    }, {} as Record<string, number>);
    
    // Combine events with their registration counts
    const eventsWithCounts = events.map(evt => ({
      ...evt,
      registrationCount: countsMap[evt.id] || 0,
      maxAttendees: evt.maxAttendees || "Unlimited",
    }));
    
    return NextResponse.json(eventsWithCounts);
  } catch (error) {
    console.error("Failed to fetch event statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch event statistics" },
      { status: 500 },
    );
  }
} 