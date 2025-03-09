/**
 * Resource type definition for policy documents and educational materials
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
 * Dashboard tab values type
 */
export type DashboardTab = 
  | 'overview' 
  | 'analytics' 
  | 'reports' 
  | 'notifications' 
  | 'resources'
  | 'leave'
  | 'workforce'
  | 'health';

/**
 * API response for resources
 */
export interface ResourcesResponse {
  resources: Resource[];
  error: string | null;
}

/**
 * Dashboard metric card data type
 */
export interface MetricCardData {
  title: string;
  value: string;
  change: string;
  changeDirection: 'up' | 'down';
  icon: string;
  iconColor: 'primary' | 'accent';
}

/**
 * Health trend item type
 */
export interface HealthTrend {
  title: string;
  description: string;
} 