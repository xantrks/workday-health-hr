'use client';

import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  FileIcon, 
  CheckCircleIcon,
  MailOpenIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Activity = {
  id: string;
  type: "attendance" | "task_completed" | "leave_request" | "document_submission" | "milestone" | "feedback";
  user: string;
  timestamp: string;
  details: string;
};

// Mock data - would be fetched from server
const mockActivities: Activity[] = [
  {
    id: "1",
    type: "attendance",
    user: "Alice Johnson",
    timestamp: "2023-10-12T08:45:30Z",
    details: "Checked in 15 minutes early",
  },
  {
    id: "2",
    type: "task_completed",
    user: "Bob Smith",
    timestamp: "2023-10-12T11:22:10Z",
    details: "Completed UI design for the dashboard",
  },
  {
    id: "3",
    type: "leave_request",
    user: "Carol Williams",
    timestamp: "2023-10-12T10:15:22Z",
    details: "Requested vacation from Oct 20-25",
  },
  {
    id: "4",
    type: "document_submission",
    user: "David Brown",
    timestamp: "2023-10-11T16:30:00Z",
    details: "Submitted quarterly performance report",
  },
  {
    id: "5",
    type: "milestone",
    user: "Team",
    timestamp: "2023-10-11T09:12:45Z",
    details: "Achieved 100% code coverage on core modules",
  },
  {
    id: "6",
    type: "feedback",
    user: "Eve Davis",
    timestamp: "2023-10-10T13:20:15Z",
    details: "Submitted peer review for David",
  },
];

export function TeamActivities({ userId }: { userId: string }) {
  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  // Get icon based on activity type
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "attendance":
        return <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
      case "task_completed":
        return <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />;
      case "leave_request":
        return <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />;
      case "document_submission":
        return <FileIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />;
      case "milestone":
        return <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
      case "feedback":
        return <MailOpenIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />;
      default:
        return <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-3">
        <CardTitle className="text-base sm:text-lg">Team Activities</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Recent activities from your team members</CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <ScrollArea className="h-[250px] sm:h-[400px] pr-2 sm:pr-4">
          <div className="space-y-3 sm:space-y-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-2 sm:space-x-4">
                <div className="mt-0.5 flex-shrink-0">{getActivityIcon(activity.type)}</div>
                <div className="space-y-0.5 sm:space-y-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium">{activity.user}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{activity.details}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 