"use client";

import { format, parseISO, isSameDay } from "date-fns";
import { Plus } from "lucide-react";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export interface PeriodRecord {
  id?: string;
  date: string;
  periodFlow?: number;
  symptoms?: string[];
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

  // Custom date modifiers
  const modifiersStyles = {
    periodLight: {
      color: "inherit",
      position: "relative",
    },
    periodMedium: {
      color: "inherit",
      position: "relative",
    },
    periodHeavy: {
      color: "inherit",
      position: "relative",
    }
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
    }
  };

  return (
    <div className="relative p-1">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(selectedDate) => {
          if (selectedDate) {
            setDate(selectedDate);
            onSelectDate(selectedDate);
          }
        }}
        className="rounded-md border"
        modifiers={modifiers}
        modifiersClassNames={{
          periodLight: "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-red-200",
          periodMedium: "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-red-300",
          periodHeavy: "after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-red-500"
        }}
      />
      <Button 
        size="sm" 
        variant="outline" 
        className="absolute top-2 right-2" 
        onClick={onAddRecord}
      >
        <Plus className="h-4 w-4 mr-1" />
        <span>Add Record</span>
      </Button>
    </div>
  );
} 