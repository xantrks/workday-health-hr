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

/**
 * Dashboard header component for HR dashboard
 * Enhanced for mobile responsiveness
 */
export default function DashboardHeader({ userName, userId, profileImageUrl }: DashboardHeaderProps) {
  const router = useRouter();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-6 gap-2 sm:gap-0">
      <div className="flex items-center gap-1.5 sm:gap-3 w-full sm:w-auto">
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full h-7 w-7 sm:h-10 sm:w-10 object-cover border-2 border-primary"
            unoptimized
          />
        ) : (
          <div className="bg-primary text-white rounded-full h-7 w-7 sm:h-10 sm:w-10 flex items-center justify-center text-xs sm:text-md font-medium border-2 border-primary">
            {userName.charAt(0)}
          </div>
        )}
        <div>
          <h1 className="text-lg sm:text-3xl font-bold text-primary leading-tight">HR Management Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0 sm:mt-1">Welcome back, {userName}</p>
        </div>
      </div>
    </div>
  );
} 