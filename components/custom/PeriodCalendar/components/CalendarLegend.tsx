"use client";

import React from "react";

import { FLOW_LEVELS, SYMPTOM_ICONS, MOOD_ICONS } from "../constants";

export const CalendarLegend: React.FC = () => {
  return (
    <div className="mt-6 rounded-lg border border-border/50 bg-card p-5 shadow-sm dark:shadow-primary/5 dark:border-border/30">
      <h3 className="mb-4 text-base font-semibold text-foreground">Calendar Legend</h3>
      
      <div className="space-y-6">
        {/* Flow legend */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-3 pb-1.5 border-b border-border/40 dark:border-border/20">Period Flow Intensity</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FLOW_LEVELS.map((level, idx) => (
              <div key={idx} className="flex items-center gap-2.5 hover:bg-accent/10 dark:hover:bg-accent/5 rounded-md p-2 transition-colors duration-200">
                <div 
                  className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{ 
                    backgroundColor: level.color,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                  }}
                >
                  {[...Array(idx + 1)].map((_, i) => (
                    <span key={i} className={`inline-block w-1 h-1 rounded-full mx-px ${level.dotClass}`}></span>
                  ))}
                </div>
                <span className="text-xs font-medium text-foreground">{level.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Symptoms legend */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-3 pb-1.5 border-b border-border/40 dark:border-border/20">Common Symptoms</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(SYMPTOM_ICONS)
              .filter(([key]) => key !== 'default')
              .map(([key, info]) => (
                <div key={key} className="flex items-center gap-2.5 hover:bg-accent/10 dark:hover:bg-accent/5 rounded-md p-2 transition-colors duration-200">
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${info.color} dark:opacity-90`}
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
                    dangerouslySetInnerHTML={{ __html: info.icon }}
                  ></div>
                  <span className="text-xs font-medium text-foreground">{info.label}</span>
                </div>
            ))}
          </div>
        </div>
        
        {/* Mood legend */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-3 pb-1.5 border-b border-border/40 dark:border-border/20">Mood Indicators</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(MOOD_ICONS)
              .filter(([key]) => key !== 'default')
              .map(([key, info]) => (
                <div key={key} className="flex items-center gap-2.5 hover:bg-accent/10 dark:hover:bg-accent/5 rounded-md p-2 transition-colors duration-200">
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${info.color} dark:opacity-90`}
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
                    dangerouslySetInnerHTML={{ __html: info.icon }}
                  ></div>
                  <span className="text-xs font-medium text-foreground">{info.label}</span>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 