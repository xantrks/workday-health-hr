'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
        <Link href={`/employee-dashboard/${userId}?tab=resources`}>
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {backButtonLabel}
          </Button>
        </Link>
        
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