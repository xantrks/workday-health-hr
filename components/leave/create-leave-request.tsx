"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LeaveTypeSelector } from "./leave-type-selector";
import { DateRangePicker } from "./date-range-picker";
import { differenceInDays } from "date-fns";
import { Loader2, Check } from "lucide-react";

interface LeaveType {
  id: string;
  name: string;
  description: string;
  maxDays: number;
}

interface CreateLeaveRequestProps {
  leaveTypes: LeaveType[];
  suggestions: string[];
  onSubmit: (data: {
    leaveType: string;
    startDate: Date;
    endDate: Date;
    reason: string;
    totalDays: number;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function CreateLeaveRequest({
  leaveTypes,
  suggestions,
  onSubmit,
  isLoading = false,
}: CreateLeaveRequestProps) {
  const [selectedType, setSelectedType] = useState<LeaveType | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType || !dateRange?.from || !dateRange?.to || !reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const totalDays = differenceInDays(dateRange.to, dateRange.from) + 1;
      
      await onSubmit({
        leaveType: selectedType.name,
        startDate: dateRange.from,
        endDate: dateRange.to,
        reason,
        totalDays,
      });
      
      // Reset form after successful submission
      setSelectedType(null);
      setDateRange(undefined);
      setReason("");
      toast.success("Leave request submitted successfully");
    } catch (error) {
      console.error("Failed to submit leave request:", error);
      toast.error("Failed to submit leave request, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-white dark:bg-gray-900 p-4 rounded-lg border">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Leave Request</h3>
        <p className="text-sm text-muted-foreground">
          Please fill in the information below to submit your leave request
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Leave Type</label>
          <LeaveTypeSelector
            leaveTypes={leaveTypes}
            selectedType={selectedType}
            onSelect={setSelectedType}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Leave Date Range</label>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          {dateRange?.from && dateRange?.to && (
            <p className="text-sm text-muted-foreground">
              Total {differenceInDays(dateRange.to, dateRange.from) + 1} days
              {selectedType && selectedType.maxDays < 999 && (
                <span>
                  {" "}
                  (Maximum {selectedType.maxDays} days allowed)
                </span>
              )}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Reason for Leave</label>
          <Textarea
            placeholder="Please provide details for your leave request..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
          {suggestions.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Suggested reasons:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setReason(suggestion)}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            isLoading ||
            !selectedType ||
            !dateRange?.from ||
            !dateRange?.to ||
            !reason
          }
          className="w-full"
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Submit Request
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 