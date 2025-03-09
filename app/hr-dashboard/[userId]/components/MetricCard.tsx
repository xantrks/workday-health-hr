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

export default function MetricCard({ data }: MetricCardProps) {
  const renderIcon = () => {
    const className = `h-4 w-4 text-${data.iconColor}`;
    
    switch (data.icon) {
      case 'users': 
        return <Users className={className} />;
      case 'activity': 
        return <Activity className={className} />;
      case 'calendar': 
        return <Calendar className={className} />;
      case 'heart': 
        return <Heart className={className} />;
      default:
        return <Activity className={className} />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
        {renderIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.value}</div>
        <p className="text-xs text-muted-foreground">{data.change}</p>
      </CardContent>
    </Card>
  );
} 