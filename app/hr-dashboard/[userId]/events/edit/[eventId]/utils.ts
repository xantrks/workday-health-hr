import { format, parseISO } from 'date-fns';
import { FormValues, Event, EventUpdateData } from './types';

/**
 * Processes form values and prepares data for API submission
 */
export function processFormData(values: FormValues): EventUpdateData {
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
    resourceMaterials
  };
}

/**
 * Converts raw event data to form values
 */
export function eventToFormValues(event: Event): FormValues {
  // Format dates and times for form
  const startDate = format(parseISO(event.startDate), 'yyyy-MM-dd');
  const startTime = format(parseISO(event.startDate), 'HH:mm');
  const endDate = format(parseISO(event.endDate), 'yyyy-MM-dd');
  const endTime = format(parseISO(event.endDate), 'HH:mm');
  
  // Convert resource materials to string
  const resourceMaterials = event.resourceMaterials.join(',');
  
  // Return formatted form values
  return {
    title: event.title,
    description: event.description || '',
    eventType: event.eventType,
    startDate,
    startTime,
    endDate,
    endTime,
    location: event.location || '',
    maxAttendees: event.maxAttendees?.toString() || '',
    registrationLink: event.registrationLink || '',
    resourceMaterials
  };
}

/**
 * Default form values for the event edit form
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