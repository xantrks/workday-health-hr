'use client';

import { format, parseISO } from 'date-fns';
import { CheckCircle } from 'lucide-react';

import { Event, CalendarDay } from '../types';
import { isUpcoming, isPast } from '../utils/dateUtils';
import { getEventTypeColor } from '../utils/eventUtils';

import { Badge } from '@/components/ui/badge';

interface MonthCalendarViewProps {
  calendarDays: CalendarDay[];
  calendarEvents: Record<string, Event[]>;
  isRegistered: (eventId: string) => boolean;
  openEventDetails: (event: Event) => void;
  filter: string;
}

export default function MonthCalendarView({
  calendarDays,
  calendarEvents,
  isRegistered,
  openEventDetails,
  filter,
}: MonthCalendarViewProps) {
  return (
    <div className="rounded-md border overflow-hidden w-full">
      {/* 日历头部 - 星期几 */}
      <div className="grid grid-cols-7 bg-muted text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-2 text-sm font-medium">
            {day}
          </div>
        ))}
      </div>
      
      {/* 日历主体 - 日期和事件 */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => (
          <div 
            key={index} 
            className={`h-[140px] border-t border-r p-1 ${
              !day.isCurrentMonth 
                ? 'bg-muted/40 text-muted-foreground' 
                : day.isToday 
                  ? 'bg-primary/5' 
                  : ''
            }`}
          >
            {day.date && (
              <>
                <div className={`text-right text-xs p-1 font-medium ${
                  day.isToday ? 'text-primary' : ''
                }`}>
                  {format(day.date, 'd')}
                </div>
                
                {/* 当天的事件 */}
                <div className="space-y-1 mt-1 overflow-y-auto max-h-[110px]">
                  {day.dateString && calendarEvents[day.dateString]?.filter(e => 
                    filter === 'all' || e.eventType === filter
                  ).map((eventItem: Event) => {
                    const registered = isRegistered(eventItem.id);
                    const upcoming = isUpcoming(eventItem.startDate);
                    const past = isPast(eventItem.startDate);
                    
                    return (
                      <button
                        key={eventItem.id}
                        onClick={() => openEventDetails(eventItem)}
                        className={`w-full text-left rounded px-2 py-1 text-xs truncate text-white relative
                          ${getEventTypeColor(eventItem.eventType)}
                          ${past ? 'opacity-60' : ''}
                          hover:opacity-90 transition-opacity
                        `}
                      >
                        <div className="flex items-center gap-1">
                          {format(parseISO(eventItem.startDate), 'h:mm a')}
                          {registered && (
                            <CheckCircle className="h-3 w-3 ml-1" />
                          )}
                        </div>
                        <div className="truncate pr-2">
                          {eventItem.title}
                          {upcoming && !registered && (
                            <Badge variant="secondary" className="ml-1 text-[9px] px-1 py-0 h-3">new</Badge>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 