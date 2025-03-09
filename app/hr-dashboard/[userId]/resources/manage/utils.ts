import { Resource, SortDirection } from './types';

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
      return 'Menstrual Health';
    case 'menopause_health_resources':
      return 'Menopause Health';
    case 'workshop_materials':
      return 'Workshop Materials';
    default:
      return 'Other';
  }
}

/**
 * Filter resources based on search term, category, and file type
 */
export function filterResources(
  resources: Resource[],
  searchTerm: string,
  categoryFilter: string,
  fileTypeFilter: string
): Resource[] {
  return resources.filter(resource => {
    // Title and description search
    const matchesSearch = searchTerm 
      ? resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    
    // Category filter
    const matchesCategory = categoryFilter && categoryFilter !== 'all'
      ? resource.category === categoryFilter
      : true;
    
    // File type filter
    const matchesFileType = fileTypeFilter && fileTypeFilter !== 'all'
      ? resource.fileType === fileTypeFilter
      : true;

    return matchesSearch && matchesCategory && matchesFileType;
  });
}

/**
 * Sort resources based on field and direction
 */
export function sortResources(
  resources: Resource[],
  sortField: keyof Resource,
  sortDirection: SortDirection
): Resource[] {
  return [...resources].sort((a, b) => {
    // Handle sorting for different field types
    const fieldA = a[sortField];
    const fieldB = b[sortField];
    
    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc'
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }
    
    if (typeof fieldA === 'number' && typeof fieldB === 'number') {
      return sortDirection === 'asc'
        ? fieldA - fieldB
        : fieldB - fieldA;
    }
    
    // Default to sorting by createdAt
    return sortDirection === 'asc'
      ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
} 