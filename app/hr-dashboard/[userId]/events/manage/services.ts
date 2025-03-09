import { Event } from './types';

/**
 * Fetch all events with registration statistics
 */
export async function fetchEvents(): Promise<{
  events: Event[];
  error: string | null;
}> {
  try {
    const response = await fetch('/api/events/stats');
    
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    
    const data = await response.json();
    return { events: data, error: null };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { 
      events: [], 
      error: 'Failed to load events. Please try again.' 
    };
  }
}

/**
 * Delete an event by ID
 */
export async function deleteEvent(eventId: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const response = await fetch(`/api/events?id=${eventId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete event');
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete event' 
    };
  }
} 