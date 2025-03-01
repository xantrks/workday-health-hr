"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

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

  // 将日期格式化为 ISO 字符串，便于比较
  const formatDateToISO = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  // 记录组件挂载时的记录数据
  useEffect(() => {
    console.log("PeriodCalendar records:", records);
    setLocalRecords(records);
  }, [records]);

  // 查找特定日期是否有记录，如果有多条记录，返回最新的一条
  const getRecordForDate = (date: Date): PeriodRecord | undefined => {
    const formattedDate = formatDateToISO(date);
    console.log(`PeriodCalendar - getRecordForDate - Looking for records on ${formattedDate}`);
    
    // 找出所有匹配该日期的记录
    const matchingRecords = localRecords.filter(record => {
      // 确保记录日期格式一致
      const recordDate = typeof record.date === 'string' 
        ? record.date 
        : formatDateToISO(record.date as unknown as Date);
      
      // 直接比较字符串格式的日期，避免时区问题
      const isMatch = recordDate === formattedDate;
      console.log(`PeriodCalendar - Comparing record date ${recordDate} with ${formattedDate}: ${isMatch}`);
      return isMatch;
    });
    
    console.log(`PeriodCalendar - Found ${matchingRecords.length} matching records for date ${formattedDate}:`, matchingRecords);
    
    if (matchingRecords.length === 0) {
      console.log(`PeriodCalendar - No records found for date ${formattedDate}`);
      return undefined;
    }
    
    // 如果有多条记录，返回 periodFlow 不为 null 的记录
    // 如果都是 null 或都不是 null，则返回第一条（假设最新的记录在前面）
    const validRecord = matchingRecords.find(r => r.periodFlow !== null && r.periodFlow !== undefined && r.periodFlow > 0);
    
    if (validRecord) {
      console.log(`PeriodCalendar - Found valid record for date ${formattedDate}:`, validRecord);
      return validRecord;
    }
    
    console.log(`PeriodCalendar - Using first record for date ${formattedDate}:`, matchingRecords[0]);
    return matchingRecords[0];
  };

  // 自定义日期修饰符
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

  // 创建日期修饰符
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
        <span>添加记录</span>
      </Button>
    </div>
  );
} 