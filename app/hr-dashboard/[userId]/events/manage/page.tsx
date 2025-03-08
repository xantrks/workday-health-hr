'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format, parseISO } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Clock, 
  MapPin, 
  PlusCircle,
  Download,
  Info,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

// Define Event type interface
interface Event {
  id: string;
  title: string;
  description: string | null;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string | null;
  maxAttendees: number | null | string;
  registrationLink: string | null;
  resourceMaterials: string[];
  createdAt: string;
  updatedAt: string;
  createdById: string;
  registrationCount: number;
}

export default function ManageEventsPage({ params }: { params: { userId: string } }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });
  const router = useRouter();
  const calendarRef = useRef<FullCalendar | null>(null);
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('calendar');
  const [filter, setFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch events with registration counts
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/events/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const deleteEvent = async (eventId: string) => {
    setDeleteLoading(true);
    setDeleteError(null);
    
    try {
      const response = await fetch(`/api/events?id=${eventId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete event');
      }
      
      // Remove event from state
      setEvents(events.filter(event => event.id !== eventId));
      setDeleteConfirmOpen(false);
      setSelectedEvent(null);
      setShowEventDetails(false);
    } catch (error) {
      console.error('Error deleting event:', error);
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete event');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  // Filter events by type
  const getFilteredEvents = () => {
    if (filter === 'all') return events;
    return events.filter(event => event.eventType === filter);
  };

  // Generate calendar events
  const getCalendarEvents = () => {
    return getFilteredEvents().map(event => ({
      id: event.id,
      title: event.title,
      start: event.startDate,
      end: event.endDate,
      extendedProps: {
        ...event
      },
      backgroundColor: getEventTypeColor(event.eventType),
      borderColor: getEventTypeColor(event.eventType),
    }));
  };

  // Get color based on event type
  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'webinar':
        return '#3b82f6'; // blue
      case 'workshop':
        return '#10b981'; // green
      case 'seminar':
        return '#8b5cf6'; // purple
      case 'training':
        return '#f59e0b'; // yellow
      case 'meeting':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const getBadgeColor = (eventType: string) => {
    switch (eventType) {
      case 'webinar':
        return 'bg-blue-100 text-blue-800';
      case 'workshop':
        return 'bg-green-100 text-green-800';
      case 'seminar':
        return 'bg-purple-100 text-purple-800';
      case 'training':
        return 'bg-yellow-100 text-yellow-800';
      case 'meeting':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle calendar event click
  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id;
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setShowEventDetails(true);
    }
  };

  // Load events on component mount
  useEffect(() => {
    if (session?.user) {
      fetchEvents();
    }
  }, [session]);

  // Ensure user is accessing their own dashboard
  useEffect(() => {
    if (session?.user && session.user.id !== params.userId) {
      router.replace(`/hr-dashboard/${session.user.id}/events/manage`);
    }
  }, [session, params.userId, router]);

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
            <p>Only HR personnel or administrators can manage events.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.back()}>Return</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Health Events</h1>
          <p className="text-muted-foreground">
            View, organize, and manage company-sponsored health events
          </p>
        </div>
        
        <div className="flex gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="webinar">Webinars</SelectItem>
              <SelectItem value="workshop">Workshops</SelectItem>
              <SelectItem value="seminar">Seminars</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => router.push(`/hr-dashboard/${params.userId}/events/create`)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Event
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="calendar" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="stats">Registration Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Event Calendar</CardTitle>
              <CardDescription>
                View all events in calendar format. Click on an event to see details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[600px] flex items-center justify-center">
                  <p>Loading calendar...</p>
                </div>
              ) : error ? (
                <div className="h-[600px] flex items-center justify-center text-destructive">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              ) : (
                <div className="h-[600px]">
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={getCalendarEvents()}
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,dayGridWeek'
                    }}
                    eventClick={handleEventClick}
                    height="600px"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Event List</CardTitle>
              <CardDescription>
                View and manage all events in a list format
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-8 text-center">Loading events...</div>
              ) : error ? (
                <div className="py-8 text-center text-destructive">
                  <AlertCircle className="h-5 w-5 inline-block mr-2" />
                  {error}
                </div>
              ) : getFilteredEvents().length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No events found. Create new events to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>A list of all health events</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Registrations</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredEvents().map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>
                            <Badge className={getBadgeColor(event.eventType)}>
                              {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(event.startDate)}</TableCell>
                          <TableCell>{event.location || 'Online'}</TableCell>
                          <TableCell>
                            <span className="font-medium">{event.registrationCount}</span>
                            {event.maxAttendees !== "Unlimited" && (
                              <span className="text-muted-foreground"> / {event.maxAttendees}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Info className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setSelectedEvent(event);
                                  setShowEventDetails(true);
                                }}>
                                  <Info className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/hr-dashboard/${params.userId}/events/edit/${event.id}`)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Event
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    setDeleteConfirmOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Event
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Registration Statistics</CardTitle>
              <CardDescription>
                View registration statistics for all events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-8 text-center">Loading statistics...</div>
              ) : error ? (
                <div className="py-8 text-center text-destructive">
                  <AlertCircle className="h-5 w-5 inline-block mr-2" />
                  {error}
                </div>
              ) : getFilteredEvents().length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No events found. Create new events to view statistics.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getFilteredEvents().map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge className={getBadgeColor(event.eventType)}>
                          {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                        </Badge>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">{formatDate(event.startDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm font-medium">{event.registrationCount}</span>
                            {event.maxAttendees !== "Unlimited" && (
                              <span className="text-sm text-muted-foreground"> / {event.maxAttendees}</span>
                            )}
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-primary h-full" 
                              style={{ 
                                width: event.maxAttendees !== "Unlimited" 
                                  ? `${Math.min(100, (event.registrationCount / (event.maxAttendees as number)) * 100)}%` 
                                  : `100%`,
                                opacity: event.maxAttendees !== "Unlimited" ? 1 : 0.5
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.maxAttendees !== "Unlimited" 
                              ? `${event.registrationCount} of ${event.maxAttendees} spots filled`
                              : `${event.registrationCount} registrations (unlimited capacity)`
                            }
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowEventDetails(true);
                          }}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Event Details Dialog */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="max-w-2xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  <Badge className={`mt-2 ${getBadgeColor(selectedEvent.eventType)}`}>
                    {selectedEvent.eventType.charAt(0).toUpperCase() + selectedEvent.eventType.slice(1)}
                  </Badge>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Start: {formatDate(selectedEvent.startDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>End: {formatDate(selectedEvent.endDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Location: {selectedEvent.location || 'Online'}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>Registrations: {selectedEvent.registrationCount} {selectedEvent.maxAttendees !== "Unlimited" ? `/ ${selectedEvent.maxAttendees}` : ''}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {selectedEvent.description || 'No description provided.'}
                  </p>
                </div>
                
                {selectedEvent.registrationLink && (
                  <div>
                    <h4 className="font-medium mb-2">Registration Link</h4>
                    <div className="flex items-center">
                      <a 
                        href={selectedEvent.registrationLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {selectedEvent.registrationLink}
                      </a>
                    </div>
                  </div>
                )}
                
                {selectedEvent.resourceMaterials && selectedEvent.resourceMaterials.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Resource Materials</h4>
                    <div className="flex flex-col gap-2">
                      {selectedEvent.resourceMaterials.map((url, index) => (
                        <a 
                          key={index} 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Material {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/hr-dashboard/${params.userId}/events/edit/${selectedEvent.id}`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowEventDetails(false);
                    setDeleteConfirmOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Event
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {deleteError && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-destructive mr-2 flex-shrink-0" />
              <div className="text-destructive text-sm">{deleteError}</div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedEvent && deleteEvent(selectedEvent.id)}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete Event'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 