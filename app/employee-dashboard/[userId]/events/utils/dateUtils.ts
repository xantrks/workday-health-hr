import { format, parseISO, isBefore, isAfter, isToday, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';

import { Event, CalendarDay, GroupedEvents } from '../types';

// 格式化日期
export const formatDate = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'MMM d, yyyy h:mm a');
};

// 仅格式化时间
export const formatTime = (dateString: string): string => {
  const date = parseISO(dateString);
  return format(date, 'h:mm a');
};

// 检查事件是否即将到来（7天内）
export const isUpcoming = (eventDate: string): boolean => {
  const date = parseISO(eventDate);
  const now = new Date();
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(now.getDate() + 7);
  
  return isAfter(date, now) && isBefore(date, sevenDaysLater);
};

// 检查事件是否已过期
export const isPast = (eventDate: string): boolean => {
  const date = parseISO(eventDate);
  const now = new Date();
  return isBefore(date, now) && !isToday(date);
};

// 获取当前月份的事件
export const getEventsForCurrentMonth = (events: Event[], currentDate: Date): Event[] => {
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

// 按日期分组事件
export const groupEventsByDate = (events: Event[], currentDate: Date): GroupedEvents => {
  const grouped: GroupedEvents = {};
  const monthEvents = getEventsForCurrentMonth(events, currentDate);
  
  monthEvents.forEach(event => {
    const dateKey = format(parseISO(event.startDate), 'yyyy-MM-dd');
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(event);
  });
  
  return grouped;
};

// 生成当前月份的日历天数
export const generateCalendarDays = (currentDate: Date): CalendarDay[] => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDay = monthStart.getDay(); // 0表示星期日，1表示星期一，以此类推
  
  // 获取当月的天数
  const daysInMonth = monthEnd.getDate();
  
  // 创建天数数组
  const days: CalendarDay[] = [];
  
  // 在月份第一天之前添加空格
  for (let i = 0; i < startDay; i++) {
    days.push({ date: null, isCurrentMonth: false });
  }
  
  // 添加当前月份的天数
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isToday(date),
      dateString: format(date, 'yyyy-MM-dd')
    });
  }
  
  // 如果需要，填充最后一个星期的剩余单元格
  const totalCells = Math.ceil(days.length / 7) * 7;
  const remainingCells = totalCells - days.length;
  
  for (let i = 0; i < remainingCells; i++) {
    days.push({ date: null, isCurrentMonth: false });
  }
  
  return days;
};

// 导航到上个月
export const goToPreviousMonth = (currentDate: Date): Date => {
  return subMonths(currentDate, 1);
};

// 导航到下个月
export const goToNextMonth = (currentDate: Date): Date => {
  return addMonths(currentDate, 1);
}; 