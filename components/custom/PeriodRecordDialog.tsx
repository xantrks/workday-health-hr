"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { AlertTriangle, CalendarIcon, CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Input } from "@/components/ui/input";
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
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

import { PeriodRecord } from "./PeriodCalendar";

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  periodFlow: z.number().min(0).max(5).optional(),
  symptoms: z.array(z.string()).optional(),
  mood: z.string().optional(),
  sleepHours: z.number().min(0).max(24).default(0),
  stressLevel: z.number().min(0).max(10).default(0),
  notes: z.string().optional(),
});

const symptoms = [
  { id: "cramps", label: "Cramps", icon: "💫" },
  { id: "headache", label: "Headache", icon: "🤕" },
  { id: "bloating", label: "Bloating", icon: "🫨" },
  { id: "fatigue", label: "Fatigue", icon: "😮‍💨" },
  { id: "mood", label: "Mood Swings", icon: "🎭" },
  { id: "appetite", label: "Appetite Changes", icon: "🍴" },
  { id: "swelling", label: "Swelling", icon: "🫠" },
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const [isSaveError, setIsSaveError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Enforce ensure selected date is set (solving today's date issue)
  const ensuredSelectedDate = selectedDate || new Date();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: ensuredSelectedDate,
      periodFlow: 0,
      symptoms: [],
      mood: "none",
      sleepHours: 0,
      stressLevel: 0,
      notes: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      console.log("PeriodRecordDialog - Dialog opened, resetting form");
      
      // Ensure date is set
      if (selectedDate) {
        form.setValue("date", selectedDate);
        console.log("PeriodRecordDialog - Form date set on dialog open:", selectedDate);
      } else {
        // If no date provided, set to today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        form.setValue("date", today);
        console.log("PeriodRecordDialog - No date provided, using today:", today);
      }
    }
  }, [open, selectedDate, form]);

  // Update form values when selected date or record changes
  useEffect(() => {
    console.log("PeriodRecordDialog - useEffect - selectedDate:", selectedDate ? format(selectedDate, "yyyy-MM-dd") : null);
    console.log("PeriodRecordDialog - useEffect - form.date:", form.getValues("date") ? format(form.getValues("date"), "yyyy-MM-dd") : "no date");
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
      
      // Explicitly trigger validation to ensure date is correctly validated
      setTimeout(() => form.trigger("date"), 0);
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
      
      // Set mood value
      if (record.mood) {
        console.log("PeriodRecordDialog - Setting mood:", record.mood.toString());
        form.setValue("mood", record.mood.toString());
      }
      
      // Set sleepHours value - ensure correct handling even if null or undefined
      const sleepHours = record.sleepHours !== null && record.sleepHours !== undefined 
        ? Number(record.sleepHours) 
        : 0;
      console.log("PeriodRecordDialog - Setting sleepHours:", sleepHours);
      form.setValue("sleepHours", sleepHours);
      
      // Set stressLevel value - ensure correct handling even if null or undefined
      const stressLevel = record.stressLevel !== null && record.stressLevel !== undefined 
        ? Number(record.stressLevel) 
        : 0;
      console.log("PeriodRecordDialog - Setting stressLevel:", stressLevel);
      form.setValue("stressLevel", stressLevel);
      
      // Ensure notes are valid
      const notes = record.notes || "";
      console.log("PeriodRecordDialog - Setting notes:", notes);
      form.setValue("notes", notes);
    } else {
      // If no record, reset form values
      console.log("PeriodRecordDialog - Resetting form values");
      form.setValue("periodFlow", 0);
      form.setValue("symptoms", []);
      form.setValue("mood", "none");
      form.setValue("sleepHours", 0);
      form.setValue("stressLevel", 0);
      form.setValue("notes", "");
    }
  }, [selectedDate, record, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("PeriodRecordDialog - onSubmit - values:", values);
    
    // Reset states
    setIsSaveSuccess(false);
    setIsSaveError(false);
    setErrorMessage("");
    
    // Date validation - if no date value, use today's date
    if (!values.date) {
      console.log("PeriodRecordDialog - No date found, using today's date");
      values.date = new Date();
      values.date.setHours(0, 0, 0, 0);
    }
    
    // Clean the date value
    const dateObject = new Date(values.date);
    dateObject.setHours(0, 0, 0, 0);

    // Ensure numeric values are integers for database compatibility
    const sleepHours = typeof values.sleepHours === 'number' 
      ? Math.round(values.sleepHours) 
      : values.sleepHours;
      
    const stressLevel = typeof values.stressLevel === 'number' 
      ? Math.round(values.stressLevel) 
      : values.stressLevel;
      
    const periodFlow = typeof values.periodFlow === 'number' 
      ? Math.round(values.periodFlow) 
      : values.periodFlow;

    const newRecord = {
      id: record?.id,
      date: format(dateObject, "yyyy-MM-dd"),
      recordType: "period",
      periodFlow: periodFlow,
      symptoms: values.symptoms,
      mood: values.mood,
      sleepHours: sleepHours,
      stressLevel: stressLevel,
      notes: values.notes || "",
    };

    console.log("PeriodRecordDialog - onSubmit - newRecord:", newRecord);
    
    try {
      // First, save the record to ensure it gets saved to the calendar
      await onSave(newRecord);
      
      // Only show success UI after saving
      setIsSaveSuccess(true);
      
      // Show toast notification but don't close the dialog automatically
      // This gives the parent component time to process the save
      toast({
        title: record?.id ? "Record Updated" : "Record Created",
        description: `Your period record for ${format(values.date, "MMMM d, yyyy")} has been saved.`,
        variant: "default",
        duration: 3000,
      });
      
      // Close the dialog after showing success state for a moment
      setTimeout(() => {
        setIsSaveSuccess(false);
        onOpenChange(false);
      }, 1500); // Increased timeout to allow more time for saving
    } catch (error) {
      console.error("Error saving record:", error);
      setIsSaveError(true);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      
      toast({
        title: "Error Saving Record",
        description: "There was a problem saving your period record. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="pb-4 mb-2 border-b">
          <DialogTitle className="text-xl font-semibold">
            {record ? "Edit Period Record" : "Add Period Record"}
          </DialogTitle>
          <p className="text-muted-foreground text-sm mt-1">
            Track your period details, symptoms, and well-being
          </p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-base font-medium">
                    Date <span className="text-xs text-muted-foreground font-normal">(Required)</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                            field.value && isToday(field.value) && "border-primary text-primary font-medium"
                          )}
                        >
                          {field.value ? (
                            <>
                              {format(field.value, "MMMM d, yyyy")}
                              {isToday(field.value) && (
                                <span className="ml-2 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm">Today</span>
                              )}
                            </>
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
                        onSelect={(date) => {
                          field.onChange(date || new Date());
                          // Explicitly trigger validation to ensure date is correctly validated
                          setTimeout(() => form.trigger("date"), 0);
                        }}
                        initialFocus
                        disabled={(date) => date > new Date()} // Disable future dates
                        modifiersClassNames={{
                          today: "bg-primary/20 text-primary font-bold border-primary",
                          selected: "bg-primary text-primary-foreground"
                        }}
                        footer={
                          <Button
                            className="w-full mt-2 text-xs" 
                            size="sm"
                            onClick={() => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              field.onChange(today);
                              setTimeout(() => form.trigger("date"), 0);
                              const popoverInstance = document.querySelector('[data-radix-popper-content-wrapper]');
                              if (popoverInstance) {
                                // Simulate clicking outside to close popup
                                document.body.click();
                              }
                            }}
                          >
                            Use Today&apos;s Date
                          </Button>
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 mt-6">
              <FormField
                control={form.control}
                name="periodFlow"
                render={({ field }) => {
                  const periodFlowValue = field.value !== undefined ? field.value : 0;
                  
                  return (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Period Flow</FormLabel>
                      <div className="space-y-3">
                        <FormControl>
                          <div className="space-y-3">
                            <Slider 
                              min={0} 
                              max={5} 
                              step={1} 
                              value={[periodFlowValue]} 
                              onValueChange={(values) => field.onChange(values[0])}
                              className={cn(
                                periodFlowValue === 0 && "bg-secondary",
                                periodFlowValue === 1 && "[&>.bg-primary]:bg-red-200",
                                periodFlowValue === 2 && "[&>.bg-primary]:bg-red-300",
                                periodFlowValue === 3 && "[&>.bg-primary]:bg-red-400",
                                periodFlowValue === 4 && "[&>.bg-primary]:bg-red-500",
                                periodFlowValue === 5 && "[&>.bg-primary]:bg-red-600"
                              )}
                            />
                            {/* Custom flow level indicators */}
                            <div className="grid grid-cols-6 gap-0.5 mt-3">
                              <div 
                                className={cn(
                                  "h-2 rounded-l-full", 
                                  periodFlowValue === 0 ? "bg-secondary border border-gray-300" : "bg-gray-200"
                                )}
                                onClick={() => field.onChange(0)}
                              ></div>
                              <div 
                                className={cn(
                                  "h-2", 
                                  periodFlowValue >= 1 ? "bg-red-200" : "bg-gray-200"
                                )}
                                onClick={() => field.onChange(1)}
                              ></div>
                              <div 
                                className={cn(
                                  "h-2", 
                                  periodFlowValue >= 2 ? "bg-red-300" : "bg-gray-200"
                                )}
                                onClick={() => field.onChange(2)}
                              ></div>
                              <div 
                                className={cn(
                                  "h-2", 
                                  periodFlowValue >= 3 ? "bg-red-400" : "bg-gray-200"
                                )}
                                onClick={() => field.onChange(3)}
                              ></div>
                              <div 
                                className={cn(
                                  "h-2", 
                                  periodFlowValue >= 4 ? "bg-red-500" : "bg-gray-200"
                                )}
                                onClick={() => field.onChange(4)}
                              ></div>
                              <div 
                                className={cn(
                                  "h-2 rounded-r-full", 
                                  periodFlowValue >= 5 ? "bg-red-600" : "bg-gray-200"
                                )}
                                onClick={() => field.onChange(5)}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>None</span>
                              <span>Light</span>
                              <span className="text-center">Medium</span>
                              <span className="text-right">Heavy</span>
                            </div>
                            <div className="text-center font-medium">
                              {periodFlowValue === 0 && "None"}
                              {periodFlowValue === 1 && "Light"}
                              {periodFlowValue === 2 && "Moderate Light"}
                              {periodFlowValue === 3 && "Moderate"}
                              {periodFlowValue === 4 && "Moderate Heavy"}
                              {periodFlowValue === 5 && "Heavy"}
                            </div>
                          </div>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Mood</FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        variant={field.value === "none" ? "default" : "outline"}
                        className={cn(
                          "justify-center py-6",
                          field.value === "none" && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => field.onChange("none")}
                      >
                        <span className="flex flex-col items-center gap-1.5">
                          <span className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-lg">😐</span>
                          </span>
                          <span>None</span>
                        </span>
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "happy" ? "default" : "outline"}
                        className={cn(
                          "justify-center py-6",
                          field.value === "happy" && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => field.onChange("happy")}
                      >
                        <span className="flex flex-col items-center gap-1.5">
                          <span className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-lg">😊</span>
                          </span>
                          <span>Happy</span>
                        </span>
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "calm" ? "default" : "outline"}
                        className={cn(
                          "justify-center py-6",
                          field.value === "calm" && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => field.onChange("calm")}
                      >
                        <span className="flex flex-col items-center gap-1.5">
                          <span className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-lg">😌</span>
                          </span>
                          <span>Calm</span>
                        </span>
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "sad" ? "default" : "outline"}
                        className={cn(
                          "justify-center py-6",
                          field.value === "sad" && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => field.onChange("sad")}
                      >
                        <span className="flex flex-col items-center gap-1.5">
                          <span className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-lg">😢</span>
                          </span>
                          <span>Sad</span>
                        </span>
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "anxious" ? "default" : "outline"}
                        className={cn(
                          "justify-center py-6",
                          field.value === "anxious" && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => field.onChange("anxious")}
                      >
                        <span className="flex flex-col items-center gap-1.5">
                          <span className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-lg">😰</span>
                          </span>
                          <span>Anxious</span>
                        </span>
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "irritable" ? "default" : "outline"}
                        className={cn(
                          "justify-center py-6",
                          field.value === "irritable" && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => field.onChange("irritable")}
                      >
                        <span className="flex flex-col items-center gap-1.5">
                          <span className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-lg">😠</span>
                          </span>
                          <span>Irritable</span>
                        </span>
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "tired" ? "default" : "outline"}
                        className={cn(
                          "justify-center py-6",
                          field.value === "tired" && "bg-primary text-primary-foreground"
                        )}
                        onClick={() => field.onChange("tired")}
                      >
                        <span className="flex flex-col items-center gap-1.5">
                          <span className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-lg">😴</span>
                          </span>
                          <span>Tired</span>
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="sleepHours"
                  render={({ field }) => {
                    const sleepValue = field.value !== undefined ? field.value : 0;
                    
                    return (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Sleep Duration</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <Slider 
                              min={0} 
                              max={24} 
                              step={1} 
                              value={[sleepValue]} 
                              onValueChange={(values) => field.onChange(Math.round(values[0]))}
                              className={cn(
                                sleepValue >= 7 && sleepValue <= 9 && "[&>.bg-primary]:bg-green-500",
                                (sleepValue < 7 || sleepValue > 9) && "[&>.bg-primary]:bg-amber-500",
                                (sleepValue < 5 || sleepValue > 11) && "[&>.bg-primary]:bg-red-500"
                              )}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>0</span>
                              <span>12</span>
                              <span>24</span>
                            </div>
                            <div className="text-center font-medium">
                              {sleepValue} hours
                              {sleepValue >= 7 && sleepValue <= 9 && " (Optimal)"}
                              {(sleepValue < 7 && sleepValue >= 5) && " (Low)"}
                              {(sleepValue > 9 && sleepValue <= 11) && " (High)"}
                              {sleepValue < 5 && " (Very low)"}
                              {sleepValue > 11 && " (Very high)"}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="stressLevel"
                  render={({ field }) => {
                    const stressValue = field.value !== undefined ? field.value : 0;
                    
                    return (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Stress Level</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <Slider 
                              min={0} 
                              max={10} 
                              step={1} 
                              value={[stressValue]} 
                              onValueChange={(values) => field.onChange(values[0])}
                              className={cn(
                                stressValue >= 8 && "[&>.bg-primary]:bg-red-500",
                                stressValue >= 5 && stressValue < 8 && "[&>.bg-primary]:bg-amber-500",
                                stressValue > 0 && stressValue < 5 && "[&>.bg-primary]:bg-green-500"
                              )}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>0</span>
                              <span>5</span>
                              <span>10</span>
                            </div>
                            <div className="text-center font-medium">
                              {stressValue}
                              {stressValue === 0 && " - None"}
                              {stressValue >= 1 && stressValue <= 3 && " - Low"}
                              {stressValue >= 4 && stressValue <= 6 && " - Moderate"}
                              {stressValue >= 7 && stressValue <= 9 && " - High"}
                              {stressValue === 10 && " - Extreme"}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Symptoms</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                            "justify-start h-auto py-3",
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
                          <span className="flex items-center gap-2">
                            <span className="text-base">{symptom.icon}</span>
                            <span>{symptom.label}</span>
                          </span>
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
                    <FormLabel className="text-base font-medium">Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes here"
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-8 pt-4 border-t">
              <div className="flex w-full justify-between">
                <div>
                  {record?.id && onDelete && (
                    <>
                      {/* Show delete confirmation */}
                      {showDeleteConfirm ? (
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => {
                              setIsDeleting(true);
                              onDelete(record.id!);
                              setTimeout(() => {
                                setIsDeleting(false);
                                setShowDeleteConfirm(false);
                              }, 500);
                            }}
                            variant="destructive"
                            size="sm"
                            type="button"
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <span className="flex items-center gap-1">
                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                                <span>Deleting...</span>
                              </span>
                            ) : (
                              <span>Confirm</span>
                            )}
                          </Button>
                          <Button
                            onClick={() => setShowDeleteConfirm(false)}
                            variant="outline"
                            size="sm"
                            type="button"
                            disabled={isDeleting}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setShowDeleteConfirm(true)}
                          variant="outline"
                          size="sm"
                          type="button"
                        >
                          <span className="flex items-center gap-1">
                            <span>Delete</span>
                          </span>
                        </Button>
                      )}
                    </>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      // Close the dialog after ensuring the date field is cleared
                      form.reset();
                      setIsSaveError(false);
                      onOpenChange(false);
                    }}
                    variant="outline"
                    type="button"
                    disabled={form.formState.isSubmitting || isDeleting || isSaveSuccess}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={form.formState.isSubmitting || isDeleting || isSaveSuccess}
                    onClick={() => {
                      // Check and fix date issue before submitting
                      const currentDate = form.getValues("date");
                      if (!currentDate) {
                        // If no date, use today's date
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        form.setValue("date", today);
                        form.trigger("date");
                      }
                    }}
                  >
                    {form.formState.isSubmitting || isSaveSuccess ? (
                      <span className="flex items-center gap-1">
                        {form.formState.isSubmitting ? (
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                        ) : (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        )}
                        <span>{form.formState.isSubmitting ? "Saving..." : "Saved!"}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <span>Save</span>
                      </span>
                    )}
                  </Button>
                </div>
              </div>
              {isSaveError && (
                <div className="w-full mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-600">
                  <AlertTriangle size={16} />
                  <span className="text-sm">
                    Failed to save record. Please check your input and try again.
                  </span>
                </div>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      
      {/* Save success dialog */}
      <Dialog open={isSaveSuccess}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="pb-4 mb-2 border-b">
            <DialogTitle className="text-xl text-green-600 font-semibold">
              {record?.id ? "Record Updated" : "Record Created"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 flex flex-col items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <p className="text-center">
              Your period record has been successfully {record?.id ? "updated" : "created"}.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Error dialog - only shown when there is an error saving */}
      <Dialog open={isSaveError} onOpenChange={setIsSaveError}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="pb-4 mb-2 border-b">
            <DialogTitle className="text-xl text-red-600 font-semibold">
              Error Saving Record
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 flex flex-col items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-center">
              There was a problem saving your period record.
              {errorMessage && <span className="block mt-2 text-sm text-red-500">{errorMessage}</span>}
            </p>
          </div>
          <DialogFooter className="mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsSaveError(false)}>
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      {record?.id && onDelete && (
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto p-6">
            <DialogHeader className="pb-4 mb-2 border-b">
              <DialogTitle className="text-xl text-destructive font-semibold">Confirm Delete</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to delete this period record? This action cannot be undone.</p>
            </div>
            <DialogFooter className="mt-4 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  setIsDeleting(true);
                  onDelete(record.id as string);
                  setTimeout(() => {
                    setIsDeleting(false);
                    setShowDeleteConfirm(false);
                    onOpenChange(false);
                  }, 500);
                }}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    <span>Deleting...</span>
                  </span>
                ) : (
                  <span>Delete</span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
} 