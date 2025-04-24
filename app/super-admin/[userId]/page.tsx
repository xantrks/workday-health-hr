'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/custom/dashboard-header";
import { DashboardShell } from "@/components/custom/dashboard-shell";
import { StatCard } from "@/components/custom/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Super Admin Dashboard Page
 */
export default function SuperAdminDashboardPage({ params }: { params: { userId: string } }) {
  console.log("Super Admin dashboard page loading, user ID:", params.userId);
  
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log("Unauthenticated user, redirecting to login page");
      router.replace('/login');
    },
  });
  const router = useRouter();
  
  // Emergency fix: If page loads for more than 5 seconds but authentication is not complete, force refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      if (status === 'loading') {
        console.log("Session loading timeout, attempting to refresh page");
        window.location.reload();
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [status]);
  
  // Redirect if user ID doesn't match session
  useEffect(() => {
    console.log("Session status:", status, "User:", session?.user?.id);
    
    if (session?.user && session.user.id !== params.userId) {
      console.log("User ID mismatch, redirecting to correct dashboard");
      router.replace(`/super-admin/${session.user.id}`);
    }
  }, [session, params.userId, router]);
  
  // Verify role
  useEffect(() => {
    if (session?.user && !session.user.isSuperAdmin) {
      console.log("Role mismatch, user is not a super admin");
      router.replace(`/unauthorized`);
    }
  }, [session, router]);

  // Loading state
  if (status === 'loading') {
    console.log("Dashboard loading...");
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // No session
  if (!session?.user) {
    console.log("No session information, returning null");
    return null;
  }

  console.log("Dashboard rendering, user:", session.user.name, "ID:", session.user.id);
  
  // In a real app, we would fetch platform-wide metrics here
  const platformMetrics = {
    totalOrganizations: 45,
    totalUsers: 2450,
    activeUsers: 1845,
    totalEvents: 312,
  };

  return (
    <DashboardShell className="px-2 sm:px-4 py-2 sm:py-4">
      <DashboardHeader
        heading="Platform Administration"
        text="Manage the entire platform, organizations, users, and system settings."
      />

      <div className="grid gap-2 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Organizations"
          value={platformMetrics.totalOrganizations}
          description="Registered on platform"
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="Total Users"
          value={platformMetrics.totalUsers}
          description="Across all organizations"
          trend="up"
          trendValue="8%"
        />
        <StatCard
          title="Active Users"
          value={platformMetrics.activeUsers}
          description="Last 30 days"
          trend="up"
          trendValue="5%"
        />
        <StatCard
          title="Total Events"
          value={platformMetrics.totalEvents}
          description="Created across platform"
          trend="up"
          trendValue="15%"
        />
      </div>

      <div className="grid gap-2 sm:gap-4 grid-cols-1 md:grid-cols-7">
        <div className="col-span-1 md:col-span-4">
          <Card>
            <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">Platform Statistics</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Monitor key metrics across the entire platform</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="h-[200px] sm:h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
                <p className="text-xs sm:text-sm text-muted-foreground">Platform statistics would appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1 md:col-span-3">
          <Card>
            <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">System Events</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Recent system-wide events and alerts</CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="h-[200px] sm:h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
                <p className="text-xs sm:text-sm text-muted-foreground">Recent system events would appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-2 sm:mt-6">
        <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg">Organizations</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Manage all organizations on the platform</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="h-[200px] sm:h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
            <p className="text-xs sm:text-sm text-muted-foreground">Organizations list would appear here</p>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
} 