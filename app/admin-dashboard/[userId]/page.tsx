'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/custom/dashboard-header";
import { DashboardShell } from "@/components/custom/dashboard-shell";
import { EmptyState } from "@/components/custom/empty-state";
import { StatCard } from "@/components/custom/stat-card";
import { ButtonLink } from "@/components/ui/button-link";

import { AdminMetrics } from "./components/admin-metrics";
import { OrganizationUsers } from "./components/organization-users";
import { RecentActivities } from "./components/recent-activities";

/**
 * Admin Dashboard Page
 */
export default function AdminDashboardPage({ params }: { params: { userId: string } }) {
  console.log("Admin dashboard page loading, user ID:", params.userId);
  
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
      router.replace(`/admin-dashboard/${session.user.id}`);
    }
  }, [session, params.userId, router]);
  
  // Verify role
  useEffect(() => {
    if (session?.user && session.user.role !== "orgadmin" && session.user.role !== "admin" && !session.user.isSuperAdmin) {
      console.log("Role mismatch, user is not an admin");
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
  
  // Check if organization exists
  if (!session.user.organizationId) {
    return (
      <DashboardShell className="px-1 sm:px-4 py-2 sm:py-4 max-w-full overflow-hidden">
        <EmptyState
          title="No Organization Found"
          description="You need to be part of an organization to access the admin dashboard."
          action={
            <ButtonLink href="/">
              Return Home
            </ButtonLink>
          }
        />
      </DashboardShell>
    );
  }
  
  // In a real app, we would fetch organization data and metrics here
  const organizationMetrics = {
    totalUsers: 48,
    activeUsers: 42,
    resourcesUploaded: 124,
    eventsCreated: 18,
  };

  return (
    <DashboardShell className="px-1 sm:px-4 py-2 sm:py-4 max-w-full overflow-hidden">
      <DashboardHeader
        heading="Admin Dashboard"
        text="Manage your organization, users, resources, and events."
      >
        <ButtonLink 
          href={`/admin-dashboard/${params.userId}/settings`} 
          variant="outline"
          className="text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto px-2 sm:px-4"
        >
          Organization Settings
        </ButtonLink>
      </DashboardHeader>

      <div className="grid gap-2 sm:gap-4 grid-cols-2 lg:grid-cols-4 w-full overflow-x-auto">
        <StatCard
          title="Total Users"
          value={organizationMetrics.totalUsers}
          description="Active members in organization"
          trend="up"
          trendValue="8%"
        />
        <StatCard
          title="Active Users"
          value={organizationMetrics.activeUsers}
          description="Users active in last 30 days"
          trend="up"
          trendValue="5%"
        />
        <StatCard
          title="Resources"
          value={organizationMetrics.resourcesUploaded}
          description="Total resources uploaded"
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="Events"
          value={organizationMetrics.eventsCreated}
          description="Events created"
          trend="up"
          trendValue="3%"
        />
      </div>

      <div className="grid gap-3 grid-cols-1 md:grid-cols-7 w-full">
        <div className="col-span-1 md:col-span-4 w-full overflow-x-auto">
          <AdminMetrics />
        </div>
        <div className="col-span-1 md:col-span-3 w-full overflow-x-auto">
          <RecentActivities userId={params.userId} />
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <OrganizationUsers organizationId={session.user.organizationId} />
      </div>
    </DashboardShell>
  );
} 