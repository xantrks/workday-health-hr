'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  userName: string;
  userId: string;
}

export default function DashboardHeader({ userName, userId }: DashboardHeaderProps) {
  const router = useRouter();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Employee Health Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {userName}</p>
      </div>
      <Button 
        className="mt-4 md:mt-0"
        variant="accent"
        onClick={() => router.push(`/chat/new?userId=${userId}&role=employee`)}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Consult Sani Assistant
      </Button>
    </div>
  );
} 