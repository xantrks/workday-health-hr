'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorViewProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorView({ error, onRetry }: ErrorViewProps) {
  return (
    <div className="text-center py-16">
      <div className="rounded-full bg-destructive/10 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <p className="text-destructive">{error}</p>
      <Button 
        variant="outline" 
        onClick={onRetry} 
        className="mt-6"
      >
        Try Again
      </Button>
    </div>
  );
} 