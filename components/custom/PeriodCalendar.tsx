"use client";

import { format, parseISO, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import React, { useState, useEffect } from "react";

import { Calendar } from "@/components/ui/calendar";
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
  const [date, setDate] = useState<Date>(new Date());
  const [localRecords, setLocalRecords] = useState<PeriodRecord[]>([]);

  // Format date to ISO string for comparison
  const formatDateToISO = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  // Record the data when component mounts
  useEffect(() => {
    console.log("PeriodCalendar records:", records);
    setLocalRecords(records);
  }, [records]);

  // Find if a specific date has a record, if multiple records exist, return the latest one
  const getRecordForDate = (date: Date): PeriodRecord | undefined => {
    const formattedDate = formatDateToISO(date);
    console.log(`PeriodCalendar - getRecordForDate - Looking for records on ${formattedDate}`);
    
    // Find all records matching this date
    const matchingRecords = localRecords.filter(record => {
      // Ensure record date format is consistent
      const recordDate = typeof record.date === 'string' 
        ? record.date 
        : formatDateToISO(record.date as unknown as Date);
      
      // Compare string dates directly to avoid timezone issues
      const isMatch = recordDate === formattedDate;
      console.log(`PeriodCalendar - Comparing record date ${recordDate} with ${formattedDate}: ${isMatch}`);
      return isMatch;
    });
    
    console.log(`PeriodCalendar - Found ${matchingRecords.length} matching records for date ${formattedDate}:`, matchingRecords);
    
    if (matchingRecords.length === 0) {
      console.log(`PeriodCalendar - No records found for date ${formattedDate}`);
      return undefined;
    }
    
    // If multiple records exist, return the one with non-null periodFlow
    // If all are null or all are non-null, return the first one (assuming newest records are first)
    const validRecord = matchingRecords.find(r => r.periodFlow !== null && r.periodFlow !== undefined && r.periodFlow > 0);
    
    if (validRecord) {
      console.log(`PeriodCalendar - Found valid record for date ${formattedDate}:`, validRecord);
      return validRecord;
    }
    
    console.log(`PeriodCalendar - Using first record for date ${formattedDate}:`, matchingRecords[0]);
    return matchingRecords[0];
  };

  // Create date modifiers
  const modifiers = {
    periodLight: (date: Date) => {
      const record = getRecordForDate(date);
      const result = record?.periodFlow !== undefined && record.periodFlow > 0 && record.periodFlow <= 1;
      if (result) {
        console.log(`Date ${formatDateToISO(date)} has light flow`);
      }
      return result;
    },
    periodMedium: (date: Date) => {
      const record = getRecordForDate(date);
      const result = record?.periodFlow !== undefined && record.periodFlow > 1 && record.periodFlow <= 3;
      if (result) {
        console.log(`Date ${formatDateToISO(date)} has medium flow`);
      }
      return result;
    },
    periodHeavy: (date: Date) => {
      const record = getRecordForDate(date);
      const result = record?.periodFlow !== undefined && record.periodFlow > 3;
      if (result) {
        console.log(`Date ${formatDateToISO(date)} has heavy flow`);
      }
      return result;
    },
    hasSymptoms: (date: Date) => {
      const record = getRecordForDate(date);
      return record?.symptoms !== undefined && record.symptoms.length > 0;
    }
  };

  // Get calendar day content to show tooltips
  const getDayContent = (day: Date) => {
    const record = getRecordForDate(day);
    if (!record) return null;
    
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
    
    if (tooltipContent) {
      return (
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
    }
    
    return null;
  };

  return (
    <div className="relative">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(selectedDate) => {
          if (selectedDate) {
            setDate(selectedDate);
            onSelectDate(selectedDate);
          }
        }}
        className="rounded-md border shadow-sm"
        modifiers={modifiers}
        modifiersClassNames={{
          periodLight: "bg-red-50 relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-red-200",
          periodMedium: "bg-red-50 relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-red-300",
          periodHeavy: "bg-red-50 relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-red-500",
          hasSymptoms: "before:absolute before:top-1 before:right-1 before:w-1 before:h-1 before:rounded-full before:bg-blue-400"
        }}
        components={{
          DayContent: ({ date }) => (
            <div className="relative flex h-8 w-8 items-center justify-center p-0">
              <div className="absolute inset-0 flex items-center justify-center">
                {date.getDate()}
              </div>
              {getDayContent(date)}
            </div>
          )
        }}
        classNames={{
          month: "space-y-2",
          caption: "flex items-center justify-between px-2 py-1",
          caption_label: "flex items-center gap-2 font-medium text-sm",
          nav: "space-x-1 flex items-center",
          nav_button: "p-1 rounded-full hover:bg-gray-100 transition-colors",
          nav_button_previous: "h-4 w-4 text-gray-500",
          nav_button_next: "h-4 w-4 text-gray-500",
          table: "w-full border-collapse",
          head_row: "flex",
          head_cell: "w-9 font-normal text-[0.8rem] text-muted-foreground",
          row: "flex w-full mt-1",
          cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          day_range_end: "day-range-end",
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
        }}
        fromYear={2020}
        toYear={2030}
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
    </div>
  );
} 