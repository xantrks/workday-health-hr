'use client';

import { CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function EventLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        <span>Webinar</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
        <span>Workshop</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span>Seminar</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
        <span>Training</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <span>Meeting</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="h-5 flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-primary" />
          <span>Registered</span>
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="h-5 flex items-center gap-1">
          <span>Upcoming</span>
        </Badge>
      </div>
    </div>
  );
} 