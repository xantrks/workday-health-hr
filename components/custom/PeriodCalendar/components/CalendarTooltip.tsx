"use client";

import { format } from "date-fns";
import React from "react";
import { createRoot } from "react-dom/client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { TooltipData } from "../utils";

export interface TooltipRendererProps {
  tooltipData: { date: string; content: string; id?: string };
  onSelectDate: (date: Date) => void;
}

export const CalendarTooltip: React.FC<TooltipRendererProps> = ({ tooltipData, onSelectDate }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <div className="h-full w-full"></div>
        </TooltipTrigger>
        <TooltipContent 
          className="period-tooltip bg-card border border-border/50 px-3 py-2.5 shadow-lg"
          side="bottom"
        >
          <div className="text-xs space-y-2">
            <h3 className="font-medium text-sm pb-1 border-b border-border/30">
              {format(new Date(tooltipData.date), "MMMM d, yyyy")}
            </h3>
            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
              {tooltipData.content}
            </p>
            {tooltipData.id && (
              <button 
                onClick={() => onSelectDate(new Date(tooltipData.date))}
                className="text-xs text-primary hover:text-primary/80 hover:underline mt-2 font-medium inline-flex items-center gap-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                  <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
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