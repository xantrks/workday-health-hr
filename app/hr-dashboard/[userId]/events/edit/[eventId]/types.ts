import * as z from 'zod';

// Interface for Event data
export interface Event {
  id: string;
  title: string;
  description: string | null;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string | null;
  maxAttendees: number | null;
  registrationLink: string | null;
  resourceMaterials: string[];
  createdAt: string;
  updatedAt: string;
  createdById: string;
}

// Form validation schema
export const formSchema = z.object({
  title: z.string().min(1, { message: 'Title cannot be empty' }),
  description: z.string().optional(),
  eventType: z.string().min(1, { message: 'Please select an event type' }),
  startDate: z.string().min(1, { message: 'Start date is required' }),
  startTime: z.string().min(1, { message: 'Start time is required' }),
  endDate: z.string().min(1, { message: 'End date is required' }),
  endTime: z.string().min(1, { message: 'End time is required' }),
  location: z.string().optional(),
  maxAttendees: z.string().optional(),
  registrationLink: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  resourceMaterials: z.string().optional()
}).refine(data => {
  const start = new Date(`${data.startDate}T${data.startTime}`);
  const end = new Date(`${data.endDate}T${data.endTime}`);
  return end > start;
}, {
  message: "End date/time must be after start date/time",
  path: ["endDate"]
});

// Form values type
export type FormValues = z.infer<typeof formSchema>;

// Event data type for API
export interface EventUpdateData {
  title: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string;
  maxAttendees?: number;
  registrationLink?: string;
  resourceMaterials: string[];
}

// Form submission status type
export type SubmitStatus = 'idle' | 'success' | 'error'; 