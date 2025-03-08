'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format, parseISO, isBefore, isAfter, isToday, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { 
  Calendar, 
  Users, 
  MapPin,
  Clock,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  PlusCircle,
  XCircle,
  Info,
  FileText,
  List
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import DashboardLayout from "../../components/DashboardLayout";

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
  currentAttendees?: number;
}

// Define Registration type
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
      router.replace('/login');
    },
  });
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<'month' | 'list'>('month');

  // Fetch events data
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
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events, please try again later');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user registrations
  const fetchUserRegistrations = async () => {
    try {
      if (!session?.user?.id) return;
      
      const response = await fetch(`/api/users/${params.userId}/registrations`);
      if (!response.ok) {
        console.log('Failed to fetch user registrations, status:', response.status);
        return;
      }
      
      const data = await response.json();
      setRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setRegistrations([]);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    if (session?.user) {
      fetchEvents();
      fetchUserRegistrations();
    }
  }, [session]);

  // Register for an event
  const registerForEvent = async (eventId: string) => {
    try {
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          userId: session?.user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register for event');
      }

      // Update registrations
      await fetchUserRegistrations();
      
      // Success message
      toast.success('Successfully registered for the event');
      
      // Close event details sheet if it's open and update attendee count
      if (selectedEvent?.id === eventId) {
        setSelectedEvent({
          ...selectedEvent,
          currentAttendees: (selectedEvent.currentAttendees || 0) + 1
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error((error as Error).message || 'Failed to register for event');
    }
  };

  // Cancel registration for an event
  const cancelRegistration = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel registration');
      }

      // Update registrations
      await fetchUserRegistrations();
      
      // Success message
      toast.success('Registration cancelled successfully');
      
      // Update selected event if it's the current one
      if (selectedEvent?.id === eventId) {
        setSelectedEvent({
          ...selectedEvent,
          currentAttendees: Math.max(0, (selectedEvent.currentAttendees || 1) - 1)
        });
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      toast.error((error as Error).message || 'Failed to cancel registration');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  };
  
  // Format time only
  const formatTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'h:mm a');
  };

  // Check if user is registered for an event
  const isRegistered = (eventId: string) => {
    return registrations.some(reg => reg.eventId === eventId);
  };

  // Check if event is upcoming
  const isUpcoming = (eventDate: string) => {
    const date = parseISO(eventDate);
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);
    
    return isAfter(date, now) && isBefore(date, sevenDaysLater);
  };

  // Check if event is past
  const isPast = (eventDate: string) => {
    const date = parseISO(eventDate);
    const now = new Date();
    return isBefore(date, now) && !isToday(date);
  };

  // Get color for event type
  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'webinar':
        return 'bg-blue-500';
      case 'workshop':
        return 'bg-purple-500';
      case 'seminar':
        return 'bg-green-500';
      case 'training':
        return 'bg-amber-500';
      case 'meeting':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get events for the current month
  const getEventsForCurrentMonth = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    
    return events.filter(event => {
      const eventStart = parseISO(event.startDate);
      return (
        (isAfter(eventStart, monthStart) || isToday(monthStart)) &&
        (isBefore(eventStart, monthEnd) || isToday(monthEnd))
      );
    });
  };

  // Group events by date for calendar view
  const groupEventsByDate = () => {
    const grouped: Record<string, Event[]> = {};
    const monthEvents = getEventsForCurrentMonth();
    
    monthEvents.forEach(event => {
      const dateKey = format(parseISO(event.startDate), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    
    return grouped;
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDay = monthStart.getDay(); // 0 for Sunday, 1 for Monday, etc.
    
    // Get the number of days in the month
    const daysInMonth = monthEnd.getDate();
    
    // Create array of days
    const days = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startDay; i++) {
      days.push({ date: null, isCurrentMonth: false });
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isToday(date),
        dateString: format(date, 'yyyy-MM-dd')
      });
    }
    
    // Fill the remaining cells of the last week if needed
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remainingCells = totalCells - days.length;
    
    for (let i = 0; i < remainingCells; i++) {
      days.push({ date: null, isCurrentMonth: false });
    }
    
    return days;
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };

  // Open event details
  const openEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  // Determine if registration is available for an event
  const isRegistrationAvailable = (event: Event) => {
    const eventStart = parseISO(event.startDate);
    const now = new Date();
    
    // Check if event is in the future or today
    if (isBefore(eventStart, now) && !isToday(eventStart)) {
      return false;
    }
    
    // Check if event has reached max attendees
    if (event.maxAttendees !== null && event.currentAttendees !== undefined) {
      return event.currentAttendees < event.maxAttendees;
    }
    
    return true;
  };

  // Calendar components
  const calendarEvents = groupEventsByDate();
  const calendarDays = generateCalendarDays();

  return (
    <DashboardLayout
      userId={params.userId}
      title="Health Events Calendar" 
      description="View, register and manage your health-related events"
    >
      <div className="flex flex-col space-y-6">
        {/* 日历视图控制和过滤器 */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-medium w-40 text-center">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="webinar">Webinars</SelectItem>
                  <SelectItem value="workshop">Workshops</SelectItem>
                  <SelectItem value="seminar">Seminars</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="meeting">Meetings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setCalendarView('month')} 
                className={calendarView === 'month' ? 'bg-muted' : ''}
              >
                <Calendar className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setCalendarView('list')} 
                className={calendarView === 'list' ? 'bg-muted' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 图例说明 */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Webinar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Workshop</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Seminar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Training</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Meeting</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-5 flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-primary" />
              <span>Registered</span>
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="h-5 flex items-center gap-1">
              <span>Upcoming</span>
            </Badge>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
              <p className="text-destructive">{error}</p>
              <Button onClick={fetchEvents} variant="outline" className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <Card className="shadow-sm w-full">
            <CardContent className="p-0 overflow-hidden">
              {calendarView === 'month' ? (
                <div className="rounded-md border overflow-hidden w-full">
                  {/* 日历头部 - 星期几 */}
                  <div className="grid grid-cols-7 bg-muted text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="py-2 text-sm font-medium">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* 日历主体 - 日期和事件 */}
                  <div className="grid grid-cols-7">
                    {calendarDays.map((day, index) => (
                      <div 
                        key={index} 
                        className={`h-[140px] border-t border-r p-1 ${
                          !day.isCurrentMonth 
                            ? 'bg-muted/40 text-muted-foreground' 
                            : day.isToday 
                              ? 'bg-primary/5' 
                              : ''
                        }`}
                      >
                        {day.date && (
                          <>
                            <div className={`text-right text-xs p-1 font-medium ${
                              day.isToday ? 'text-primary' : ''
                            }`}>
                              {format(day.date, 'd')}
                            </div>
                            
                            {/* 当天的事件 */}
                            <div className="space-y-1 mt-1 overflow-y-auto max-h-[110px]">
                              {day.dateString && calendarEvents[day.dateString]?.filter(e => 
                                filter === 'all' || e.eventType === filter
                              ).map((eventItem: Event) => {
                                const registered = isRegistered(eventItem.id);
                                const upcoming = isUpcoming(eventItem.startDate);
                                const past = isPast(eventItem.startDate);
                                
                                return (
                                  <button
                                    key={eventItem.id}
                                    onClick={() => openEventDetails(eventItem)}
                                    className={`w-full text-left rounded px-2 py-1 text-xs truncate text-white relative
                                      ${getEventTypeColor(eventItem.eventType)}
                                      ${past ? 'opacity-60' : ''}
                                      hover:opacity-90 transition-opacity
                                    `}
                                  >
                                    <div className="flex items-center gap-1">
                                      {format(parseISO(eventItem.startDate), 'h:mm a')}
                                      {registered && (
                                        <CheckCircle className="h-3 w-3 ml-1" />
                                      )}
                                    </div>
                                    <div className="truncate pr-2">
                                      {eventItem.title}
                                      {upcoming && !registered && (
                                        <Badge variant="secondary" className="ml-1 text-[9px] px-1 py-0 h-3">new</Badge>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {Object.entries(calendarEvents)
                    .sort()
                    .filter(([_, dayEvents]) => 
                      dayEvents.some(e => filter === 'all' || e.eventType === filter)
                    )
                    .map(([dateKey, dayEvents]) => (
                      <div key={dateKey} className="space-y-2">
                        <h4 className="font-medium text-sm flex items-center">
                          {format(parseISO(dateKey), 'EEEE, MMMM d')}
                          {isToday(parseISO(dateKey)) && (
                            <Badge variant="secondary" className="ml-2">Today</Badge>
                          )}
                        </h4>
                        <div className="space-y-1 pl-4">
                          {dayEvents
                            .filter(e => filter === 'all' || e.eventType === filter)
                            .map((eventItem: Event) => {
                              const registered = isRegistered(eventItem.id);
                              const upcoming = isUpcoming(eventItem.startDate);
                              const past = isPast(eventItem.startDate);
                              
                              return (
                                <div 
                                  key={eventItem.id}
                                  onClick={() => openEventDetails(eventItem)}
                                  className={`flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer ${past ? 'opacity-60' : ''}`}
                                >
                                  <div className={`w-2 h-2 rounded-full ${getEventTypeColor(eventItem.eventType)}`}></div>
                                  <div className="text-sm font-medium flex items-center gap-1">
                                    {eventItem.title}
                                    {upcoming && !registered && (
                                      <Badge variant="secondary" className="ml-1 text-[10px] px-1">new</Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {format(parseISO(eventItem.startDate), 'h:mm a')} - {format(parseISO(eventItem.endDate), 'h:mm a')}
                                  </div>
                                  {registered && (
                                    <Badge variant="outline" className="flex items-center gap-1 ml-auto">
                                      <CheckCircle className="h-3 w-3 text-primary" />
                                      Registered
                                    </Badge>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* 事件详情弹窗 */}
      <Sheet open={isEventDetailsOpen} onOpenChange={setIsEventDetailsOpen}>
        <SheetContent className="sm:max-w-lg w-full">
          <SheetHeader>
            <SheetTitle>Event Details</SheetTitle>
          </SheetHeader>
          
          <div className="h-[calc(100vh-180px)] mt-4 overflow-y-auto pr-4">
            {selectedEvent && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{selectedEvent.eventType}</Badge>
                    {isRegistered(selectedEvent.id) && (
                      <Badge className="bg-primary/10 text-primary">Registered</Badge>
                    )}
                    {isUpcoming(selectedEvent.startDate) && !isRegistered(selectedEvent.id) && (
                      <Badge variant="secondary">Upcoming</Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <div>{formatDate(selectedEvent.startDate)}</div>
                      <div className="text-muted-foreground">to {formatTime(selectedEvent.endDate)}</div>
                    </div>
                  </div>
                  
                  {selectedEvent.location && (
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                  
                  {selectedEvent.maxAttendees && (
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {selectedEvent.currentAttendees !== undefined 
                          ? `${selectedEvent.currentAttendees}/${selectedEvent.maxAttendees} attendees` 
                          : 'Limited capacity'}
                      </span>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {selectedEvent.description || 'No description available.'}
                  </p>
                </div>
                
                {selectedEvent.resourceMaterials && selectedEvent.resourceMaterials.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Resources & Materials</h4>
                      <div className="space-y-2">
                        {selectedEvent.resourceMaterials.map((resource, index) => (
                          <div key={index} className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            <a 
                              href={resource} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center"
                            >
                              Material {index + 1}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {selectedEvent.registrationLink && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">External Registration</h4>
                      <a 
                        href={selectedEvent.registrationLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center"
                      >
                        Register on external platform
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          
          <SheetFooter className="flex flex-col sm:flex-row gap-3 mt-6">
            <SheetClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Close
              </Button>
            </SheetClose>
            
            {selectedEvent && (isRegistered(selectedEvent.id) ? (
              <Button 
                className="w-full sm:w-auto"
                variant="default"
                onClick={() => cancelRegistration(selectedEvent.id)}
                disabled={isPast(selectedEvent.startDate)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Registration
              </Button>
            ) : (
              <Button 
                className="w-full sm:w-auto"
                onClick={() => registerForEvent(selectedEvent.id)}
                disabled={!isRegistrationAvailable(selectedEvent)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Register for Event
              </Button>
            ))}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
} 