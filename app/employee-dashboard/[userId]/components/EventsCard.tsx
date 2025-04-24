import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Event } from "../events/types";

interface EventsCardProps {
  userId: string;
  events: Event[];
}

/**
 * EventsCard component for displaying upcoming events
 * Enhanced for mobile responsiveness
 */
export function EventsCard({ userId, events }: EventsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg">Upcoming Events</CardTitle>
            <CardDescription className="text-xs sm:text-sm mt-1">
              Events you can attend
            </CardDescription>
          </div>
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-2 sm:pb-4">
        {events.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {events.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="flex items-start justify-between gap-2 sm:gap-4 border-b pb-2 sm:pb-3 last:border-0"
              >
                <div className="space-y-0.5 sm:space-y-1">
                  <p className="text-xs sm:text-sm font-medium line-clamp-1">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString()} - {event.location}
                  </p>
                </div>
                <Link
                  href={`/employee-dashboard/${userId}/events?eventId=${event.id}`}
                  className="text-xs sm:text-sm text-primary hover:underline font-medium whitespace-nowrap"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-muted-foreground text-center py-3 sm:py-6">
            No upcoming events
          </p>
        )}
      </CardContent>
      <CardFooter className="px-3 sm:px-6 pt-1 sm:pt-2 pb-3 sm:pb-6">
        <Link href={`/employee-dashboard/${userId}/events`} className="w-full">
          <Button variant="outline" className="w-full text-xs sm:text-sm h-8 sm:h-9">
            View All Events
            <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 