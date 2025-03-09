'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';
import { SubmitStatus } from '../types';

interface StatusMessageProps {
  status: SubmitStatus;
  errorMessage?: string;
}

export default function StatusMessage({ status, errorMessage }: StatusMessageProps) {
  if (status === 'idle') return null;
  
  if (status === 'error') {
    return (
      <div className="bg-destructive/15 p-3 rounded-md flex items-start">
        <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
        <div className="text-destructive text-sm">{errorMessage || 'An error occurred while updating the event.'}</div>
      </div>
    );
  }
  
  if (status === 'success') {
    return (
      <div className="bg-primary/15 p-3 rounded-md flex items-start">
        <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
        <div className="text-primary text-sm">Event updated successfully! Redirecting...</div>
      </div>
    );
  }
  
  return null;
} 