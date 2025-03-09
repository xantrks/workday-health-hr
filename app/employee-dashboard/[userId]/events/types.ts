// 定义事件类型接口
export interface Event {
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

// 定义注册类型
export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  attended: boolean;
}

// 定义事件过滤器类型
export type EventFilter = 'all' | 'webinar' | 'workshop' | 'seminar' | 'training' | 'meeting';

// 定义日历视图类型
export type CalendarViewType = 'month' | 'list';

// 定义日历日期项目类型
export interface CalendarDay {
  date: Date | null;
  isCurrentMonth: boolean;
  isToday?: boolean;
  dateString?: string;
}

// 定义分组事件类型
export interface GroupedEvents {
  [dateKey: string]: Event[];
} 