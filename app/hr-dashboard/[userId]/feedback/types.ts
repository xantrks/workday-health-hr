/**
 * Feedback item interface
 */
export interface Feedback {
  id: string;
  content: string;
  category: string;
  anonymous: boolean;
  userId?: string;
  createdAt: string;
}

/**
 * Category mapping record for display names
 */
export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'general': 'General Feedback',
  'health_programs': 'Health Programs',
  'workplace': 'Workplace',
  'benefits': 'Benefits & Support',
};

/**
 * Props for the feedback header component
 */
export interface FeedbackHeaderProps {
  userId: string;
  categoryFilter: string;
  onFilterChange: (value: string) => void;
}

/**
 * Props for the feedback card component
 */
export interface FeedbackCardProps {
  feedback: Feedback;
}

/**
 * Props for the feedback list component
 */
export interface FeedbackListProps {
  feedback: Feedback[];
}

/**
 * Props for the empty state component
 */
export interface EmptyStateProps {
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
}

/**
 * Props for the loading state component
 */
export interface LoadingStateProps {
  message?: string;
} 