import {
  Activity, 
  Calendar as CalendarIcon,
  Clock, 
  Heart
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OverviewTabProps {
  userId: string;
  userName: string;
}

export function OverviewTab({ userId, userName }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Period Prediction</CardTitle>
            <CalendarIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">March 15</div>
            <p className="text-xs text-muted-foreground">7 days from now</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mood Status</CardTitle>
            <Heart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <p className="text-xs text-muted-foreground">Last 7 days average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">March 10 - Gynecological Exam</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Activities</CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Health Index</p>
          </CardContent>
        </Card>
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
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg border p-3">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Period Reminder</p>
                  <p className="text-sm text-muted-foreground">
                    Your next period is expected to start in 7 days
                  </p>
                </div>
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex items-start gap-4 rounded-lg border p-3">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Appointment Confirmation</p>
                  <p className="text-sm text-muted-foreground">
                    Your gynecological exam appointment has been confirmed
                  </p>
                </div>
                <Clock className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 