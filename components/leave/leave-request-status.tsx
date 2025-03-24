"use client";

import { format } from "date-fns";
import { 
  Clock, 
  CheckCircle2, 
  XCircle,
  Calendar, 
  User,
  FileText
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LeaveRequestStatusProps {
  id: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approverNote?: string;
  approvedAt?: Date;
  approverName?: string;
}

export function LeaveRequestStatus({
  id,
  leaveType,
  startDate,
  endDate,
  reason,
  status,
  approverNote,
  approvedAt,
  approverName,
}: LeaveRequestStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "pending":
        return "Waiting for approval";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border-yellow-200";
      case "approved":
        return "bg-green-50 text-green-800 hover:bg-green-100 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-800 hover:bg-red-100 border-red-200";
    }
  };

  return (
    <Card className={cn("w-full border", getStatusColor())}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{leaveType}</CardTitle>
          <Badge 
            variant="outline" 
            className={cn(
              "flex items-center gap-1 font-normal", 
              getStatusColor()
            )}
          >
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </Badge>
        </div>
        <CardDescription>
          Leave request #{id.substring(0, 8)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(startDate), "yyyy/MM/dd")} - {format(new Date(endDate), "yyyy/MM/dd")}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground mt-1" />
            <p className="text-sm">{reason}</p>
          </div>
        </div>
      </CardContent>
      {(status === "approved" || status === "rejected") && approverNote && (
        <CardFooter className="flex flex-col items-start pt-2">
          <div className="text-sm font-medium mb-1">Approval note:</div>
          <p className="text-sm text-muted-foreground">{approverNote}</p>
          {approverName && (
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span>{approverName}</span>
              {approvedAt && (
                <span>· {format(new Date(approvedAt), "yyyy/MM/dd HH:mm")}</span>
              )}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
} 