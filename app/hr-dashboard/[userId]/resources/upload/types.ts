import * as z from 'zod';

// Form schema for resource upload
export const formSchema = z.object({
  title: z.string().min(1, { message: 'Title cannot be empty' }),
  description: z.string().optional(),
  category: z.string().min(1, { message: 'Please select a category' }),
  tags: z.string().optional()
});

// Form field values type
export type ResourceFormValues = z.infer<typeof formSchema>;

// Upload status type
export type UploadStatus = 'idle' | 'success' | 'error';

// Resource category options
export type ResourceCategory = 
  | 'policy_documents'
  | 'menstrual_health_resources'
  | 'menopause_health_resources'
  | 'workshop_materials'
  | 'others';

// Upload response type
export interface UploadResponse {
  success: boolean;
  error?: string;
  resourceId?: string;
} 