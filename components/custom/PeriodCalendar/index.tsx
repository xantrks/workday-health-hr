"use client";

// External dependencies
import { CalendarApi } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { format } from "date-fns";
import React, { useState, useEffect, useRef } from "react";

// Internal dependencies
import { CalendarLegend } from "./components/CalendarLegend";
import { CalendarStyles } from "./components/CalendarStyles";
import { renderTooltip } from "./components/CalendarTooltip";
import { PeriodCalendarProps } from "./types";
import {
  formatDateToISO,
  getRecordForDate,
  convertRecordsToEvents,
  applyRecordStyles
} from "./utils";

export function PeriodCalendar({
  records = [],
  onSelectDate,
  onAddRecord
}: PeriodCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);
  const [localRecords, setLocalRecords] = useState(records);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [initialized, setInitialized] = useState<boolean>(false);

  // Update local records when record data changes
  useEffect(() => {
    setLocalRecords(records);
  }, [records]);

  // Force refresh calendar after data changes or component mount
  useEffect(() => {
    // Ensure calendar reference exists and data is loaded
    if (calendarRef.current && localRecords.length > 0) {
      // Get calendar API
      const calendarApi = calendarRef.current.getApi();
      
      // Use setTimeout to ensure initial rendering is complete
      setTimeout(() => {
        // Only execute if calendar is already initialized and displayed
        if (calendarApi) {
          // First switch to previous month and then switch back, forcing re-rendering of cells
          if (!initialized) {
            calendarApi.prev();
            calendarApi.next();
            setInitialized(true);
          } else {
            // For subsequent data updates, just call refetchEvents
            calendarApi.refetchEvents();
          }
          
          // Additional processing: manually trigger application of styles for all currently visible date cells
          const dateElements = document.querySelectorAll('.fc-daygrid-day');
          if (dateElements.length > 0) {
            dateElements.forEach(el => {
              const dateAttr = el.getAttribute('data-date');
              if (dateAttr) {
                const date = new Date(dateAttr);
                const record = getRecordForDate(date, localRecords);
                if (record) {
                  applyRecordStyles(el as HTMLElement, record, onSelectDate, renderTooltip);
                }
              }
            });
          }
        }
      }, 100);
    }
  }, [localRecords, initialized, onSelectDate]);

  // Handle date click
  const handleDateClick = (info: any) => {
    const date = new Date(info.date);
    onSelectDate(date);
  };

  // Custom date cell render
  const dayCellDidMount = (info: any) => {
    const { date, el } = info;
    const record = getRecordForDate(date, localRecords);
    
    // If no record, return
    if (!record) return;
    
    // Apply styles
    applyRecordStyles(el, record, onSelectDate, renderTooltip);
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

  // Custom event rendering
  const eventContent = () => {
    return null; // Use background events, no content needed
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
        events={convertRecordsToEvents(localRecords)}
        eventContent={eventContent}
      />
      
      {/* Legend component */}
      <CalendarLegend />
      
      {/* Apply styles */}
      <CalendarStyles />
    </div>
  );
} 