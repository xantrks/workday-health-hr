import { Event, Registration } from "../types";

// 获取事件类型颜色
export const getEventTypeColor = (eventType: string): string => {
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

// 检查用户是否已注册事件
export const isRegistered = (eventId: string, registrations: Registration[]): boolean => {
  return registrations.some(reg => reg.eventId === eventId);
};

// 确定事件是否可以注册
export const isRegistrationAvailable = (event: Event): boolean => {
  const eventStart = new Date(event.startDate);
  const now = new Date();
  
  // 检查事件是否在未来或今天
  if (eventStart < now && !isSameDay(eventStart, now)) {
    return false;
  }
  
  // 检查事件是否已达到最大参与人数
  if (event.maxAttendees !== null && event.currentAttendees !== undefined) {
    return event.currentAttendees < event.maxAttendees;
  }
  
  return true;
};

// 辅助函数：检查两个日期是否是同一天
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
} 