'use client';

import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { EmptyStateProps } from '../types';

/**
 * Empty state component shown when no feedback is available
 */
export function EmptyState({ categoryFilter, setCategoryFilter }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="rounded-full bg-muted p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
        <MessageSquare className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-lg font-medium">No feedback found</p>
      <p className="text-muted-foreground mt-1 mb-6">
        {categoryFilter !== 'all' 
          ? "Try changing your filter to see more feedback"
          : "Employees haven't submitted any feedback yet"}
      </p>
      {categoryFilter !== 'all' && (
        <Button variant="outline" onClick={() => setCategoryFilter('all')}>
          Show All Feedback
        </Button>
      )}
    </div>
  );
} 