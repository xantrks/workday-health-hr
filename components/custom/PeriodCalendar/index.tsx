"use client";

// 外部依赖
import { CalendarApi } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { format } from "date-fns";
import React, { useState, useEffect, useRef } from "react";

// 内部依赖
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

  // 记录数据变更时更新本地记录
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
    
    // 应用样式
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

  // 自定义事件渲染
  const eventContent = () => {
    return null; // 使用背景事件，不需要内容
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
        events={convertRecordsToEvents(localRecords)}
        eventContent={eventContent}
      />
      
      {/* 图例组件 */}
      <CalendarLegend />
      
      {/* 应用样式 */}
      <CalendarStyles />
    </div>
  );
} 