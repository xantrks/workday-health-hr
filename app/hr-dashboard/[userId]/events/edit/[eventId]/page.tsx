'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format, parseISO } from 'date-fns';
import { 
  Calendar, 
  CalendarPlus, 
  Clock, 
  Link as LinkIcon, 
  Users,
  AlertCircle,
  CheckCircle,
  MapPin
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Interface for Event data
interface Event {
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
const formSchema = z.object({
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

// 使用 Zod 推断的类型
type FormValues = z.infer<typeof formSchema>;

export default function EditEventPage({ params }: { params: { userId: string, eventId: string } }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login');
    },
  });
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
  });

  // Fetch event data and populate form
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setFetchError(null);
      
      try {
        const response = await fetch(`/api/events/${params.eventId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch event information');
        }
        
        const event: Event = await response.json();
        
        // Format dates and times for form
        const startDate = format(parseISO(event.startDate), 'yyyy-MM-dd');
        const startTime = format(parseISO(event.startDate), 'HH:mm');
        const endDate = format(parseISO(event.endDate), 'yyyy-MM-dd');
        const endTime = format(parseISO(event.endDate), 'HH:mm');
        
        // Convert resource materials to string
        const resourceMaterials = event.resourceMaterials.join(',');
        
        // Update form values
        form.reset({
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
        });
      } catch (error) {
        console.error('Error fetching event:', error);
        setFetchError(error instanceof Error ? error.message : 'Failed to fetch event information');
      } finally {
        setLoading(false);
      }
    };
    
    if (session?.user) {
      fetchEvent();
    }
  }, [session, params.eventId, form]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Combine date and time into full date objects
      const startDateTime = new Date(`${values.startDate}T${values.startTime}`);
      const endDateTime = new Date(`${values.endDate}T${values.endTime}`);
      
      // Process resourceMaterials: if user enters comma-separated links, convert to array
      const resourceMaterials = values.resourceMaterials
        ? values.resourceMaterials.split(',').map(item => item.trim())
        : [];

      // 处理 maxAttendees: 手动将字符串转换为数字或 undefined
      let maxAttendeesValue: number | undefined = undefined;
      if (values.maxAttendees && values.maxAttendees.trim() !== '') {
        const parsed = parseInt(values.maxAttendees);
        if (!isNaN(parsed) && parsed > 0) {
          maxAttendeesValue = parsed;
        }
      }

      const eventData = {
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

      // Update event using PATCH API
      const response = await fetch(`/api/events/${params.eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update event');
      }

      setSubmitStatus('success');
      setTimeout(() => {
        router.push(`/hr-dashboard/${params.userId}/events/manage`);
      }, 1500);
    } catch (error) {
      console.error('Update event error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update event, please try again');
    } finally {
      setSubmitting(false);
    }
  };

  // Check if user has HR or admin permissions
  if (session?.user?.role !== 'hr' && session?.user?.role !== 'admin') {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
            <CardDescription>You do not have permission to access this page</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Only HR personnel or administrators can edit events.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.back()}>Return</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading event information...</div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Error Fetching Event</CardTitle>
            <CardDescription>Could not load event information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-destructive/15 p-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
              <div className="text-destructive text-sm">{fetchError}</div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.back()}>Return</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
          <CardDescription>Update event information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Event Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter event description (optional)" 
                        className="resize-none min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Type */}
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="webinar">Webinar</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="seminar">Seminar</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date and Time Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 opacity-70" />
                          <Input type="date" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Start Time */}
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 opacity-70" />
                          <Input type="time" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End Date */}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 opacity-70" />
                          <Input type="date" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End Time */}
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 opacity-70" />
                          <Input type="time" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 opacity-70" />
                        <Input 
                          placeholder="Physical location or 'Online'" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      For online events, you can enter "Online" and provide a meeting link in the registration link field.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Max Attendees */}
              <FormField
                control={form.control}
                name="maxAttendees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Attendees</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 opacity-70" />
                        <Input 
                          type="number" 
                          placeholder="Leave empty for unlimited" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Maximum number of attendees. Leave empty for unlimited.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Registration Link */}
              <FormField
                control={form.control}
                name="registrationLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External Registration Link (Optional)</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <LinkIcon className="mr-2 h-4 w-4 opacity-70" />
                        <Input 
                          placeholder="https://example.com/register" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Optional external registration link. If provided, employees will be directed to this link.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Resource Materials */}
              <FormField
                control={form.control}
                name="resourceMaterials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource Materials (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter resource links, separated by commas" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Links to materials, slides or resources for this event (comma separated).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status messages */}
              {submitStatus === 'error' && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
                  <div className="text-destructive text-sm">{errorMessage}</div>
                </div>
              )}

              {submitStatus === 'success' && (
                <div className="bg-primary/15 p-3 rounded-md flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                  <div className="text-primary text-sm">Event updated successfully! Redirecting...</div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                >
                  {submitting ? (
                    <>Updating Event...</>
                  ) : (
                    <>Update Event</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 