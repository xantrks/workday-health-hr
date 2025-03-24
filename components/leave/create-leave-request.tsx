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
      toast.error("请填写所有必填字段");
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
      
      // 成功后重置表单
      setSelectedType(null);
      setDateRange(undefined);
      setReason("");
      toast.success("请假申请已提交");
    } catch (error) {
      console.error("提交请假申请失败:", error);
      toast.error("提交请假申请失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-white dark:bg-gray-900 p-4 rounded-lg border">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">请假申请</h3>
        <p className="text-sm text-muted-foreground">
          请填写以下信息提交您的请假申请
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">请假类型</label>
          <LeaveTypeSelector
            leaveTypes={leaveTypes}
            selectedType={selectedType}
            onSelect={setSelectedType}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">请假日期范围</label>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          {dateRange?.from && dateRange?.to && (
            <p className="text-sm text-muted-foreground">
              共 {differenceInDays(dateRange.to, dateRange.from) + 1} 天
              {selectedType && selectedType.maxDays < 999 && (
                <span>
                  {" "}
                  (最多可请 {selectedType.maxDays} 天)
                </span>
              )}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">请假原因</label>
          <Textarea
            placeholder="请详细说明您的请假原因..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
          {suggestions.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">建议的请假理由：</p>
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
              提交中...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              提交请假申请
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 