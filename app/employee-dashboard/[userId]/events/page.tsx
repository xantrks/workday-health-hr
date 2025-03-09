'use client';

import { Calendar, List, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

import MonthCalendarView from './components/MonthCalendarView';
import ListCalendarView from './components/ListCalendarView';
import EventDetailsSheet from './components/EventDetailsSheet';
import EventLegend from './components/EventLegend';
import DashboardLayout from "../../components/DashboardLayout";
import { Event, Registration, CalendarViewType } from './types';
import * as api from './services/api';
import { isRegistered as checkIsRegistered } from './utils/eventUtils';
import { generateCalendarDays, groupEventsByDate, goToPreviousMonth, goToNextMonth } from './utils/dateUtils';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [calendarView, setCalendarView] = useState<CalendarViewType>('month');

  // 加载数据
  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session]);

  // 获取所有数据
  const fetchData = async () => {
    setLoading(true);
    
    // 获取事件数据
    const eventsData = await api.fetchEvents();
    setEvents(eventsData.events);
    setError(eventsData.error);
    
    // 获取用户注册信息
    if (params.userId) {
      const registrationsData = await api.fetchUserRegistrations(params.userId);
      setRegistrations(registrationsData);
    }
    
    setLoading(false);
  };

  // 注册事件
  const handleRegisterForEvent = async (eventId: string) => {
    if (!session?.user?.id) return;
    
    const success = await api.registerForEvent(eventId, session.user.id, (eventId) => {
      // 更新选定事件的参与者计数
      if (selectedEvent?.id === eventId) {
        setSelectedEvent({
          ...selectedEvent,
          currentAttendees: (selectedEvent.currentAttendees || 0) + 1
        });
      }
    });
    
    if (success) {
      // 刷新注册数据
      const registrationsData = await api.fetchUserRegistrations(params.userId);
      setRegistrations(registrationsData);
    }
  };

  // 取消注册
  const handleCancelRegistration = async (eventId: string) => {
    const success = await api.cancelRegistration(eventId, (eventId) => {
      // 更新选定事件的参与者计数
      if (selectedEvent?.id === eventId) {
        setSelectedEvent({
          ...selectedEvent,
          currentAttendees: Math.max(0, (selectedEvent.currentAttendees || 1) - 1)
        });
      }
    });
    
    if (success) {
      // 刷新注册数据
      const registrationsData = await api.fetchUserRegistrations(params.userId);
      setRegistrations(registrationsData);
    }
  };

  // 打开事件详情
  const openEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  // 检查用户是否已注册该事件
  const isRegistered = (eventId: string) => {
    return checkIsRegistered(eventId, registrations);
  };

  // 日历组件数据
  const calendarEvents = groupEventsByDate(events, currentDate);
  const calendarDays = generateCalendarDays(currentDate);

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
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(goToPreviousMonth(currentDate))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-medium w-40 text-center">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(goToNextMonth(currentDate))}>
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
        <EventLegend />

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
              <Button onClick={fetchData} variant="outline" className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <Card className="shadow-sm w-full">
            <CardContent className="p-0 overflow-hidden">
              {calendarView === 'month' ? (
                <MonthCalendarView 
                  calendarDays={calendarDays}
                  calendarEvents={calendarEvents}
                  isRegistered={isRegistered}
                  openEventDetails={openEventDetails}
                  filter={filter}
                />
              ) : (
                <ListCalendarView 
                  calendarEvents={calendarEvents}
                  isRegistered={isRegistered}
                  openEventDetails={openEventDetails}
                  filter={filter}
                />
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* 事件详情弹窗 */}
      <EventDetailsSheet 
        isOpen={isEventDetailsOpen}
        onOpenChange={setIsEventDetailsOpen}
        selectedEvent={selectedEvent}
        isRegistered={isRegistered}
        registerForEvent={handleRegisterForEvent}
        cancelRegistration={handleCancelRegistration}
      />
    </DashboardLayout>
  );
} 