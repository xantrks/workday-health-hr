import { Event, EventUpdateData } from './types';

/**
 * Fetches a single event by ID
 */
export async function fetchEvent(eventId: string): Promise<{ 
  event?: Event; 
  error?: string 
}> {
  try {
    const response = await fetch(`/api/events/${eventId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch event information');
    }
    
    const event: Event = await response.json();
    return { event };
  } catch (error) {
    console.error('Error fetching event:', error);
    return { 
      error: error instanceof Error ? error.message : 'Failed to fetch event information'
    };
  }
}

/**
 * Updates an existing event by ID
 */
export async function updateEvent(
  eventId: string, 
  eventData: EventUpdateData
): Promise<{ 
  success: boolean; 
  error?: string 
}> {
  try {
    const response = await fetch(`/api/events/${eventId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update event');
    }

    return { success: true };
  } catch (error) {
    console.error('Update event error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update event, please try again'
    };
  }
} 