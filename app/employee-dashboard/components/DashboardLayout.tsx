'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
  userId: string;
  title: string;
  description?: string;
  backButtonLabel?: string;
}

export default function DashboardLayout({
  children,
  userId,
  title,
  description,
  backButtonLabel = 'Back to Dashboard'
}: DashboardLayoutProps) {
  const router = useRouter();

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="mb-8">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push(`/employee-dashboard/${userId}`)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {backButtonLabel}
        </Button>
        
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-primary">{title}</h1>
          {description && (
            <p className="text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {children}
    </div>
  );
} 