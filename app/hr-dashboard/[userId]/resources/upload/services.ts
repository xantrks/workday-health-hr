import { ResourceFormValues, UploadResponse } from './types';

/**
 * Upload a resource file with metadata
 */
export async function uploadResource(
  file: File,
  formValues: ResourceFormValues
): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', formValues.title);
    formData.append('description', formValues.description || '');
    formData.append('category', formValues.category);
    
    // Process tags: if user enters comma-separated tags, convert to array
    let tagsValue = formValues.tags || '';
    formData.append('tags', tagsValue);

    const response = await fetch('/api/files/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Upload failed');
    }

    const result = await response.json();
    return { 
      success: true,
      resourceId: result.id
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Upload failed, please try again'
    };
  }
} 