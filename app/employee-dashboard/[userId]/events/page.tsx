'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Calendar, 
  Users, 
  MapPin,
  Clock,
  ExternalLink,
  CheckCircle,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  maxAttendees: number | null;
  registrationLink: string | null;
  resourceMaterials: string[];
  createdAt: string;
  updatedAt: string;
  createdById: string;
}

// Define Registration interface
interface Registration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  attended: boolean;
}

export default function EmployeeEventsPage({ params }: { params: { userId: string } }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });
  const router = useRouter();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [filter, setFilter] = useState('all');
  const [registrationStatus, setRegistrationStatus] = useState<{
    eventId: string;
    status: 'loading' | 'success' | 'error';
    message?: string;
  } | null>(null);

  // Fetch events from the API
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/events');
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data);
      
      // Get user registrations
      await fetchUserRegistrations();
      
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user registrations
  const fetchUserRegistrations = async () => {
    try {
      const response = await fetch(`/api/users/${params.userId}/registrations`);
      
      if (!response.ok) {
        return; // Silently fail, don't show error
      }
      
      const data = await response.json();
      
      // Convert to a map of eventId -> true
      const regMap: Record<string, boolean> = {};
      data.forEach((reg: Registration) => {
        regMap[reg.eventId] = true;
      });
      
      setRegistrations(regMap);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };
  
  // Register for an event
  const registerForEvent = async (eventId: string) => {
    setRegistrationStatus({
      eventId,
      status: 'loading'
    });
    
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register for event');
      }
      
      // Update local state
      setRegistrations(prev => ({
        ...prev,
        [eventId]: true
      }));
      
      setRegistrationStatus({
        eventId,
        status: 'success',
        message: 'Successfully registered for event'
      });
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setRegistrationStatus(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error registering for event:', error);
      
      setRegistrationStatus({
        eventId,
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to register for event'
      });
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setRegistrationStatus(null);
      }, 5000);
    }
  };
  
  // Cancel registration
  const cancelRegistration = async (eventId: string) => {
    setRegistrationStatus({
      eventId,
      status: 'loading'
    });
    
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel registration');
      }
      
      // Update local state
      const newRegs = {...registrations};
      delete newRegs[eventId];
      setRegistrations(newRegs);
      
      setRegistrationStatus({
        eventId,
        status: 'success',
        message: 'Registration cancelled successfully'
      });
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setRegistrationStatus(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error cancelling registration:', error);
      
      setRegistrationStatus({
        eventId,
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to cancel registration'
      });
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setRegistrationStatus(null);
      }, 5000);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  // Filter events by type
  const getFilteredEvents = () => {
    return events.filter(event => {
      if (filter !== 'all' && event.eventType !== filter) {
        return false;
      }
      
      const eventStart = new Date(event.startDate);
      const now = new Date();
      
      if (activeTab === 'upcoming') {
        return eventStart >= now;
      } else {
        return eventStart < now;
      }
    });
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
      router.replace(`/employee-dashboard/${session.user.id}/events`);
    }
  }, [session, params.userId, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Health Events</h1>
          <p className="text-muted-foreground">
            Browse and register for menstrual and menopause health events
          </p>
        </div>
        
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
      </div>
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading events...</div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : getFilteredEvents().length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming events found. Check back later!
            </div>
          ) : (
            getFilteredEvents().map(event => (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Badge className="mr-2">
                          {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                        </Badge>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="mr-3">{formatDate(event.startDate)}</span>
                        
                        {event.location && (
                          <>
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Registration button or status */}
                    <div>
                      {registrationStatus?.eventId === event.id ? (
                        <div className={`flex items-center ${
                          registrationStatus.status === 'error' ? 'text-destructive' : 
                          registrationStatus.status === 'success' ? 'text-primary' : 
                          'text-muted-foreground'
                        }`}>
                          {registrationStatus.status === 'error' && <AlertCircle className="h-4 w-4 mr-1" />}
                          {registrationStatus.status === 'success' && <CheckCircle className="h-4 w-4 mr-1" />}
                          {registrationStatus.status === 'loading' ? 'Processing...' : registrationStatus.message}
                        </div>
                      ) : registrations[event.id] ? (
                        <Badge className="flex items-center gap-1 bg-primary/10">
                          <CheckCircle className="h-3 w-3" />
                          Registered
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pb-3">
                  <p className="text-muted-foreground">
                    {event.description || 'No description provided.'}
                  </p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>Duration: {Math.round((new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60))} hours</span>
                    </div>
                    
                    {event.maxAttendees && (
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Max Attendees: {event.maxAttendees}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <Separator />
                
                <CardFooter className="pt-4 flex justify-between">
                  <div className="space-x-2">
                    {event.registrationLink && (
                      <Button 
                        size="sm"
                        asChild
                      >
                        <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          External Registration
                        </a>
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    {registrations[event.id] ? (
                      <Button 
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        size="sm"
                        onClick={() => cancelRegistration(event.id)}
                        disabled={registrationStatus?.eventId === event.id && registrationStatus.status === 'loading'}
                      >
                        Cancel Registration
                      </Button>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => registerForEvent(event.id)}
                        disabled={registrationStatus?.eventId === event.id && registrationStatus.status === 'loading'}
                      >
                        Register
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading events...</div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : getFilteredEvents().length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No past events found.
            </div>
          ) : (
            getFilteredEvents().map(event => (
              <Card key={event.id} className="overflow-hidden opacity-80">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{event.title}</CardTitle>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Badge className="mr-2">
                          {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
                        </Badge>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="mr-3">{formatDate(event.startDate)}</span>
                        
                        {event.location && (
                          <>
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {registrations[event.id] && (
                      <Badge className="flex items-center gap-1 bg-primary/10">
                        <CheckCircle className="h-3 w-3" />
                        Attended
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground">
                    {event.description || 'No description provided.'}
                  </p>
                </CardContent>
                
                {event.resourceMaterials && event.resourceMaterials.length > 0 && (
                  <>
                    <Separator />
                    <CardFooter className="pt-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Event Materials:</h4>
                        <div className="flex flex-col space-y-1">
                          {event.resourceMaterials.map((url, index) => (
                            <a 
                              key={index} 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Material {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    </CardFooter>
                  </>
                )}
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 