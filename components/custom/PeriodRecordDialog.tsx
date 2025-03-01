"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PeriodRecord } from "./PeriodCalendar";

const formSchema = z.object({
  date: z.date({
    required_error: "请选择日期",
  }),
  periodFlow: z.number().min(0).max(5).optional(),
  symptoms: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

const symptoms = [
  { id: "cramps", label: "腹痛" },
  { id: "headache", label: "头痛" },
  { id: "bloating", label: "腹胀" },
  { id: "fatigue", label: "疲劳" },
  { id: "mood", label: "情绪波动" },
  { id: "appetite", label: "食欲变化" },
  { id: "swelling", label: "水肿" },
];

const flowLevels = [
  { value: 1, label: "轻微" },
  { value: 2, label: "较轻" },
  { value: 3, label: "中等" },
  { value: 4, label: "较重" },
  { value: 5, label: "严重" },
];

interface PeriodRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  record?: PeriodRecord;
  onSave: (record: PeriodRecord) => void;
  onDelete?: (recordId: string) => void;
}

export function PeriodRecordDialog({
  open,
  onOpenChange,
  selectedDate,
  record,
  onSave,
  onDelete,
}: PeriodRecordDialogProps) {
  console.log("PeriodRecordDialog - Props:", { 
    open, 
    selectedDate: selectedDate ? selectedDate.toISOString() : null, 
    record 
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: selectedDate || new Date(),
      periodFlow: 0,
      symptoms: [],
      notes: "",
    },
  });

  // 当选中日期或记录变更时更新表单值
  useEffect(() => {
    console.log("PeriodRecordDialog - useEffect - selectedDate:", selectedDate ? format(selectedDate, "yyyy-MM-dd") : null);
    console.log("PeriodRecordDialog - useEffect - record:", record);
    
    if (selectedDate) {
      // 确保日期不受时区影响 - 使用UTC日期
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const day = selectedDate.getDate();
      
      // 创建一个新的日期对象，保留原始日期的年月日
      const localDate = new Date(year, month, day);
      localDate.setHours(0, 0, 0, 0);
      
      console.log("PeriodRecordDialog - Setting date:", format(localDate, "yyyy-MM-dd"));
      form.setValue("date", localDate);
    }

    if (record) {
      // 确保 periodFlow 有效，如果为 null 或 undefined，则设置为 0
      const periodFlow = record.periodFlow !== null && record.periodFlow !== undefined 
        ? record.periodFlow 
        : 0;
      
      console.log("PeriodRecordDialog - Setting periodFlow:", periodFlow);
      form.setValue("periodFlow", periodFlow);
      
      // 确保 symptoms 有效
      const symptoms = record.symptoms || [];
      console.log("PeriodRecordDialog - Setting symptoms:", symptoms);
      form.setValue("symptoms", symptoms);
      
      // 确保 notes 有效
      const notes = record.notes || "";
      console.log("PeriodRecordDialog - Setting notes:", notes);
      form.setValue("notes", notes);
    } else {
      // 如果没有记录，重置表单值
      console.log("PeriodRecordDialog - Resetting form values");
      form.setValue("periodFlow", 0);
      form.setValue("symptoms", []);
      form.setValue("notes", "");
    }
  }, [selectedDate, record, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("PeriodRecordDialog - onSubmit - values:", values);
    
    // 确保日期格式一致，不受时区影响
    const year = values.date.getFullYear();
    const month = values.date.getMonth();
    const day = values.date.getDate();
    
    // 格式化为YYYY-MM-DD
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const newRecord: PeriodRecord = {
      id: record?.id,
      date: formattedDate,
      periodFlow: values.periodFlow,
      symptoms: values.symptoms,
      notes: values.notes,
    };

    console.log("PeriodRecordDialog - onSubmit - newRecord:", newRecord);
    onSave(newRecord);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {record ? "编辑经期记录" : "添加经期记录"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>日期</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd")
                          ) : (
                            <span>选择日期</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="periodFlow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>经期流量</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择流量级别" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">无</SelectItem>
                      {flowLevels.map((level) => (
                        <SelectItem
                          key={level.value}
                          value={level.value.toString()}
                        >
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>备注</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="添加任何额外信息..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-between items-center">
              <div className="flex space-x-2">
                {record?.id && onDelete && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    删除
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  取消
                </Button>
              </div>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      
      {/* 删除确认对话框 */}
      {record?.id && onDelete && (
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>确认删除</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>您确定要删除这条经期记录吗？此操作无法撤销。</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                取消
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  onDelete(record.id as string);
                  setShowDeleteConfirm(false);
                  onOpenChange(false);
                }}
              >
                删除
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
} 