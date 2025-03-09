/**
 * Interface for resource items
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
 * Type for resource file type information
 */
export interface FileTypeInfo {
  icon: JSX.Element;
  color: string;
}

/**
 * Type for category count information
 */
export interface CategoryCounts {
  all: number;
  period: number;
  menopause: number;
  policy: number;
}

/**
 * Type for view mode
 */
export type ViewMode = 'grid' | 'list'; 