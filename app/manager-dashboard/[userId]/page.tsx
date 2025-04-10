import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/custom/dashboard-header";
import { DashboardShell } from "@/components/custom/dashboard-shell";
import { StatCard } from "@/components/custom/stat-card";
import { ButtonLink } from "@/components/ui/button-link";
import { getUserById } from "@/db/queries";
import { TeamMetrics } from "./components/team-metrics";
import { TeamMembers } from "./components/team-members";
import { TeamActivities } from "./components/team-activities";

export const metadata = {
  title: "Manager Dashboard",
  description: "Manage your team, track performance, and view reports",
};

export default async function ManagerDashboardPage({ params }: { params: { userId: string } }) {
  const user = await getUserById(params.userId);

  if (!user || user.role !== "manager") {
    notFound();
  }

  // In a real app, we would fetch team data and metrics here
  const teamMetrics = {
    teamSize: 12,
    activeProjects: 5,
    completedTasks: 48,
    pendingApprovals: 3,
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Team Management Dashboard"
        text="Manage your team, track performance, and approve requests."
      >
        <ButtonLink href={`/manager-dashboard/${params.userId}/reports`} variant="outline">
          Team Reports
        </ButtonLink>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-4">
          <TeamMetrics />
        </div>
        <div className="col-span-3">
          <TeamActivities userId={params.userId} />
        </div>
      </div>

      <TeamMembers managerId={params.userId} />
    </DashboardShell>
  );
} 