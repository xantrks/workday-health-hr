'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import MetricCard from '../MetricCard';
import { MetricCardData } from '../../types';

/**
 * OverviewTab component for HR dashboard
 * Enhanced for mobile responsiveness
 */
export default function OverviewTab() {
  // Mock data for the metric cards
  const metricCardsData: MetricCardData[] = [
    {
      title: 'Total Employees',
      value: '248',
      change: '+12 from last month',
      changeDirection: 'up',
      icon: 'users',
      iconColor: 'primary'
    },
    {
      title: 'Leave Rate',
      value: '4.2%',
      change: '-0.5% from last month',
      changeDirection: 'down',
      icon: 'calendar',
      iconColor: 'accent'
    },
    {
      title: 'Health Satisfaction',
      value: '87%',
      change: '+2% from last quarter',
      changeDirection: 'up',
      icon: 'heart',
      iconColor: 'accent'
    },
    {
      title: 'Attendance Rate',
      value: '96.8%',
      change: '+0.3% from last month',
      changeDirection: 'up',
      icon: 'activity',
      iconColor: 'primary'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {metricCardsData.map((card, index) => (
          <MetricCard key={index} data={card} />
        ))}
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg">Monthly Health Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-64 sm:h-80 flex items-center justify-center border-t pt-3 sm:pt-4 px-3 sm:px-6">
            <p className="text-sm text-muted-foreground text-center">Health data chart will be displayed here</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg">Department Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64 sm:h-80 flex items-center justify-center border-t pt-3 sm:pt-4 px-3 sm:px-6">
            <p className="text-sm text-muted-foreground text-center">Department distribution chart will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 