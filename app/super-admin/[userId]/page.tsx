import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/custom/dashboard-header";
import { DashboardShell } from "@/components/custom/dashboard-shell";
import { StatCard } from "@/components/custom/stat-card";
import { getUserById } from "@/db/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Super Admin Dashboard",
  description: "Manage the entire platform, users, organizations, and system settings",
};

export default async function SuperAdminDashboardPage({ params }: { params: { userId: string } }) {
  const user = await getUserById(params.userId);

  if (!user || !user.is_super_admin) {
    notFound();
  }

  // In a real app, we would fetch platform-wide metrics here
  const platformMetrics = {
    totalOrganizations: 45,
    totalUsers: 2450,
    activeUsers: 1845,
    totalEvents: 312,
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Platform Administration"
        text="Manage the entire platform, organizations, users, and system settings."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Statistics</CardTitle>
              <CardDescription>Monitor key metrics across the entire platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
                <p className="text-muted-foreground">Platform statistics would appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>System Events</CardTitle>
              <CardDescription>Recent system-wide events and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
                <p className="text-muted-foreground">Recent system events would appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>Manage all organizations on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
            <p className="text-muted-foreground">Organizations list would appear here</p>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
} 