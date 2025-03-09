// Event type interface
export interface Event {
  id: string;
  title: string;
  description: string | null;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string | null;
  maxAttendees: number | null | string;
  registrationLink: string | null;
  resourceMaterials: string[];
  createdAt: string;
  updatedAt: string;
  createdById: string;
  registrationCount: number;
}

// Calendar event display format
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: Event;
  backgroundColor: string;
  borderColor: string;
}

// Event badge color helper
export interface BadgeColorResult {
  background: string;
  text: string;
}

// Event filter options
export type EventFilter = 'all' | 'webinar' | 'workshop' | 'seminar' | 'training' | 'meeting';

// Tab view options
export type TabView = 'calendar' | 'list'; 