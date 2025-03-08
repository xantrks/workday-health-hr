'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
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
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  MoreVertical
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href={`/hr-dashboard/${params.userId}?tab=resources`}>
          <Button variant="ghost" size="sm" className="group mb-4 pl-1 flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Health Events</h1>
            <p className="text-muted-foreground mt-1">Manage all scheduled health workshops and seminars</p>
          </div>
          <Button 
            onClick={() => router.push(`/hr-dashboard/${params.userId}/events/create`)}
            className="sm:self-start"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Event
          </Button>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="w-full max-w-md mx-auto">
          <TabsTrigger value="calendar" className="flex-1">Calendar View</TabsTrigger>
          <TabsTrigger value="list" className="flex-1">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="border border-muted rounded-md p-6">
          <div className="flex-1 bg-card rounded-md overflow-hidden">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
              events={getCalendarEvents()}
              eventClick={handleEventClick}
              height="auto"
              aspectRatio={1.35}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="list">
          <div className="grid gap-6">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading events...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="rounded-full bg-destructive/10 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <p className="text-destructive">{error}</p>
                <Button 
                  variant="outline" 
                  onClick={fetchEvents} 
                  className="mt-6"
                >
                  Try Again
                </Button>
              </div>
            ) : getFilteredEvents().length === 0 ? (
              <div className="text-center py-16">
                <div className="rounded-full bg-muted p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No events scheduled</p>
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/hr-dashboard/${params.userId}/events/create`)} 
                  className="mt-6"
                >
                  Create First Event
                </Button>
              </div>
            ) : (
              getFilteredEvents().map((event) => (
                <Card key={event.id} className="overflow-hidden border-muted shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className={`pb-3 ${getBadgeColor(event.eventType).background}`}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge variant="secondary" className={getBadgeColor(event.eventType).text}>
                          {event.eventType}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedEvent(event)}>
                            <Info className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/hr-dashboard/${params.userId}/events/edit/${event.id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Event</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedEvent(event);
                              setDeleteConfirmOpen(true);
                            }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Event</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p>{formatDate(event.startDate)}</p>
                          {event.endDate && event.endDate !== event.startDate && (
                            <p className="text-muted-foreground">To: {formatDate(event.endDate)}</p>
                          )}
                        </div>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.maxAttendees && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{event.registrationCount || 0} / {event.maxAttendees}</span>
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-4 pb-4 flex justify-between gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedEvent(event)}>
                      View Details
                    </Button>
                    {event.registrationLink && (
                      <Button size="sm" asChild>
                        <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Registration
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
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