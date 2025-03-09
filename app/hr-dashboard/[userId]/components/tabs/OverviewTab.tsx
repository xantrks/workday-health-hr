'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import MetricCard from '../MetricCard';
import { MetricCardData } from '../../types';

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
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCardsData.map((card, index) => (
          <MetricCard key={index} data={card} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Monthly Health Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center border-t pt-4">
            <p className="text-muted-foreground text-center">Health data chart will be displayed here</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center border-t pt-4">
            <p className="text-muted-foreground text-center">Department distribution chart will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 