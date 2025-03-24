// Event type interface
export interface Event {
  id: string;
  title: string;
  description: string | null;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string | null;
  maxParticipants?: number;
  registrationCount?: number;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  registrationLink: string | null;
  resourceMaterials: string[];
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
export type EventFilter = 'all' | 'upcoming' | 'past' | 'draft';

// Tab view options
export type TabView = 'calendar' | 'list'; 