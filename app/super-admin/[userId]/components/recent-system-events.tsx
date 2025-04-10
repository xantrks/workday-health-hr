'use client';

import { 
  AlertTriangleIcon, 
  ShieldIcon, 
  UserPlusIcon, 
  BuildingIcon, 
  Settings2Icon,
  BellIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type SystemEvent = {
  id: string;
  type: "security" | "user" | "organization" | "system" | "config" | "notification";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  timestamp: string;
  details?: string;
};

// Mock data - would be fetched from server
const mockSystemEvents: SystemEvent[] = [
  {
    id: "1",
    type: "security",
    severity: "high",
    message: "Multiple failed login attempts detected",
    timestamp: "2023-10-12T08:45:30Z",
    details: "5 failed attempts from IP 192.168.1.1"
  },
  {
    id: "2",
    type: "user",
    severity: "low",
    message: "New administrator account created",
    timestamp: "2023-10-11T14:22:10Z",
    details: "Administrator account for Acme Corp"
  },
  {
    id: "3",
    type: "organization",
    severity: "medium",
    message: "Organization subscription upgraded",
    timestamp: "2023-10-10T11:15:22Z",
    details: "Globex Inc upgraded to Enterprise plan"
  },
  {
    id: "4",
    type: "system",
    severity: "critical",
    message: "Database backup failure",
    timestamp: "2023-10-09T16:30:00Z",
    details: "Scheduled backup job failed to complete"
  },
  {
    id: "5",
    type: "config",
    severity: "low",
    message: "System settings updated",
    timestamp: "2023-10-08T09:12:45Z",
    details: "Email notification settings modified"
  },
  {
    id: "6",
    type: "notification",
    severity: "medium",
    message: "Platform-wide announcement sent",
    timestamp: "2023-10-07T13:20:15Z",
    details: "Scheduled maintenance announcement"
  },
];

export function RecentSystemEvents({ userId }: { userId: string }) {
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

  // Get icon based on event type
  const getEventIcon = (type: SystemEvent["type"], severity: SystemEvent["severity"]) => {
    let icon;
    switch (type) {
      case "security":
        icon = <ShieldIcon />;
        break;
      case "user":
        icon = <UserPlusIcon />;
        break;
      case "organization":
        icon = <BuildingIcon />;
        break;
      case "system":
        icon = <AlertTriangleIcon />;
        break;
      case "config":
        icon = <Settings2Icon />;
        break;
      case "notification":
        icon = <BellIcon />;
        break;
      default:
        icon = <AlertTriangleIcon />;
    }

    // Color based on severity
    const severityColors = {
      low: "text-blue-500",
      medium: "text-yellow-500",
      high: "text-orange-500",
      critical: "text-red-500"
    };

    return (
      <div className={`h-5 w-5 ${severityColors[severity]}`}>
        {icon}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Events</CardTitle>
        <CardDescription>Recent system-wide events and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {mockSystemEvents.map((event) => (
              <div key={event.id} className="flex items-start space-x-4">
                <div className="mt-0.5">{getEventIcon(event.type, event.severity)}</div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{event.message}</p>
                  {event.details && (
                    <p className="text-sm text-muted-foreground">{event.details}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{formatRelativeTime(event.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 