'use client';

import Link from 'next/link';
import { ChevronLeft, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderSectionProps {
  userId: string;
  onCreateEvent: () => void;
}

export default function HeaderSection({ userId, onCreateEvent }: HeaderSectionProps) {
  return (
    <div className="mb-4 sm:mb-8">
      <Link href={`/hr-dashboard/${userId}?tab=resources`}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="group mb-2 sm:mb-4 pl-1 flex items-center gap-1 text-xs sm:text-sm text-muted-foreground hover:text-foreground h-8"
        >
          <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Dashboard</span>
        </Button>
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary leading-tight">Health Events</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
            Manage all scheduled health workshops and seminars
          </p>
        </div>
        <Button 
          onClick={onCreateEvent}
          className="sm:self-start mt-2 sm:mt-0 text-xs sm:text-sm h-8 sm:h-9 flex items-center"
          size="sm"
        >
          <PlusCircle className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Create New Event
        </Button>
      </div>
    </div>
  );
} 