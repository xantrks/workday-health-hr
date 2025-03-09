import { ResourcesResponse } from './types';

/**
 * Fetch all resources
 */
export async function fetchResources(): Promise<ResourcesResponse> {
  try {
    const response = await fetch('/api/resources');
    
    if (!response.ok) {
      throw new Error('Failed to fetch resources');
    }
    
    const data = await response.json();
    return { resources: data, error: null };
  } catch (error) {
    console.error('Error fetching resources:', error);
    return { 
      resources: [], 
      error: 'Failed to fetch resource list, please try again'
    };
  }
}

/**
 * Track resource view
 */
export async function trackResourceView(resourceId: string): Promise<void> {
  try {
    await fetch(`/api/resources/${resourceId}/view`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error tracking resource view:', error);
    // Continue silently even if tracking fails
  }
}

/**
 * Track resource download
 */
export async function trackResourceDownload(resourceId: string): Promise<void> {
  try {
    await fetch(`/api/resources/${resourceId}/download`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error tracking resource download:', error);
    // Continue silently even if tracking fails
  }
}

/**
 * Format date string to readable format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format category name for display
 */
export function formatCategoryName(category: string): string {
  switch (category) {
    case 'policy_documents':
      return 'Policy Documents';
    case 'menstrual_health_resources':
      return 'Menstrual Health Resources';
    case 'menopause_health_resources':
      return 'Menopause Health Resources';
    case 'workshop_materials':
      return 'Workshop Materials';
    default:
      return category;
  }
} 