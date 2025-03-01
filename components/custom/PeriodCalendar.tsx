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

// 症状图标映射
const SYMPTOM_ICONS: Record<string, { icon: string; label: string; color: string }> = {
  cramps: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M8 13V9l-2 1"></path><path d="m2 7 4 2"></path><path d="M14 13V9l2 1"></path><path d="m22 7-4 2"></path><path d="M8 17a4 4 0 0 1 8 0"></path><path d="M17 12a5 5 0 0 0-10 0"></path></svg>`,
    label: "Cramps",
    color: "text-red-500 bg-red-100"
  },
  headache: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="8" r="6"></circle><path d="M12 14v8"></path><path d="M8 22h8"></path></svg>`,
    label: "Headache",
    color: "text-orange-500 bg-orange-100"
  },
  bloating: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M6.8 21.7a2.4 2.4 0 0 1 0-3.4l4.6-4.6a1 1 0 0 1 1.4 0l2.4 2.4a1 1 0 0 1 0 1.4l-4.6 4.6a2.4 2.4 0 0 1-3.4 0Z"></path><path d="m14.1 7.1 2.9 2.9"></path><path d="m21 2-6 6"></path><path d="M11.5 11.5 3 3"></path></svg>`,
    label: "Bloating",
    color: "text-blue-500 bg-blue-100"
  },
  fatigue: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><path d="M8 15h8"></path><path d="M9 9h.01"></path><path d="M15 9h.01"></path></svg>`,
    label: "Fatigue",
    color: "text-purple-500 bg-purple-100"
  },
  default: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`,
    label: "Symptoms",
    color: "text-indigo-500 bg-indigo-100"
  }
};

// 情绪图标映射
const MOOD_ICONS: Record<string, { icon: string; label: string; color: string }> = {
  happy: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
    label: "Happy",
    color: "text-green-500 bg-green-100"
  },
  sad: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
    label: "Sad",
    color: "text-blue-500 bg-blue-100"
  },
  irritated: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><path d="M8 15h8"></path><line x1="15" y1="9" x2="15.01" y2="9"></line><line x1="9" y1="9" x2="9.01" y2="9"></line></svg>`,
    label: "Irritated",
    color: "text-amber-500 bg-amber-100"
  },
  anxious: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="15" x2="16" y2="15"></line><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line><path d="M12 12v.01"></path></svg>`,
    label: "Anxious",
    color: "text-purple-500 bg-purple-100"
  },
  default: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
    label: "Mood",
    color: "text-yellow-500 bg-yellow-100"
  }
};

