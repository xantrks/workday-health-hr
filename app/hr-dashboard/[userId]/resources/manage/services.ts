import { DeleteResourceResponse, Resource, ResourcesResponse } from './types';

/**
 * Fetch all resources with stats
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
 * Delete a resource by ID
 */
export async function deleteResource(resourceId: string): Promise<DeleteResourceResponse> {
  try {
    const response = await fetch(`/api/resources?id=${resourceId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete resource');
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting resource:', error);
    return { 
      success: false, 
      error: 'Failed to delete resource, please try again' 
    };
  }
} 