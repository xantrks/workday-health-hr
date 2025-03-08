'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Calendar, 
  CalendarPlus, 
  Clock, 
  Link as LinkIcon, 
  Users,
  AlertCircle,
  CheckCircle,
  MapPin,
  ChevronLeft
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

export default function CreateEventPage({ params }: { params: { userId: string } }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login');
    },
  });
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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
        resourceMaterials,
        createdById: session?.user?.id
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create event');
      }

      setSubmitStatus('success');
      setTimeout(() => {
        router.push(`/hr-dashboard/${params.userId}`);
      }, 1500);
    } catch (error) {
      console.error('Create event error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create event, please try again');
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
            <p>Only HR personnel or administrators can create events.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.back()}>Return</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href={`/hr-dashboard/${params.userId}?tab=resources`}>
          <Button variant="ghost" size="sm" className="group mb-4 pl-1 flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-primary">Create New Event</h1>
        <p className="text-muted-foreground mt-1">Schedule and promote company-sponsored health events and workshops</p>
      </div>

      <Card className="shadow-sm border-muted">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle>Event Information</CardTitle>
          <CardDescription>Fill in the details of the event you want to create</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

              {/* Event Type */}
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="eventType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
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

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Enter location or 'Online'" 
                            className="pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter physical location or "Online" for virtual events
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        className="resize-none min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dates and Times */}
              <div className="space-y-4">
                <h3 className="text-md font-medium">Event Schedule</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type="date" 
                                className="pl-10"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type="time" 
                                className="pl-10"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type="date" 
                                className="pl-10"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type="time" 
                                className="pl-10"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Registration Information */}
              <div className="space-y-4">
                <h3 className="text-md font-medium">Registration Details</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="maxAttendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Attendees</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Enter maximum capacity or leave blank for unlimited" 
                              className="pl-10"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Leave empty for unlimited attendees
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="registrationLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Link</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Enter registration URL (optional)" 
                              className="pl-10"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          External registration page URL (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Resource Materials */}
              <FormField
                control={form.control}
                name="resourceMaterials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource Materials</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter resource links, separated by commas (optional)" 
                        className="resize-none min-h-20" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Links to slides, handouts, or other materials (comma separated)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Form Status Messages */}
              {errorMessage && (
                <div className="rounded-md p-4 bg-destructive/10 flex items-center gap-3 text-destructive">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {submitStatus === 'success' && (
                <div className="rounded-md p-4 bg-success/10 flex items-center gap-3 text-success">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <p>Event created successfully!</p>
                </div>
              )}

              {/* Form Controls */}
              <div className="flex justify-end gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/hr-dashboard/${params.userId}?tab=resources`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs mr-2"></span>
                      Creating...
                    </>
                  ) : (
                    <>Create Event</>
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