'use client';

import { useRouter } from 'next/navigation';
import { CalendarIcon, AlertCircle } from 'lucide-react';
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
  onDeleteClick
}: ListViewProps) {
  const router = useRouter();
  const filteredEvents = filterEvents(events, filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="rounded-full bg-destructive/10 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <p className="text-destructive">{error}</p>
        <Button 
          variant="outline" 
          onClick={onRetry} 
          className="mt-6"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="rounded-full bg-muted p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
          <CalendarIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No events scheduled</p>
        <Button 
          variant="outline" 
          onClick={onCreateEvent} 
          className="mt-6"
        >
          Create First Event
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {filteredEvents.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          userId={userId}
          onViewDetails={onViewDetails}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
} 