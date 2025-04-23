import React from "react";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-1 sm:px-2 mb-4 sm:mb-8 gap-3 sm:gap-0">
      <div className="grid gap-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight leading-tight">{heading}</h1>
        {text && (
          <p className="text-sm sm:text-base text-muted-foreground">{text}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-shrink-0">
          {children}
        </div>
      )}
    </div>
  );
} 