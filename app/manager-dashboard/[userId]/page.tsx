'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/custom/dashboard-header";
import { DashboardShell } from "@/components/custom/dashboard-shell";
import { StatCard } from "@/components/custom/stat-card";
import { ButtonLink } from "@/components/ui/button-link";
import { TeamMetrics } from "./components/team-metrics";
import { TeamMembers } from "./components/team-members";
import { TeamActivities } from "./components/team-activities";

export default function ManagerDashboardPage({ params }: { params: { userId: string } }) {
  console.log("Manager dashboard page loading, user ID:", params.userId);
  
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
      router.replace(`/manager-dashboard/${session.user.id}`);
    }
  }, [session, params.userId, router]);
  
  // Verify role
  useEffect(() => {
    if (session?.user && session.user.role !== "manager" && !session.user.isSuperAdmin) {
      console.log("Role mismatch, user is not a manager");
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
  
  // In a real app, we would fetch team data and metrics here
  const teamMetrics = {
    teamSize: 12,
    activeProjects: 5,
    completedTasks: 48,
    pendingApprovals: 3,
  };

  return (
    <DashboardShell className="px-2 sm:px-4 py-2 sm:py-4">
      <DashboardHeader
        heading="Team Management Dashboard"
        text="Manage your team, track performance, and approve requests."
      >
        <ButtonLink 
          href={`/manager-dashboard/${params.userId}/reports`} 
          variant="outline"
          className="text-xs sm:text-sm h-8 sm:h-9 w-full sm:w-auto px-2 sm:px-4"
        >
          Team Reports
        </ButtonLink>
      </DashboardHeader>

      <div className="grid gap-2 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Team Size"
          value={teamMetrics.teamSize}
          description="Total team members"
          trend="up"
          trendValue="2%"
        />
        <StatCard
          title="Active Projects"
          value={teamMetrics.activeProjects}
          description="Currently in progress"
          trend="same"
          trendValue="0%"
        />
        <StatCard
          title="Completed Tasks"
          value={teamMetrics.completedTasks}
          description="Last 30 days"
          trend="up"
          trendValue="15%"
        />
        <StatCard
          title="Pending Approvals"
          value={teamMetrics.pendingApprovals}
          description="Awaiting your review"
          trend="down"
          trendValue="25%"
        />
      </div>

      <div className="grid gap-2 sm:gap-4 grid-cols-1 md:grid-cols-7">
        <div className="col-span-1 md:col-span-4">
          <TeamMetrics />
        </div>
        <div className="col-span-1 md:col-span-3">
          <TeamActivities userId={params.userId} />
        </div>
      </div>

      <TeamMembers managerId={params.userId} />
    </DashboardShell>
  );
} 