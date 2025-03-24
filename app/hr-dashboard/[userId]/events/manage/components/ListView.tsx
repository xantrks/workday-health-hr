'use client';

import { CalendarIcon, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { Event } from '../types';
import { filterEvents } from '../utils';
import EventCard from './EventCard';

interface ListViewProps {
  events: Event[];
  loading: boolean;
  error: string | null;
  filter: string;
  userId: string;
  onCreateEvent: () => void;
  onRetry: () => void;
  onViewDetails: (event: Event) => void;
  onDeleteClick: (event: Event) => void;
}

export default function ListView({
  events,
  loading,
  error,
  filter,
  userId,
  onCreateEvent,
  onRetry,
  onViewDetails,
  onDeleteClick,
}: ListViewProps) {
  const router = useRouter();
  const filteredEvents = filterEvents(events, filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse space-y-4 w-full max-w-2xl">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-muted/20 dark:bg-muted/10 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive/80" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Error Loading Events</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{error}</p>
        </div>
        <Button onClick={onRetry} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
        <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">No Events Found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {filter === 'all'
              ? "There are no events scheduled. Create a new event to get started."
              : "There are no events matching the selected filter."}
          </p>
        </div>
        <Button onClick={onCreateEvent} className="mt-4">
          Create New Event
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {filteredEvents.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onViewDetails={() => onViewDetails(event)}
          onDeleteClick={() => onDeleteClick(event)}
          className="transition-all duration-200 hover:shadow-md dark:hover:shadow-primary/5 hover:border-border/50 dark:hover:border-border/30"
        />
      ))}
    </div>
  );
} 