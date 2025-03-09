'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';
import { SubmitStatus } from '../types';

interface FormStatusMessageProps {
  status: SubmitStatus;
  errorMessage?: string;
}

export default function FormStatusMessage({ status, errorMessage }: FormStatusMessageProps) {
  if (status === 'idle' && !errorMessage) return null;
  
  if (status === 'error' || errorMessage) {
    return (
      <div className="rounded-md p-4 bg-destructive/10 flex items-center gap-3 text-destructive">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p>{errorMessage || 'An error occurred. Please try again.'}</p>
      </div>
    );
  }
  
  if (status === 'success') {
    return (
      <div className="rounded-md p-4 bg-success/10 flex items-center gap-3 text-success">
        <CheckCircle className="h-5 w-5 flex-shrink-0" />
        <p>Event created successfully!</p>
      </div>
    );
  }
  
  return null;
} 