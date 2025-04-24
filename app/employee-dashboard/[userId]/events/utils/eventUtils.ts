import { Event, Registration } from "../types";

// Get event type color
export const getEventTypeColor = (eventType: string): string => {
  switch (eventType) {
    case 'webinar':
      return 'bg-blue-500';
    case 'workshop':
      return 'bg-purple-500';
    case 'seminar':
      return 'bg-green-500';
    case 'training':
      return 'bg-amber-500';
    case 'meeting':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// Check if user has registered for the event
export const isRegistered = (eventId: string, registrations: Registration[]): boolean => {
  return registrations.some(reg => reg.eventId === eventId);
};

// Determine if event registration is available
export const isRegistrationAvailable = (event: Event): boolean => {
  const eventStart = new Date(event.startDate);
  const now = new Date();
  
  // Check if event is in the future or today
  if (eventStart < now && !isSameDay(eventStart, now)) {
    return false;
  }
  
  // Check if event has reached maximum attendees
  if (event.maxAttendees !== null && event.currentAttendees !== undefined) {
    return event.currentAttendees < event.maxAttendees;
  }
  
  return true;
};

// Helper function: Check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
} 