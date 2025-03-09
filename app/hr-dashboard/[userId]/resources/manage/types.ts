// Resource type definition
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

// Category options for filtering
export type ResourceCategory = 
  | 'all'
  | 'policy_documents'
  | 'menstrual_health_resources'
  | 'menopause_health_resources'
  | 'workshop_materials'
  | 'others';

// File type options for filtering
export type ResourceFileType = 
  | 'all'
  | 'image' 
  | 'video' 
  | 'pdf' 
  | 'document'
  | 'other';

// Sort direction options
export type SortDirection = 'asc' | 'desc';

// Resource fetch response
export interface ResourcesResponse {
  resources: Resource[];
  error: string | null;
}

// Delete resource response
export interface DeleteResourceResponse {
  success: boolean;
  error: string | null;
} 