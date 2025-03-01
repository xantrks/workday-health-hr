"use client";

// 外部依赖
import { format, parseISO } from "date-fns";
import { CalendarApi } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

// 内部依赖
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface PeriodRecord {
  id?: string;
  date: string;
  periodFlow?: number;
  symptoms?: string[];
  mood?: string;
  sleepHours: number;
  stressLevel: number;
  notes?: string;
}

interface PeriodCalendarProps {
  records: PeriodRecord[];
  onSelectDate: (date: Date) => void;
  onAddRecord: () => void;
}

export function PeriodCalendar({ 
  records = [], 
  onSelectDate, 
  onAddRecord 
}: PeriodCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [localRecords, setLocalRecords] = useState<PeriodRecord[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [initialized, setInitialized] = useState<boolean>(false);
  
  // Format date to ISO string for comparison
  const formatDateToISO = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  // Record the data when component mounts
  useEffect(() => {
    setLocalRecords(records);
  }, [records]);

  // 在数据变更或组件挂载后强制刷新日历
  useEffect(() => {
    // 确保日历引用存在且数据已加载
    if (calendarRef.current && localRecords.length > 0) {
      // 获取日历API
      const calendarApi = calendarRef.current.getApi();
      
      // 使用setTimeout让初始渲染完成
      setTimeout(() => {
        // 只有当日历已经初始化并显示时才执行
        if (calendarApi) {
          // 先切换到前一个月再切回来，强制重新渲染单元格
          if (!initialized) {
            calendarApi.prev();
            calendarApi.next();
            setInitialized(true);
          } else {
            // 对于后续的数据更新，只需要调用refetchEvents
            calendarApi.refetchEvents();
          }
          
          // 额外处理：手动触发所有当前可见日期单元格的样式应用
          const dateElements = document.querySelectorAll('.fc-daygrid-day');
          if (dateElements.length > 0) {
            dateElements.forEach(el => {
              const dateAttr = el.getAttribute('data-date');
              if (dateAttr) {
                const date = new Date(dateAttr);
                const record = getRecordForDate(date);
                if (record) {
                  applyRecordStyles(el as HTMLElement, record);
                }
              }
            });
          }
        }
      }, 100);
    }
  }, [localRecords, initialized]);

  // 将样式应用逻辑抽离为独立函数以便复用
  const applyRecordStyles = (el: HTMLElement, record: PeriodRecord) => {
    // 找到日期单元格内的具体内容容器
    const dayNumberEl = el.querySelector('.fc-daygrid-day-top');
    const dayContentEl = el.querySelector('.fc-daygrid-day-frame');
    
    // 清除可能已存在的指示器，避免重复添加
    const existingIndicators = el.querySelectorAll('.flow-indicator, .symptom-indicator, .mood-indicator');
    existingIndicators.forEach(indicator => indicator.remove());
    
    // 添加经期背景色 - 整个单元格
    if (record.periodFlow && record.periodFlow > 0) {
      // 添加基本样式类
      el.classList.add('period-day');
      
      // 根据经期流量设置不同的背景色
      if (record.periodFlow <= 1) {
        el.style.backgroundColor = 'rgba(254, 226, 226, 0.6)'; // 浅红色 bg-red-100 with opacity
      } else if (record.periodFlow <= 3) {
        el.style.backgroundColor = 'rgba(254, 202, 202, 0.6)'; // 中红色 bg-red-200 with opacity
      } else {
        el.style.backgroundColor = 'rgba(252, 165, 165, 0.6)'; // 深红色 bg-red-300 with opacity
      }
      
      // 为日期数字添加明显的样式
      if (dayNumberEl) {
        dayNumberEl.classList.add('font-medium');
        
        const dateNum = dayNumberEl.querySelector('a');
        if (dateNum) {
          dateNum.style.color = '#e11d48'; // text-rose-600
        }
      }
      
      // 添加流量指示图标
      const flowIndicator = document.createElement('div');
      flowIndicator.className = 'flow-indicator absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center justify-center';
      
      let flowDots = '';
      const dotBase = '<span class="inline-block w-1.5 h-1.5 rounded-full mx-0.5 bg-red-500"></span>';
      
      if (record.periodFlow <= 1) {
        flowDots = dotBase;
      } else if (record.periodFlow <= 3) {
        flowDots = dotBase + dotBase;
      } else {
        flowDots = dotBase + dotBase + dotBase;
      }
      
      flowIndicator.innerHTML = flowDots;
      
      if (dayContentEl) {
        dayContentEl.appendChild(flowIndicator);
      }
    }
    
    // 添加症状图标 - 使用实际图标替代点
    if (record.symptoms && record.symptoms.length > 0) {
      const symptomIndicator = document.createElement('div');
      symptomIndicator.className = 'symptom-indicator absolute top-1 right-1 flex items-center justify-center';
      
      // 创建症状图标
      const symptomIcon = document.createElement('div');
      symptomIcon.className = 'w-4 h-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-500';
      symptomIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
        <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zm0 4a1 1 0 011 1v1H9V7a1 1 0 011-1z" />
      </svg>`;
      
      symptomIndicator.appendChild(symptomIcon);
      el.appendChild(symptomIndicator);
    }
    
    // 添加情绪指示图标
    if (record.mood && record.mood !== "none") {
      const moodIndicator = document.createElement('div');
      moodIndicator.className = 'mood-indicator absolute top-1 left-1 flex items-center justify-center';
      
      // 情绪图标映射
      const moodIcons: Record<string, string> = {
        happy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clip-rule="evenodd" />
        </svg>`,
        sad: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clip-rule="evenodd" />
        </svg>`,
        angry: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clip-rule="evenodd" />
        </svg>`,
        default: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clip-rule="evenodd" />
        </svg>`
      };
      
      // 创建情绪图标
      const moodIcon = document.createElement('div');
      moodIcon.className = 'w-4 h-4 flex items-center justify-center rounded-full bg-amber-100 text-amber-500';
      moodIcon.innerHTML = moodIcons[record.mood] || moodIcons.default;
      
      moodIndicator.appendChild(moodIcon);
      el.appendChild(moodIndicator);
    }
    
    // 重新添加工具提示
    addTooltip(el, record);
  };
  
  // 工具提示添加函数
  const addTooltip = (el: HTMLElement, record: PeriodRecord) => {
    // 删除可能存在的旧工具提示
    const oldTooltip = el.querySelector('.period-tooltip-container');
    if (oldTooltip) {
      const oldElement = oldTooltip.querySelector('div');
      if (oldElement && (oldElement as any)._root) {
        (oldElement as any)._root.unmount();
      }
      oldTooltip.remove();
    }
    
    // 添加新工具提示
    if (record.periodFlow || (record.symptoms && record.symptoms.length > 0) || record.mood || record.notes) {
      const tooltipContainer = document.createElement('div');
      tooltipContainer.classList.add('period-tooltip-container', 'absolute', 'inset-0', 'z-10');
      
      // Create React tooltip component
      const tooltipElement = document.createElement('div');
      tooltipContainer.appendChild(tooltipElement);
      el.appendChild(tooltipContainer);
      
      // Generate tooltip content
      let tooltipContent = "";
      if (record.periodFlow && record.periodFlow > 0) {
        const flowLevel = record.periodFlow <= 1 ? "Light" : 
                         record.periodFlow <= 3 ? "Medium" : "Heavy";
        tooltipContent += `Flow: ${flowLevel}\n`;
      }
      
      if (record.symptoms && record.symptoms.length > 0) {
        tooltipContent += `Symptoms: ${record.symptoms.join(", ")}\n`;
      }
      
      if (record.mood && record.mood !== "none") {
        tooltipContent += `Mood: ${record.mood}\n`;
      }
      
      if (record.notes) {
        tooltipContent += `Notes: ${record.notes}`;
      }
      
      // Render React tooltip
      const tooltip = (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-full w-full"></div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs whitespace-pre-line">
              <p className="text-xs">{tooltipContent}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      
      // Use createRoot to render tooltip
      const root = createRoot(tooltipElement);
      root.render(tooltip);
      
      // Store root reference for cleanup
      (tooltipElement as any)._root = root;
    }
  };

  // Find record for a given date
  const getRecordForDate = (date: Date): PeriodRecord | undefined => {
    const formattedDate = formatDateToISO(date);
    
    // Find all records matching this date
    const matchingRecords = localRecords.filter(record => {
      // Ensure record date format is consistent
      const recordDate = typeof record.date === 'string' 
        ? record.date 
        : formatDateToISO(record.date as unknown as Date);
      
      // Compare string dates directly to avoid timezone issues
      return recordDate === formattedDate;
    });
    
    if (matchingRecords.length === 0) {
      return undefined;
    }
    
    // If multiple records exist, return the one with non-null periodFlow
    const validRecord = matchingRecords.find(r => r.periodFlow !== null && r.periodFlow !== undefined && r.periodFlow > 0);
    
    if (validRecord) {
      return validRecord;
    }
    
    return matchingRecords[0];
  };

  // Handle date click
  const handleDateClick = (info: any) => {
    const date = new Date(info.date);
    onSelectDate(date);
  };

  // 将经期记录转换为FullCalendar事件
  const convertRecordsToEvents = () => {
    return localRecords
      .filter(record => record.periodFlow && record.periodFlow > 0)
      .map(record => ({
        id: record.id || record.date,
        start: record.date,
        allDay: true,
        extendedProps: {
          periodFlow: record.periodFlow,
          symptoms: record.symptoms,
          mood: record.mood,
          notes: record.notes
        }
      }));
  };

  // 自定义事件渲染
  const eventContent = (eventInfo: any) => {
    const { periodFlow } = eventInfo.event.extendedProps;
    let bgColorClass = 'bg-red-100';
    
    if (periodFlow <= 1) {
      bgColorClass = 'bg-red-100';
    } else if (periodFlow <= 3) {
      bgColorClass = 'bg-red-200';
    } else {
      bgColorClass = 'bg-red-300';
    }
    
    return {
      html: `<div class="w-full h-full ${bgColorClass} rounded opacity-70"></div>`
    };
  };

  // Custom date cell render
  const dayCellDidMount = (info: any) => {
    const { date, el } = info;
    const record = getRecordForDate(date);
    
    // If no record, return
    if (!record) return;
    
    // 应用样式
    applyRecordStyles(el, record);
  };
  
  // Clean up tooltips when cell unmounts
  const dayCellWillUnmount = (info: any) => {
    const { el } = info;
    const tooltipContainer = el.querySelector('.period-tooltip-container');
    if (tooltipContainer) {
      const tooltipElement = tooltipContainer.firstChild;
      if (tooltipElement && (tooltipElement as any)._root) {
        (tooltipElement as any)._root.unmount();
      }
    }
  };
  
  // Change month handler
  const handleDatesSet = (arg: any) => {
    const calendarApi: CalendarApi = arg.view.calendar;
    const currentDate = calendarApi.getDate();
    setYear(currentDate.getFullYear());
    setMonth(currentDate.getMonth());
  };

  return (
    <div className="relative">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        dayMaxEvents={true}
        dateClick={handleDateClick}
        datesSet={handleDatesSet}
        dayCellDidMount={dayCellDidMount}
        dayCellWillUnmount={dayCellWillUnmount}
        height="auto"
        contentHeight="auto"
        fixedWeekCount={false}
        showNonCurrentDates={true}
        dayHeaderFormat={{ weekday: 'short' }}
        events={convertRecordsToEvents()}
        eventContent={eventContent}
      />
      
      <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-200"></span>
          <span>Light Flow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-300"></span>
          <span>Medium Flow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span>Heavy Flow</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-400"></span>
          <span>Symptoms</span>
        </div>
      </div>
      
      <style jsx global>{`
        .fc-day {
          position: relative;
          min-height: 48px !important;
        }
        
        .fc-day-today {
          background-color: rgba(var(--accent) / 0.3) !important;
        }
        
        .fc-day-number {
          padding: 5px !important;
        }
        
        .period-day {
          overflow: visible !important;
        }
        
        .period-day .fc-daygrid-day-number {
          color: #e11d48 !important;
          font-weight: 500;
        }
        
        .fc-event {
          border: none !important;
          border-radius: 4px !important;
          background: transparent !important;
        }
        
        .fc-header-toolbar {
          margin-bottom: 0.5rem !important;
        }
        
        .fc-daygrid-day-frame {
          padding: 4px !important;
          min-height: 45px !important;
        }
        
        .flow-indicator {
          z-index: 10;
        }
        
        /* 提高日历单元格中内容的可见性 */
        .fc .fc-daygrid-day-top {
          justify-content: center;
          padding-top: 4px;
        }
        
        /* 确保背景色在事件后面 */
        .fc .fc-daygrid-day-events {
          z-index: 2;
          position: relative;
        }
        
        /* 确保图标不被其他元素覆盖 */
        .fc .fc-daygrid-day-frame {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  );
} 