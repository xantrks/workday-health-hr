'use client';

interface SuccessMessageProps {
  redirectingMessage?: string;
}

export default function SuccessMessage({ 
  redirectingMessage = 'Redirecting to dashboard...' 
}: SuccessMessageProps) {
  return (
    <div className="text-center py-8">
      <div className="text-green-500 mb-3 text-xl">Thank you for your feedback!</div>
      <p className="text-muted-foreground">
        Your input is valuable and helps us improve our support programs.
      </p>
      <p className="text-muted-foreground mt-4">{redirectingMessage}</p>
    </div>
  );
} 