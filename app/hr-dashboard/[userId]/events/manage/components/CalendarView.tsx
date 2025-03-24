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
      <div className="flex-1 bg-card rounded-lg overflow-hidden">
        <style jsx global>{`
          .fc {
            --fc-border-color: hsl(var(--border) / 0.2);
            --fc-button-bg-color: transparent;
            --fc-button-border-color: hsl(var(--border));
            --fc-button-text-color: hsl(var(--foreground));
            --fc-button-hover-bg-color: hsl(var(--accent));
            --fc-button-hover-border-color: hsl(var(--accent));
            --fc-button-active-bg-color: hsl(var(--accent));
            --fc-button-active-border-color: hsl(var(--accent));
            --fc-event-bg-color: hsl(var(--primary) / 0.8);
            --fc-event-border-color: hsl(var(--primary));
            --fc-event-text-color: hsl(var(--primary-foreground));
            --fc-event-selected-overlay-color: hsl(var(--accent) / 0.1);
            --fc-today-bg-color: hsl(var(--accent) / 0.1);
            --fc-neutral-bg-color: hsl(var(--background));
            height: 100%;
            font-family: inherit;
          }

          .dark .fc {
            --fc-border-color: hsl(var(--border) / 0.2);
            --fc-button-hover-bg-color: hsl(var(--accent) / 0.2);
            --fc-button-active-bg-color: hsl(var(--accent) / 0.2);
            --fc-event-bg-color: hsl(var(--primary) / 0.7);
            --fc-event-border-color: hsl(var(--primary) / 0.8);
            --fc-today-bg-color: hsl(var(--accent) / 0.15);
          }

          .fc .fc-toolbar {
            padding: 1.5rem;
            gap: 1rem;
          }

          .fc .fc-toolbar-title {
            font-size: 1.25rem;
            font-weight: 600;
          }

          .fc .fc-button {
            padding: 0.5rem 1rem;
            font-weight: 500;
            transition: all 0.15s ease;
            height: auto;
            border-radius: 0.5rem;
          }

          .fc .fc-button:focus {
            box-shadow: none;
          }

          .fc .fc-button-primary:not(:disabled).fc-button-active,
          .fc .fc-button-primary:not(:disabled):active {
            color: hsl(var(--accent-foreground));
          }

          .fc .fc-daygrid-day-frame {
            padding: 0.5rem;
          }

          .fc .fc-daygrid-day-top {
            justify-content: center;
            margin-bottom: 0.25rem;
          }

          .fc .fc-daygrid-day-number {
            font-size: 0.875rem;
            font-weight: 500;
            color: hsl(var(--foreground));
          }

          .fc .fc-col-header-cell {
            padding: 0.75rem 0;
            background-color: hsl(var(--muted) / 0.5);
          }

          .fc .fc-col-header-cell-cushion {
            font-weight: 500;
            color: hsl(var(--foreground));
          }

          .fc .fc-event {
            border-radius: 0.375rem;
            padding: 0.125rem 0.25rem;
            font-size: 0.875rem;
            cursor: pointer;
            transition: transform 0.15s ease;
          }

          .fc .fc-event:hover {
            transform: translateY(-1px);
          }

          .fc .fc-daygrid-event-dot {
            display: none;
          }

          .fc .fc-daygrid-day.fc-day-today {
            background-color: transparent;
          }

          .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-frame {
            background-color: var(--fc-today-bg-color);
            border-radius: 0.5rem;
          }

          @media (max-width: 640px) {
            .fc .fc-toolbar {
              flex-direction: column;
              align-items: stretch;
            }

            .fc .fc-toolbar-chunk {
              display: flex;
              justify-content: center;
              gap: 0.5rem;
            }

            .fc .fc-toolbar-title {
              text-align: center;
            }
          }
        `}</style>
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