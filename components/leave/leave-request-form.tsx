"use client";

import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface LeaveType {
  id: string;
  name: string;
  description: string;
  maxDays: number;
}

interface LeaveRequestFormProps {
  leaveTypes: LeaveType[];
}

export function LeaveRequestForm({ leaveTypes }: LeaveRequestFormProps) {
  const [selectedType, setSelectedType] = useState<LeaveType | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reason, setReason] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    suggestions: string[];
  } | null>(null);

  // Get leave reason suggestions when user selects a leave type
  useEffect(() => {
    if (selectedType) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(`/api/leave/suggestions?leaveType=${encodeURIComponent(selectedType.name)}`);
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data);
          }
        } catch (error) {
          console.error("Failed to fetch leave suggestions:", error);
        }
      };
      
      fetchSuggestions();
    }
  }, [selectedType]);

  const validateRequest = async () => {
    if (!selectedType || !dateRange?.from || !dateRange?.to || !reason) {
      toast.error("Please fill in all required fields");
      return false;
    }

    setIsValidating(true);
    
    try {
      const response = await fetch("/api/leave/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: format(dateRange.from, "yyyy-MM-dd"),
          endDate: format(dateRange.to, "yyyy-MM-dd"),
          leaveType: selectedType.name,
          reason,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setValidationResult(result);
        return result.isValid;
      } else {
        toast.error("Failed to validate request");
        return false;
      }
    } catch (error) {
      console.error("Failed to validate leave request:", error);
      toast.error("An error occurred during validation");
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateRequest();
    
    if (!isValid) return;
    
    try {
      setIsSubmitting(true);
      
      // Ensure dateRange and its properties are defined before formatting
      if (!dateRange?.from || !dateRange.to || !selectedType) {
        toast.error("Please complete all required fields");
        setIsSubmitting(false);
        return;
      }
      
      const response = await fetch("/api/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: format(dateRange.from, "yyyy-MM-dd"),
          endDate: format(dateRange.to, "yyyy-MM-dd"),
          leaveType: selectedType.name,
          reason,
        }),
      });

      if (response.ok) {
        toast.success("Leave request submitted successfully");
        
        // Reset form
        setSelectedType(null);
        setDateRange(undefined);
        setReason("");
        setValidationResult(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to submit leave request");
      }
    } catch (error) {
      console.error("Failed to submit leave request:", error);
      toast.error("An error occurred while submitting leave request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-white dark:bg-gray-800 p-4 rounded-lg border">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Leave Request</h3>
        <p className="text-sm text-muted-foreground">
          Please fill in the information below to submit your leave request
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Leave Type</label>
          <select
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedType?.id || ""}
            onChange={(e) => {
              const selected = leaveTypes.find(type => type.id === e.target.value);
              setSelectedType(selected || null);
            }}
          >
            <option value="">Select leave type...</option>
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} - {type.description}
              </option>
            ))}
          </select>
          {selectedType && selectedType.maxDays < 999 && (
            <p className="text-xs text-muted-foreground">
              Maximum {selectedType.maxDays} days allowed
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Leave Date Range</label>
          <div className="grid gap-2">
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
              onClick={() => {
                document.getElementById('start-date')?.click();
              }}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "y/MM/dd")} -{" "}
                    {format(dateRange.to, "y/MM/dd")}
                  </>
                ) : (
                  format(dateRange.from, "y/MM/dd")
                )
              ) : (
                <span>Select leave date range</span>
              )}
            </Button>
            <input 
              type="date" 
              id="start-date"
              className="hidden"
              onChange={(e) => {
                const start = new Date(e.target.value);
                setDateRange(prev => ({
                  from: start,
                  to: prev?.to || start
                }));
              }}
            />
            <input 
              type="date" 
              id="end-date"
              className="hidden"
              onChange={(e) => {
                const end = new Date(e.target.value);
                setDateRange(prev => ({
                  from: prev?.from || end,
                  to: end
                }));
              }}
            />
          </div>
          {dateRange?.from && dateRange?.to && (
            <p className="text-sm text-muted-foreground">
              Total {differenceInDays(dateRange.to, dateRange.from) + 1} days
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

        {validationResult && (
          <div className={cn(
            "p-4 rounded-md text-sm",
            validationResult.isValid 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-red-50 text-red-700 border border-red-200"
          )}>
            <p className="font-medium">{validationResult.message}</p>
            {!validationResult.isValid && validationResult.suggestions.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Suggestions:</p>
                <ul className="list-disc pl-5 mt-1">
                  {validationResult.suggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={validateRequest}
            disabled={isValidating || isSubmitting || !selectedType || !dateRange?.from || !dateRange?.to || !reason}
            className="flex-1"
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              "Validate Request"
            )}
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isValidating || !selectedType || !dateRange?.from || !dateRange?.to || !reason}
            className="flex-1"
          >
            {isSubmitting ? (
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
    </div>
  );
} 