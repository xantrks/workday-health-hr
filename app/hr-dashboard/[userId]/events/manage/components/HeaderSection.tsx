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
    <div className="mb-8">
      <Link href={`/hr-dashboard/${userId}?tab=resources`}>
        <Button variant="ghost" size="sm" className="group mb-4 pl-1 flex items-center gap-1 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Dashboard</span>
        </Button>
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Health Events</h1>
          <p className="text-muted-foreground mt-1">Manage all scheduled health workshops and seminars</p>
        </div>
        <Button 
          onClick={onCreateEvent}
          className="sm:self-start"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Event
        </Button>
      </div>
    </div>
  );
} 