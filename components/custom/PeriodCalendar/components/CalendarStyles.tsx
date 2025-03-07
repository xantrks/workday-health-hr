"use client";

import React from "react";

export const CalendarStyles: React.FC = () => {
  return (
    <style jsx global>{`
      .fc-day {
        position: relative;
        min-height: 54px !important;
        transition: transform 0.15s ease;
      }
      
      .fc-day-today {
        background-color: rgba(var(--accent) / 0.15) !important;
      }
      
      .has-data {
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
        z-index: 5;
      }
      
      .fc-day-number {
        padding: 5px !important;
      }
      
      .fc-day:hover {
        transform: scale(1.02);
        z-index: 10;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        cursor: pointer;
      }
      
      .period-day {
        overflow: visible !important;
      }
      
      .period-day .fc-daygrid-day-number {
        color: #e11d48 !important;
        font-weight: 500;
      }
      
      .fc-event {
        border: none !important;
        background: transparent !important;
      }
      
      .fc-header-toolbar {
        margin-bottom: 1rem !important;
      }
      
      .fc-daygrid-day-frame {
        padding: 4px !important;
        min-height: 54px !important;
      }
      
      .data-indicator {
        z-index: 2;
      }
      
      /* Improve visibility of content in calendar cells */
      .fc .fc-daygrid-day-top {
        justify-content: center;
        padding-top: 4px;
      }
      
      /* Custom component styles */
      .period-tooltip {
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      /* Optimize display for small screens */
      @media (max-width: 640px) {
        .fc-header-toolbar {
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .fc-toolbar-chunk {
          display: flex;
          justify-content: center;
        }
      }
    `}</style>
  );
}; 