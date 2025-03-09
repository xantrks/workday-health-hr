import { FormValues, EventData } from './types';

/**
 * Processes form values and prepares data for API submission
 */
export function processFormData(values: FormValues, userId?: string): EventData {
  // Combine date and time into full date objects
  const startDateTime = new Date(`${values.startDate}T${values.startTime}`);
  const endDateTime = new Date(`${values.endDate}T${values.endTime}`);
  
  // Process resourceMaterials: if user enters comma-separated links, convert to array
  const resourceMaterials = values.resourceMaterials
    ? values.resourceMaterials.split(',').map(item => item.trim())
    : [];

  // Process maxAttendees: convert string to number or undefined
  let maxAttendeesValue: number | undefined = undefined;
  if (values.maxAttendees && values.maxAttendees.trim() !== '') {
    const parsed = parseInt(values.maxAttendees);
    if (!isNaN(parsed) && parsed > 0) {
      maxAttendeesValue = parsed;
    }
  }

  // Create the event data object
  return {
    title: values.title,
    description: values.description || '',
    eventType: values.eventType,
    startDate: startDateTime.toISOString(),
    endDate: endDateTime.toISOString(),
    location: values.location || '',
    maxAttendees: maxAttendeesValue,
    registrationLink: values.registrationLink || undefined,
    resourceMaterials,
    createdById: userId
  };
}

/**
 * Default form values for the event creation form
 */
export const defaultFormValues: FormValues = {
  title: '',
  description: '',
  eventType: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  location: '',
  maxAttendees: '',
  registrationLink: '',
  resourceMaterials: ''
}; 