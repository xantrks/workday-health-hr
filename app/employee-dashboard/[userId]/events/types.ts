// Event type interface
export interface Event {
  id: string;
  title: string;
  description: string | null;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string | null;
  maxAttendees: number | null;
  registrationLink: string | null;
  resourceMaterials: string[];
  createdAt: string;
  updatedAt: string;
  createdById: string;
  currentAttendees?: number;
}

// Registration type
export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  attended: boolean;
}

// Event filter type
export type EventFilter = 'all' | 'webinar' | 'workshop' | 'seminar' | 'training' | 'meeting';

// Calendar view type
export type CalendarViewType = 'month' | 'list';

// Calendar day item type
export interface CalendarDay {
  date: Date | null;
  isCurrentMonth: boolean;
  isToday?: boolean;
  dateString?: string;
}

// Grouped events type
export interface GroupedEvents {
  [dateKey: string]: Event[];
} 