"use client";

import { format } from "date-fns";
import React from "react";
import { createRoot } from "react-dom/client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipData } from "../utils";

export interface TooltipRendererProps {
  tooltipData: TooltipData;
  onSelectDate: (date: Date) => void;
}

export const CalendarTooltip: React.FC<TooltipRendererProps> = ({ tooltipData, onSelectDate }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="h-full w-full"></div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs whitespace-pre-line period-tooltip">
          <div className="text-xs space-y-1">
            <h3 className="font-medium text-sm">{format(new Date(tooltipData.date), "MMMM d, yyyy")}</h3>
            <p className="whitespace-pre-line">{tooltipData.content}</p>
            {tooltipData.id && (
              <button 
                onClick={() => onSelectDate(new Date(tooltipData.date))}
                className="text-xs text-primary hover:underline mt-1 font-medium"
              >
                View Details
              </button>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Helper function to render tooltip
export const renderTooltip = (
  tooltipElement: HTMLElement, 
  tooltipData: TooltipData, 
  onSelectDate: (date: Date) => void
) => {
  // Create React root element
  const root = createRoot(tooltipElement);
  
  // Render tooltip component
  root.render(
    <CalendarTooltip 
      tooltipData={tooltipData} 
      onSelectDate={onSelectDate} 
    />
  );
  
  // Store root reference for cleanup
  (tooltipElement as any)._root = root;
}; 