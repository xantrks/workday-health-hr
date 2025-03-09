import { EventData } from './types';

/**
 * Creates a new event by sending data to the API
 */
export async function createEvent(eventData: EventData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create event');
    }

    return { success: true };
  } catch (error) {
    console.error('Create event error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create event, please try again'
    };
  }
} 