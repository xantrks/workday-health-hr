import { FeedbackFormValues, FeedbackResponse } from './types';

/**
 * Submit feedback to the API
 */
export async function submitFeedback(data: FeedbackFormValues): Promise<FeedbackResponse> {
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit feedback');
    }

    const result = await response.json();
    return { 
      success: true,
      id: result.id
    };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit feedback'
    };
  }
} 