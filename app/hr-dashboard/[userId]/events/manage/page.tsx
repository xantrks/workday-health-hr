'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import FullCalendar from '@fullcalendar/react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Event, EventFilter } from './types';
import { fetchEvents, deleteEvent as deleteEventService } from './services';
import { filterEvents } from './utils';

import HeaderSection from './components/HeaderSection';
import CalendarView, { CalendarRef } from './components/CalendarView';
import ListView from './components/ListView';
import EventDetailsDialog from './components/EventDetailsDialog';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';
import UnauthorizedView from './components/UnauthorizedView';
import LoadingView from './components/LoadingView';

export default function ManageEventsPage({ params }: { params: { userId: string } }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });
  const router = useRouter();
  const calendarRef = useRef<CalendarRef | null>(null);
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('calendar');
  const [filter, setFilter] = useState<EventFilter>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Load events
  const loadEvents = async () => {
    setLoading(true);
    const result = await fetchEvents();
    setEvents(result.events);
    setError(result.error);
    setLoading(false);
  };

  // Handle delete event
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    
    setDeleteLoading(true);
    setDeleteError(null);
    
    const result = await deleteEventService(selectedEvent.id);
    
    if (result.success) {
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setDeleteConfirmOpen(false);
      setSelectedEvent(null);
      setShowEventDetails(false);
    } else {
      setDeleteError(result.error);
    }
    
    setDeleteLoading(false);
  };

  // Handle view event details
  const handleViewEventDetails = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setShowEventDetails(true);
    }
  };

  // Navigate to create event page
  const handleCreateEvent = () => {
    router.push(`/hr-dashboard/${params.userId}/events/create`);
  };

  // Load events on component mount
  useEffect(() => {
    if (session?.user) {
      loadEvents();
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
    return <UnauthorizedView />;
  }

  if (status === 'loading') {
    return <LoadingView />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <HeaderSection 
        userId={params.userId} 
        onCreateEvent={handleCreateEvent} 
      />

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="w-full max-w-md mx-auto">
          <TabsTrigger value="calendar" className="flex-1">Calendar View</TabsTrigger>
          <TabsTrigger value="list" className="flex-1">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="border border-muted rounded-md p-6">
          <CalendarView
            ref={calendarRef}
            events={events}
            filter={filter}
            onEventClick={handleViewEventDetails}
          />
        </TabsContent>
        
        <TabsContent value="list">
          <ListView 
            events={events}
            loading={loading}
            error={error}
            filter={filter}
            userId={params.userId}
            onCreateEvent={handleCreateEvent}
            onRetry={loadEvents}
            onViewDetails={(event) => {
              setSelectedEvent(event);
              setShowEventDetails(true);
            }}
            onDeleteClick={(event) => {
              setSelectedEvent(event);
              setDeleteConfirmOpen(true);
            }}
          />
        </TabsContent>
      </Tabs>
      
      {/* Event Details Dialog */}
      <EventDetailsDialog 
        open={showEventDetails}
        onOpenChange={setShowEventDetails}
        event={selectedEvent}
        userId={params.userId}
        onDelete={() => {
          setShowEventDetails(false);
          setDeleteConfirmOpen(true);
        }}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog 
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteEvent}
        loading={deleteLoading}
        error={deleteError}
      />
    </div>
  );
} 