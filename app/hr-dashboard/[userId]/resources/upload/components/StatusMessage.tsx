'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';
import { UploadStatus } from '../types';

interface StatusMessageProps {
  status: UploadStatus;
  errorMessage: string;
}

export default function StatusMessage({ status, errorMessage }: StatusMessageProps) {
  if (status === 'idle' && !errorMessage) {
    return null;
  }

  if (errorMessage) {
    return (
      <div className="rounded-md p-4 bg-destructive/10 flex items-center gap-3 text-destructive">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p>{errorMessage}</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="rounded-md p-4 bg-success/10 flex items-center gap-3 text-success">
        <CheckCircle className="h-5 w-5 flex-shrink-0" />
        <p>Resource uploaded successfully!</p>
      </div>
    );
  }

  return null;
} 