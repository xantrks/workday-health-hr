'use client';

import { 
  Users, 
  Activity, 
  Calendar, 
  Heart,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MetricCardData } from '../types';

interface MetricCardProps {
  data: MetricCardData;
}

/**
 * MetricCard component for dashboard statistics
 * Enhanced for mobile responsiveness
 */
export default function MetricCard({ data }: MetricCardProps) {
  const renderIcon = () => {
    switch (data.icon) {
      case 'users': 
        return <Users className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-${data.iconColor}`} />;
      case 'activity': 
        return <Activity className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-${data.iconColor}`} />;
      case 'calendar': 
        return <Calendar className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-${data.iconColor}`} />;
      case 'heart': 
        return <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-${data.iconColor}`} />;
      default:
        return <Activity className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-${data.iconColor}`} />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
        <CardTitle className="text-xs sm:text-sm font-medium">{data.title}</CardTitle>
        {renderIcon()}
      </CardHeader>
      <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
        <div className="text-xl sm:text-2xl font-bold">{data.value}</div>
        <p className="text-xs text-muted-foreground">{data.change}</p>
      </CardContent>
    </Card>
  );
} 