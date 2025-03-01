"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";
import { PeriodRecord } from "./PeriodCalendar";

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  periodFlow: z.number().min(0).max(5).optional(),
  symptoms: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

const symptoms = [
  { id: "cramps", label: "Cramps" },
  { id: "headache", label: "Headache" },
  { id: "bloating", label: "Bloating" },
  { id: "fatigue", label: "Fatigue" },
  { id: "mood", label: "Mood Swings" },
  { id: "appetite", label: "Appetite Changes" },
  { id: "swelling", label: "Swelling" },
];

const flowLevels = [
  { value: 1, label: "Light" },
  { value: 2, label: "Moderate Light" },
  { value: 3, label: "Moderate" },
  { value: 4, label: "Moderate Heavy" },
  { value: 5, label: "Heavy" },
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

  // Update form values when selected date or record changes
  useEffect(() => {
    console.log("PeriodRecordDialog - useEffect - selectedDate:", selectedDate ? format(selectedDate, "yyyy-MM-dd") : null);
    console.log("PeriodRecordDialog - useEffect - record:", record);
    
    if (selectedDate) {
      // Ensure date is not affected by timezone - use UTC date
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const day = selectedDate.getDate();
      
      // Create a new date object, preserving the original date's year, month, and day
      const localDate = new Date(year, month, day);
      localDate.setHours(0, 0, 0, 0);
      
      console.log("PeriodRecordDialog - Setting date:", format(localDate, "yyyy-MM-dd"));
      form.setValue("date", localDate);
    }

    if (record) {
      // Ensure periodFlow is valid, if null or undefined, set to 0
      const periodFlow = record.periodFlow !== null && record.periodFlow !== undefined 
        ? record.periodFlow 
        : 0;
      
      console.log("PeriodRecordDialog - Setting periodFlow:", periodFlow);
      form.setValue("periodFlow", periodFlow);
      
      // Ensure symptoms are valid
      const symptoms = record.symptoms || [];
      console.log("PeriodRecordDialog - Setting symptoms:", symptoms);
      form.setValue("symptoms", symptoms);
      
      // Ensure notes are valid
      const notes = record.notes || "";
      console.log("PeriodRecordDialog - Setting notes:", notes);
      form.setValue("notes", notes);
    } else {
      // If no record, reset form values
      console.log("PeriodRecordDialog - Resetting form values");
      form.setValue("periodFlow", 0);
      form.setValue("symptoms", []);
      form.setValue("notes", "");
    }
  }, [selectedDate, record, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("PeriodRecordDialog - onSubmit - values:", values);
    
    // Ensure date format is consistent, not affected by timezone
    const year = values.date.getFullYear();
    const month = values.date.getMonth();
    const day = values.date.getDate();
    
    // Format as YYYY-MM-DD
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
            {record ? "Edit Period Record" : "Add Period Record"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
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
                            <span>Select date</span>
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
                  <FormLabel>Period Flow</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select flow level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">None</SelectItem>
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
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symptoms</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {symptoms.map((symptom) => (
                      <Button
                        key={symptom.id}
                        type="button"
                        variant={
                          field.value?.includes(symptom.id)
                            ? "default"
                            : "outline"
                        }
                        className={cn(
                          "justify-start",
                          field.value?.includes(symptom.id) &&
                            "bg-primary text-primary-foreground"
                        )}
                        onClick={() => {
                          const currentValues = field.value || [];
                          const newValues = currentValues.includes(symptom.id)
                            ? currentValues.filter((id) => id !== symptom.id)
                            : [...currentValues, symptom.id];
                          field.onChange(newValues);
                        }}
                      >
                        {symptom.label}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes here"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              {record?.id && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (showDeleteConfirm) {
                      onDelete(record.id as string);
                    } else {
                      setShowDeleteConfirm(true);
                    }
                  }}
                  className="mr-auto"
                >
                  {showDeleteConfirm ? "Confirm Delete" : "Delete"}
                </Button>
              )}
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      
      {/* Delete confirmation dialog */}
      {record?.id && onDelete && (
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to delete this period record? This operation cannot be undone.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  onDelete(record.id as string);
                  setShowDeleteConfirm(false);
                  onOpenChange(false);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
} 