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
  
  // Format date to ISO string for comparison
  const formatDateToISO = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  // Record the data when component mounts
  useEffect(() => {
    setLocalRecords(records);
  }, [records]);

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

  // Custom date cell render
  const dayCellDidMount = (info: any) => {
    const { date, el } = info;
    const record = getRecordForDate(date);
    
    // If no record, return
    if (!record) return;
    
    // Add base styles for period days
    if (record.periodFlow && record.periodFlow > 0) {
      el.classList.add('period-day');
      el.classList.add('bg-red-50');
      
      // Add indicator dot based on flow level
      const dot = document.createElement('div');
      dot.classList.add('absolute', 'bottom-1', 'left-1/2', '-translate-x-1/2', 'w-1.5', 'h-1.5', 'rounded-full');
      
      if (record.periodFlow <= 1) {
        dot.classList.add('bg-red-200');
      } else if (record.periodFlow <= 3) {
        dot.classList.add('bg-red-300');
      } else {
        dot.classList.add('bg-red-500');
      }
      
      el.appendChild(dot);
    }
    
    // Add symptoms indicator
    if (record.symptoms && record.symptoms.length > 0) {
      const symptomDot = document.createElement('div');
      symptomDot.classList.add('absolute', 'top-1', 'right-1', 'w-1', 'h-1', 'rounded-full', 'bg-blue-400');
      el.appendChild(symptomDot);
    }
    
    // Add tooltip with information
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
        
        .period-day .fc-daygrid-day-number {
          color: #f56565 !important;
        }
        
        .fc-event {
          border: none !important;
          border-radius: 4px !important;
        }
        
        .fc-header-toolbar {
          margin-bottom: 0.5rem !important;
        }
        
        .fc-daygrid-day-frame {
          padding: 4px !important;
        }
      `}</style>
    </div>
  );
} 