// 流量级别定义
const FLOW_LEVELS = [
  { value: 1, label: "Light Flow", color: "rgba(254, 226, 226, 0.8)", dotClass: "bg-red-400" },
  { value: 3, label: "Medium Flow", color: "rgba(254, 202, 202, 0.8)", dotClass: "bg-red-500" },
  { value: 5, label: "Heavy Flow", color: "rgba(252, 165, 165, 0.8)", dotClass: "bg-red-600" }
];

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

  // 获取一个症状数组的主要症状
  const getPrimarySymptom = (symptoms?: string[]): string => {
    if (!symptoms || symptoms.length === 0) return 'default';
    
    // 按优先级排序症状
    const prioritySymptoms = ['cramps', 'headache', 'bloating', 'fatigue'];
    
    for (const priority of prioritySymptoms) {
      if (symptoms.includes(priority)) {
        return priority;
      }
    }
    
    return symptoms[0] || 'default';
  };

  // 获取指定经期流量级别的样式
  const getFlowLevelStyle = (flowLevel?: number) => {
    if (!flowLevel || flowLevel <= 0) return null;
    
    if (flowLevel <= 1) {
      return FLOW_LEVELS[0];
    } else if (flowLevel <= 3) {
      return FLOW_LEVELS[1];
    } else {
      return FLOW_LEVELS[2];
    }
  };

  // 将样式应用逻辑抽离为独立函数以便复用
  const applyRecordStyles = (el: HTMLElement, record: PeriodRecord) => {
    // 找到日期单元格内的具体内容容器
    const dayNumberEl = el.querySelector('.fc-daygrid-day-top');
    const dayContentEl = el.querySelector('.fc-daygrid-day-frame');
    
    // 清除可能已存在的指示器，避免重复添加
    const existingIndicators = el.querySelectorAll('.flow-indicator, .symptom-indicator, .mood-indicator, .data-indicator');
    existingIndicators.forEach(indicator => indicator.remove());
    
    // 添加经期背景色 - 整个单元格
    if (record.periodFlow && record.periodFlow > 0) {
      // 添加基本样式类
      el.classList.add('period-day');
      
      // 获取流量级别样式
      const flowStyle = getFlowLevelStyle(record.periodFlow);
      if (flowStyle) {
        // 添加背景色
        el.style.backgroundColor = flowStyle.color;
        
        // 为日期数字添加明显的样式
        if (dayNumberEl) {
          dayNumberEl.classList.add('font-medium');
          
          const dateNum = dayNumberEl.querySelector('a');
          if (dateNum) {
            dateNum.style.color = '#e11d48'; // text-rose-600
          }
        }
        
        // 创建流量指示器容器
        const dataIndicator = document.createElement('div');
        dataIndicator.className = 'data-indicator absolute bottom-1 left-0 right-0 flex items-center justify-center gap-1';
        
        // 添加流量指示点
        let dots = '';
        const dotCount = Math.min(Math.ceil(record.periodFlow), 3);
        for (let i = 0; i < dotCount; i++) {
          dots += `<span class="inline-block w-1.5 h-1.5 rounded-full ${flowStyle.dotClass}"></span>`;
        }
        
        dataIndicator.innerHTML = dots;
        
        if (dayContentEl) {
          dayContentEl.appendChild(dataIndicator);
        }
      }
    }
    
    // 添加顶部数据指示栏
    const topIndicator = document.createElement('div');
    topIndicator.className = 'absolute top-1 right-1 flex items-center justify-end gap-1';
    
    let hasIndicators = false;
    
    // 添加症状图标
    if (record.symptoms && record.symptoms.length > 0) {
      const primarySymptom = getPrimarySymptom(record.symptoms);
      const symptomInfo = SYMPTOM_ICONS[primarySymptom] || SYMPTOM_ICONS.default;
      
      // 创建症状图标
      const symptomIcon = document.createElement('div');
      symptomIcon.className = `symptom-indicator w-5 h-5 flex items-center justify-center rounded-full ${symptomInfo.color}`;
      symptomIcon.setAttribute('title', `Symptoms: ${record.symptoms.join(', ')}`);
      symptomIcon.innerHTML = symptomInfo.icon;
      
      topIndicator.appendChild(symptomIcon);
      hasIndicators = true;
    }
    
    // 添加情绪指示图标
    if (record.mood && record.mood !== "none") {
      const moodInfo = MOOD_ICONS[record.mood] || MOOD_ICONS.default;
      
      // 创建情绪图标
      const moodIcon = document.createElement('div');
      moodIcon.className = `mood-indicator w-5 h-5 flex items-center justify-center rounded-full ${moodInfo.color}`;
      moodIcon.setAttribute('title', `Mood: ${moodInfo.label}`);
      moodIcon.innerHTML = moodInfo.icon;
      
      topIndicator.appendChild(moodIcon);
      hasIndicators = true;
    }
    
    // 只有存在指示器时才添加到DOM
    if (hasIndicators) {
      el.appendChild(topIndicator);
    }
    
    // 为单元格添加强调效果
    if (record.periodFlow || record.symptoms?.length || (record.mood && record.mood !== "none")) {
      el.classList.add('has-data');
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
        const flowStyle = getFlowLevelStyle(record.periodFlow);
        tooltipContent += `Flow: ${flowStyle?.label || 'Light'}\n`;
      }
      
      if (record.symptoms && record.symptoms.length > 0) {
        const symptomLabels = record.symptoms.map(s => {
          const symptom = SYMPTOM_ICONS[s] || SYMPTOM_ICONS.default;
          return symptom.label;
        });
        tooltipContent += `Symptoms: ${symptomLabels.join(", ")}\n`;
      }
      
      if (record.mood && record.mood !== "none") {
        const moodInfo = MOOD_ICONS[record.mood] || MOOD_ICONS.default;
        tooltipContent += `Mood: ${moodInfo.label}\n`;
      }
      
      if (record.sleepHours) {
        tooltipContent += `Sleep: ${record.sleepHours} hours\n`;
      }
      
      if (record.stressLevel) {
        tooltipContent += `Stress Level: ${record.stressLevel}/5\n`;
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
            <TooltipContent className="max-w-xs whitespace-pre-line period-tooltip">
              <div className="text-xs space-y-1">
                <h3 className="font-medium text-sm">{format(new Date(record.date), "MMMM d, yyyy")}</h3>
                <p className="whitespace-pre-line">{tooltipContent}</p>
                {record.id && (
                  <button 
                    onClick={() => onSelectDate(new Date(record.date))}
                    className="text-xs text-primary hover:underline mt-1 font-medium"
                  >
                    View Details
                  </button>
                )}
              </div>
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
        display: 'background',
        classNames: ['period-event'],
        backgroundColor: getFlowLevelStyle(record.periodFlow)?.color || 'rgba(254, 226, 226, 0.4)',
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
    return null; // 使用背景事件，不需要内容
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
      {/* 添加标题和帮助文本 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Period Calendar</h2>
        <div className="text-sm text-muted-foreground">
          Click on a day to add or edit period data
              </div>
            </div>
      
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
      
      {/* 重新设计的图例区域 */}
      <div className="mt-6 rounded-md border border-border bg-card p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-medium text-foreground">Calendar Legend</h3>
        
        <div className="space-y-4">
          {/* 流量图例 */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Period Flow</h4>
            <div className="grid grid-cols-3 gap-2">
              {FLOW_LEVELS.map((level, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded flex items-center justify-center`} style={{ backgroundColor: level.color }}>
                    {[...Array(idx + 1)].map((_, i) => (
                      <span key={i} className={`inline-block w-1 h-1 rounded-full mx-px ${level.dotClass}`}></span>
                    ))}
                  </div>
                  <span className="text-xs">{level.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* 症状图例 */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Common Symptoms</h4>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(SYMPTOM_ICONS)
                .filter(([key]) => key !== 'default')
                .map(([key, info]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${info.color}`} 
                         dangerouslySetInnerHTML={{ __html: info.icon }}></div>
                    <span className="text-xs">{info.label}</span>
                  </div>
              ))}
            </div>
          </div>
          
          {/* 情绪图例 */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Mood Indicators</h4>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(MOOD_ICONS)
                .filter(([key]) => key !== 'default')
                .map(([key, info]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${info.color}`} 
                         dangerouslySetInnerHTML={{ __html: info.icon }}></div>
                    <span className="text-xs">{info.label}</span>
        </div>
              ))}
        </div>
        </div>
        </div>
      </div>
      
      <style jsx global>{`
        .fc-day {
          position: relative;
          min-height: 54px !important;
          transition: transform 0.15s ease;
        }
        
        .fc-day-today {
          background-color: rgba(var(--accent) / 0.15) !important;
        }
        
        .has-data {
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
          z-index: 5;
        }
        
        .fc-day-number {
          padding: 5px !important;
        }
        
        .fc-day:hover {
          transform: scale(1.02);
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          cursor: pointer;
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
          background: transparent !important;
        }
        
        .fc-header-toolbar {
          margin-bottom: 1rem !important;
        }
        
        .fc-daygrid-day-frame {
          padding: 4px !important;
          min-height: 54px !important;
        }
        
        .data-indicator {
          z-index: 2;
        }
        
        /* 提高日历单元格中内容的可见性 */
        .fc .fc-daygrid-day-top {
          justify-content: center;
          padding-top: 4px;
        }
        
        /* 自定义组件样式 */
        .period-tooltip {
          border-radius: 0.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        /* 为小屏幕优化显示 */
        @media (max-width: 640px) {
          .fc-header-toolbar {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
} 