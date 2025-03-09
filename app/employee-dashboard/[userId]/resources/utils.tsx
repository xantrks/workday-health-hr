'use client';

import { FileText, File, Image, Video } from 'lucide-react';
import React from 'react';
import { Resource, FileTypeInfo, CategoryCounts } from './types';

/**
 * Filter resources based on search, category, file type, and tab filters
 */
export function getFilteredResources(
  resources: Resource[],
  searchTerm: string,
  categoryFilter: string,
  fileTypeFilter: string,
  activeTab: string
): Resource[] {
  return resources.filter(resource => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || resource.category.includes(categoryFilter);
    
    // File type filter
    const matchesFileType = fileTypeFilter === 'all' || resource.fileType === fileTypeFilter;
    
    // Tab filter
    let matchesTab = true;
    if (activeTab === 'menstrual') {
      matchesTab = resource.category.includes('menstrual_health_resources');
    } else if (activeTab === 'menopause') {
      matchesTab = resource.category.includes('menopause_health_resources');
    } else if (activeTab === 'policy') {
      matchesTab = resource.category.includes('policy_documents');
    }
    
    return matchesSearch && matchesCategory && matchesFileType && matchesTab;
  });
}

/**
 * Get icon and color based on file type
 */
export function getFileTypeInfo(fileType: string): FileTypeInfo {
  switch (fileType) {
    case 'pdf':
      return { icon: <FileText className="h-5 w-5" />, color: 'bg-red-100 text-red-600' };
    case 'word':
      return { icon: <FileText className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600' };
    case 'presentation':
      return { icon: <FileText className="h-5 w-5" />, color: 'bg-orange-100 text-orange-600' };
    case 'spreadsheet':
      return { icon: <FileText className="h-5 w-5" />, color: 'bg-green-100 text-green-600' };
    case 'image':
      return { icon: <Image className="h-5 w-5" />, color: 'bg-purple-100 text-purple-600' };
    case 'video':
      return { icon: <Video className="h-5 w-5" />, color: 'bg-pink-100 text-pink-600' };
    default:
      return { icon: <File className="h-5 w-5" />, color: 'bg-gray-100 text-gray-600' };
  }
}

/**
 * Calculate category counts
 */
export function getCategoryCounts(resources: Resource[]): CategoryCounts {
  return {
    all: resources.length,
    period: resources.filter(r => r.category.includes('menstrual_health_resources')).length,
    menopause: resources.filter(r => r.category.includes('menopause_health_resources')).length,
    policy: resources.filter(r => r.category.includes('policy_documents')).length,
  };
}

/**
 * Get popular resources (top N by view count)
 */
export function getPopularResources(resources: Resource[], count: number = 3): Resource[] {
  return [...resources].sort((a, b) => b.viewCount - a.viewCount).slice(0, count);
} 