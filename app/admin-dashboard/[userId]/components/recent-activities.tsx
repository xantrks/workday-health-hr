'use client';

import { CalendarIcon, ClockIcon, UserCircleIcon, FileTextIcon, BookmarkIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Activity = {
  id: string;
  type: "login" | "user_created" | "resource_added" | "event_created" | "feedback";
  user: string;
  timestamp: string;
  details: string;
};

// Mock data - would be fetched from server
const mockActivities: Activity[] = [
  {
    id: "1",
    type: "login",
    user: "John Doe",
    timestamp: "2023-10-12T08:45:30Z",
    details: "Logged in from 192.168.1.1",
  },
  {
    id: "2",
    type: "user_created",
    user: "Admin User",
    timestamp: "2023-10-11T14:22:10Z",
    details: "Created new user account for Sarah Johnson",
  },
  {
    id: "3",
    type: "resource_added",
    user: "Jane Smith",
    timestamp: "2023-10-10T11:15:22Z",
    details: "Uploaded 'Women's Health Guide 2023.pdf'",
  },
  {
    id: "4",
    type: "event_created",
    user: "Bob Johnson",
    timestamp: "2023-10-09T16:30:00Z",
    details: "Created new event 'Wellness Workshop' for Nov 15",
  },
  {
    id: "5",
    type: "feedback",
    user: "Anonymous",
    timestamp: "2023-10-08T09:12:45Z",
    details: "Submitted feedback about resource accessibility",
  },
  {
    id: "6",
    type: "login",
    user: "Alice Brown",
    timestamp: "2023-10-07T13:20:15Z",
    details: "Logged in from 192.168.1.5",
  },
];

export function RecentActivities({ userId }: { userId: string }) {
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
      case "login":
        return <UserCircleIcon className="h-5 w-5 text-blue-500" />;
      case "user_created":
        return <UserCircleIcon className="h-5 w-5 text-green-500" />;
      case "resource_added":
        return <FileTextIcon className="h-5 w-5 text-amber-500" />;
      case "event_created":
        return <CalendarIcon className="h-5 w-5 text-purple-500" />;
      case "feedback":
        return <BookmarkIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest actions in your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                  <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 