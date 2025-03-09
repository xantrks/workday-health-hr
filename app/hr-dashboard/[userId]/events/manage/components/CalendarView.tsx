'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Event } from '../types';
import { transformToCalendarEvents } from '../utils';

interface CalendarViewProps {
  events: Event[];
  filter: string;
  onEventClick: (eventId: string) => void;
}

export interface CalendarRef {
  getApi: () => FullCalendar | null;
}

const CalendarView = forwardRef<CalendarRef, CalendarViewProps>(
  ({ events, filter, onEventClick }, ref) => {
    const calendarRef = useRef<FullCalendar | null>(null);

    useImperativeHandle(ref, () => ({
      getApi: () => calendarRef.current
    }));

    const filteredEvents = filter === 'all'
      ? events
      : events.filter(event => event.eventType === filter);

    const calendarEvents = transformToCalendarEvents(filteredEvents);

    const handleEventClick = (clickInfo: any) => {
      const eventId = clickInfo.event.id;
      onEventClick(eventId);
    };

    return (
      <div className="flex-1 bg-card rounded-md overflow-hidden">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          height="auto"
          aspectRatio={1.35}
        />
      </div>
    );
  }
);

CalendarView.displayName = 'CalendarView';

export default CalendarView; 