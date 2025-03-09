'use client';

import { format, parseISO, isToday } from 'date-fns';
import { CheckCircle } from 'lucide-react';

import { Event } from '../types';
import { isUpcoming, isPast } from '../utils/dateUtils';
import { getEventTypeColor } from '../utils/eventUtils';

import { Badge } from '@/components/ui/badge';

interface ListCalendarViewProps {
  calendarEvents: Record<string, Event[]>;
  isRegistered: (eventId: string) => boolean;
  openEventDetails: (event: Event) => void;
  filter: string;
}

export default function ListCalendarView({
  calendarEvents,
  isRegistered,
  openEventDetails,
  filter,
}: ListCalendarViewProps) {
  return (
    <div className="p-6 space-y-6">
      {Object.entries(calendarEvents)
        .sort()
        .filter(([_, dayEvents]) => 
          dayEvents.some(e => filter === 'all' || e.eventType === filter)
        )
        .map(([dateKey, dayEvents]) => (
          <div key={dateKey} className="space-y-2">
            <h4 className="font-medium text-sm flex items-center">
              {format(parseISO(dateKey), 'EEEE, MMMM d')}
              {isToday(parseISO(dateKey)) && (
                <Badge variant="secondary" className="ml-2">Today</Badge>
              )}
            </h4>
            <div className="space-y-1 pl-4">
              {dayEvents
                .filter(e => filter === 'all' || e.eventType === filter)
                .map((eventItem: Event) => {
                  const registered = isRegistered(eventItem.id);
                  const upcoming = isUpcoming(eventItem.startDate);
                  const past = isPast(eventItem.startDate);
                  
                  return (
                    <div 
                      key={eventItem.id}
                      onClick={() => openEventDetails(eventItem)}
                      className={`flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer ${past ? 'opacity-60' : ''}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${getEventTypeColor(eventItem.eventType)}`}></div>
                      <div className="text-sm font-medium flex items-center gap-1">
                        {eventItem.title}
                        {upcoming && !registered && (
                          <Badge variant="secondary" className="ml-1 text-[10px] px-1">new</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(parseISO(eventItem.startDate), 'h:mm a')} - {format(parseISO(eventItem.endDate), 'h:mm a')}
                      </div>
                      {registered && (
                        <Badge variant="outline" className="flex items-center gap-1 ml-auto">
                          <CheckCircle className="h-3 w-3 text-primary" />
                          Registered
                        </Badge>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
    </div>
  );
} 