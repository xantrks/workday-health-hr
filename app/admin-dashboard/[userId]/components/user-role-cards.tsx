import React from 'react';

import { Card, CardHeader, CardDescription, CardTitle, CardContent } from '@/components/ui/card';

export function UserRoleCards() {
  const [stats, setStats] = React.useState({
    employees: 0,
    managers: 0,
    admins: 0,
    hrlead: 0,
  });

  React.useEffect(() => {
    // Simulate fetching stats
    // In production, replace with actual API call
    setTimeout(() => {
      setStats({
        employees: 42,
        managers: 8,
        admins: 3,
        hrlead: 1,
      });
    }, 500);
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Card className="col-span-1">
        <CardHeader className="p-3 pb-0 sm:p-4 sm:pb-0">
          <CardDescription className="text-xs">Total</CardDescription>
          <CardTitle className="text-xl sm:text-2xl">Employees</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-1 sm:p-4 sm:pt-2">
          <div className="text-2xl sm:text-3xl font-bold text-blue-500">{stats.employees}</div>
          <div className="text-xs text-muted-foreground mt-1">Active team members</div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader className="p-3 pb-0 sm:p-4 sm:pb-0">
          <CardDescription className="text-xs">Total</CardDescription>
          <CardTitle className="text-xl sm:text-2xl">Managers</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-1 sm:p-4 sm:pt-2">
          <div className="text-2xl sm:text-3xl font-bold text-green-500">{stats.managers}</div>
          <div className="text-xs text-muted-foreground mt-1">Department leads</div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader className="p-3 pb-0 sm:p-4 sm:pb-0">
          <CardDescription className="text-xs">Total</CardDescription>
          <CardTitle className="text-xl sm:text-2xl">Admins</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-1 sm:p-4 sm:pt-2">
          <div className="text-2xl sm:text-3xl font-bold text-purple-500">{stats.admins}</div>
          <div className="text-xs text-muted-foreground mt-1">System administrators</div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader className="p-3 pb-0 sm:p-4 sm:pb-0">
          <CardDescription className="text-xs">Total</CardDescription>
          <CardTitle className="text-xl sm:text-2xl">HR Leads</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-1 sm:p-4 sm:pt-2">
          <div className="text-2xl sm:text-3xl font-bold text-amber-500">{stats.hrlead}</div>
          <div className="text-xs text-muted-foreground mt-1">HR department leaders</div>
        </CardContent>
      </Card>
    </div>
  );
} 