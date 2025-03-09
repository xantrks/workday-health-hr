'use client';

import { LoadingStateProps } from '../types';

/**
 * Loading state component for displaying loading spinners
 */
export function LoadingState({ message = 'Loading feedback...' }: LoadingStateProps) {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
} 