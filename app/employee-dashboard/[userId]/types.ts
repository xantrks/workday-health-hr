/**
 * Dashboard tab values type
 */
export type DashboardTab = 
  | 'overview' 
  | 'cycle' 
  | 'health' 
  | 'appointments' 
  | 'resources';

/**
 * Resource type definition
 */
export interface Resource {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdById: string;
  viewCount: number;
  downloadCount: number;
}

/**
 * API resources response
 */
export interface ResourcesResponse {
  resources: Resource[];
  error: string | null;
}

/**
 * File type information
 */
export interface FileTypeInfo {
  icon: JSX.Element;
  color: string;
}

/**
 * Category counts
 */
export interface CategoryCounts {
  all: number;
  period: number;
  menopause: number;
  policy: number;
} 