import { Resource } from './types';

/**
 * Fetch all resources from the API
 */
export async function fetchResources(): Promise<Resource[]> {
  try {
    const response = await fetch('/api/resources');
    if (!response.ok) {
      throw new Error('Failed to fetch resources');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw new Error('Failed to fetch resource list, please try again');
  }
}

/**
 * Track when a resource is viewed
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
 * Track when a resource is downloaded
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