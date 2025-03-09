'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderSectionProps {
  userId: string;
}

export default function HeaderSection({ userId }: HeaderSectionProps) {
  return (
    <div className="mb-8">
      <Link href={`/hr-dashboard/${userId}?tab=resources`}>
        <Button variant="ghost" size="sm" className="group mb-4 pl-1 flex items-center gap-1 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Dashboard</span>
        </Button>
      </Link>
      <h1 className="text-2xl font-bold text-primary">Upload New Resource</h1>
      <p className="text-muted-foreground mt-1">Add new documents, guidelines or educational materials for employees</p>
    </div>
  );
} 