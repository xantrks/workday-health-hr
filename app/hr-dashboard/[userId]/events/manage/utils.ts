import { format, parseISO } from 'date-fns';
import { BadgeColorResult, CalendarEvent, Event } from './types';

/**
 * Format date string to readable format
 */
export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  } catch (e) {
    return dateString;
  }
}

/**
 * Get color based on event type for calendar
 */
export function getEventTypeColor(eventType: string): string {
  switch (eventType) {
    case 'webinar':
      return '#3b82f6'; // blue
    case 'workshop':
      return '#10b981'; // green
    case 'seminar':
      return '#8b5cf6'; // purple
    case 'training':
      return '#f59e0b'; // yellow
    case 'meeting':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
}

/**
 * Get badge colors based on event type
 */
export function getBadgeColor(eventType: string): BadgeColorResult {
  switch (eventType) {
    case 'webinar':
      return { background: 'bg-blue-100', text: 'text-blue-800' };
    case 'workshop':
      return { background: 'bg-green-100', text: 'text-green-800' };
    case 'seminar':
      return { background: 'bg-purple-100', text: 'text-purple-800' };
    case 'training':
      return { background: 'bg-yellow-100', text: 'text-yellow-800' };
    case 'meeting':
      return { background: 'bg-red-100', text: 'text-red-800' };
    default:
      return { background: 'bg-gray-100', text: 'text-gray-800' };
  }
}

/**
 * Transform events for calendar display
 */
export function transformToCalendarEvents(events: Event[]): CalendarEvent[] {
  return events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.startDate,
    end: event.endDate,
    extendedProps: event,
    backgroundColor: getEventTypeColor(event.eventType),
    borderColor: getEventTypeColor(event.eventType),
  }));
}

/**
 * Filter events by type
 */
export function filterEvents(events: Event[], filter: string): Event[] {
  if (filter === 'all') return events;
  return events.filter(event => event.eventType === filter);
} 