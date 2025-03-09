import { Feedback } from './types';

/**
 * Fetch feedback data from the API
 * @param category Optional category filter
 * @returns Array of feedback items
 */
export async function fetchFeedback(category?: string): Promise<Feedback[]> {
  try {
    const url = category && category !== 'all' 
      ? `/api/feedback?category=${category}`
      : '/api/feedback';
      
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw new Error('Failed to load employee feedback');
  }
}

/**
 * Mark feedback as reviewed (placeholder function)
 * @param feedbackId The ID of the feedback to mark as reviewed
 */
export async function markFeedbackAsReviewed(feedbackId: string): Promise<void> {
  try {
    // This would be replaced with actual API call in real implementation
    console.log(`Marking feedback ${feedbackId} as reviewed`);
    // const response = await fetch(`/api/feedback/${feedbackId}/review`, {
    //   method: 'POST',
    // });
    
    // if (!response.ok) {
    //   throw new Error('Failed to mark feedback as reviewed');
    // }
  } catch (error) {
    console.error('Error marking feedback as reviewed:', error);
    throw new Error('Failed to update feedback status');
  }
} 