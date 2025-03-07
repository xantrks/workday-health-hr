"use client";

import React from "react";

import { FLOW_LEVELS, SYMPTOM_ICONS, MOOD_ICONS } from "../constants";

export const CalendarLegend: React.FC = () => {
  return (
    <div className="mt-6 rounded-md border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-medium text-foreground">Calendar Legend</h3>
      
      <div className="space-y-4">
        {/* Flow legend */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Period Flow</h4>
          <div className="grid grid-cols-3 gap-2">
            {FLOW_LEVELS.map((level, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded flex items-center justify-center`} style={{ backgroundColor: level.color }}>
                  {[...Array(idx + 1)].map((_, i) => (
                    <span key={i} className={`inline-block w-1 h-1 rounded-full mx-px ${level.dotClass}`}></span>
                  ))}
                </div>
                <span className="text-xs">{level.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Symptoms legend */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Common Symptoms</h4>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(SYMPTOM_ICONS)
              .filter(([key]) => key !== 'default')
              .map(([key, info]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${info.color}`} 
                       dangerouslySetInnerHTML={{ __html: info.icon }}></div>
                  <span className="text-xs">{info.label}</span>
                </div>
            ))}
          </div>
        </div>
        
        {/* Mood legend */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Mood Indicators</h4>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(MOOD_ICONS)
              .filter(([key]) => key !== 'default')
              .map(([key, info]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${info.color}`} 
                       dangerouslySetInnerHTML={{ __html: info.icon }}></div>
                  <span className="text-xs">{info.label}</span>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 