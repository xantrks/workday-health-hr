import { z } from 'zod';

/**
 * Form validation schema for feedback submission
 */
export const feedbackSchema = z.object({
  content: z
    .string()
    .min(10, { message: 'Feedback must be at least 10 characters' })
    .max(1000, { message: 'Feedback must not exceed 1000 characters' }),
  category: z.string({
    required_error: 'Please select a category',
  }),
  anonymous: z.boolean().default(true),
});

/**
 * Type for feedback form values
 */
export type FeedbackFormValues = z.infer<typeof feedbackSchema>;

/**
 * Feedback categories
 */
export const FEEDBACK_CATEGORIES = [
  'Menstrual Health',
  'Menopause Health',
  'Benefit Policies',
  'Support Programs',
  'Workplace Environment',
  'Other'
] as const;

/**
 * API response for feedback submission
 */
export interface FeedbackResponse {
  success: boolean;
  error?: string;
  id?: string;
} 