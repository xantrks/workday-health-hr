'use client';

import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, ClockIcon, UserCircleIcon, FileTextIcon, BookmarkIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <Card className="w-full">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-base sm:text-xl">Recent Activities</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Latest actions across your organization
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:p-3">
        <ScrollArea className="h-[290px] sm:h-[350px] pr-2">
          <div className="space-y-2 px-3">
            {mockActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-2 sm:space-x-3 py-2 sm:py-3 border-b last:border-0">
                <Avatar className="h-7 w-7 sm:h-9 sm:w-9">
                  <AvatarImage src={`/avatars/${index + 1}.png`} alt={activity.user} />
                  <AvatarFallback>
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm font-medium leading-none truncate">{activity.user}</p>
                    <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm line-clamp-2">{activity.details}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 