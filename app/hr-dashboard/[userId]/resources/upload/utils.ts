/**
 * Format file size to readable format
 */
export function formatFileSize(bytes: number): string {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
}

/**
 * Format category value to display name
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
    case 'others':
      return 'Others';
    default:
      return category;
  }
} 