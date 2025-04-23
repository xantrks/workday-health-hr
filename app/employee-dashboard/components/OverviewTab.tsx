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

/**
 * OverviewTab component for employee dashboard
 * Enhanced for mobile responsiveness
 */
export function OverviewTab({ userId, userName }: OverviewTabProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-2 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-2 sm:px-4 pt-2 sm:pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium">Next Period</CardTitle>
            <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          </CardHeader>
          <CardContent className="px-2 sm:px-4 pb-2 sm:pb-4">
            <div className="text-base sm:text-2xl font-bold">March 15</div>
            <p className="text-xs text-muted-foreground">7 days from now</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-2 sm:px-4 pt-2 sm:pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium">Mood Status</CardTitle>
            <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
          </CardHeader>
          <CardContent className="px-2 sm:px-4 pb-2 sm:pb-4">
            <div className="text-base sm:text-2xl font-bold">Good</div>
            <p className="text-xs text-muted-foreground">Last 7 days average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-2 sm:px-4 pt-2 sm:pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium">Appointments</CardTitle>
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          </CardHeader>
          <CardContent className="px-2 sm:px-4 pb-2 sm:pb-4">
            <div className="text-base sm:text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">March 10 - Check-up</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-2 sm:px-4 pt-2 sm:pt-4">
            <CardTitle className="text-xs sm:text-sm font-medium">Health Index</CardTitle>
            <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
          </CardHeader>
          <CardContent className="px-2 sm:px-4 pb-2 sm:pb-4">
            <div className="text-base sm:text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Health Score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-2 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-lg">Monthly Health Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-56 sm:h-80 flex items-center justify-center border-t pt-3 sm:pt-4 px-3 sm:px-6">
            <p className="text-xs sm:text-sm text-muted-foreground text-center">Health data chart will be displayed here</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-lg">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="space-y-2 sm:space-y-4">
              <div className="flex items-start gap-2 sm:gap-4 rounded-lg border p-2 sm:p-3">
                <div className="flex-1 space-y-0.5 sm:space-y-1">
                  <p className="text-xs sm:text-sm font-medium">Period Reminder</p>
                  <p className="text-xs text-muted-foreground">
                    Your next period is expected to start in 7 days
                  </p>
                </div>
                <CalendarIcon className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
              </div>
              
              <div className="flex items-start gap-2 sm:gap-4 rounded-lg border p-2 sm:p-3">
                <div className="flex-1 space-y-0.5 sm:space-y-1">
                  <p className="text-xs sm:text-sm font-medium">Appointment Confirmation</p>
                  <p className="text-xs text-muted-foreground">
                    Your gynecological exam appointment has been confirmed
                  </p>
                </div>
                <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 