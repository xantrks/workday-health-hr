import { ResourcesResponse } from './types';

/**
 * Fetch recent resources with optional limit
 */
export async function fetchRecentResources(limit: number = 5): Promise<ResourcesResponse> {
  try {
    const response = await fetch(`/api/resources?limit=${limit}`);
    
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
 * Format date string to readable format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US');
}

/**
 * Format category string to display name
 */
export function formatCategory(category: string): string {
  switch (category) {
    case 'policy_documents':
      return 'Policy Documents';
    case 'menstrual_health_resources':
      return 'Menstrual Health';
    case 'menopause_health_resources':
      return 'Menopause Health';
    case 'workshop_materials':
      return 'Workshop Materials';
    default:
      return category;
  }
} 