'use client';

import { MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  userName: string;
  userId: string;
  profileImageUrl?: string;
}

export default function DashboardHeader({ userName, userId, profileImageUrl }: DashboardHeaderProps) {
  const router = useRouter();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="flex items-center gap-3">
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full h-10 w-10 object-cover border-2 border-primary"
            unoptimized
          />
        ) : (
          <div className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center text-md font-medium border-2 border-primary">
            {userName.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-primary">HR Health Management Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {userName}</p>
        </div>
      </div>
      <Button 
        className="mt-4 md:mt-0"
        variant="accent"
        onClick={() => router.push(`/chat/new?userId=${userId}&role=hr`)}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Consult Sani Assistant
      </Button>
    </div>
  );
} 