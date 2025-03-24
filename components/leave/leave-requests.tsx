"use client";

import { format } from "date-fns";
import { 
  Clock, 
  CheckCircle2, 
  XCircle,
  Calendar, 
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LeaveRequest {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  reason: string;
  approverNote?: string;
  approvedAt?: string;
}

interface LeaveRequestsProps {
  leaveRequests: LeaveRequest[];
}

export function LeaveRequests({ leaveRequests }: LeaveRequestsProps) {
  if (!leaveRequests || leaveRequests.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-muted-foreground">No leave records found</p>
      </div>
    );
  }

  const pendingRequests = leaveRequests.filter(
    (request) => request.status === "pending" || request.status === "waiting for approval"
  );
  const approvedRequests = leaveRequests.filter(
    (request) => request.status === "approved"
  );
  const rejectedRequests = leaveRequests.filter(
    (request) => request.status === "rejected"
  );

  const getStatusIcon = (status: string) => {
    if (status === "pending" || status === "waiting for approval") {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    } else if (status === "approved") {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    } else if (status === "rejected") {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getStatusColor = (status: string) => {
    if (status === "pending" || status === "waiting for approval") {
      return "bg-yellow-50 text-yellow-800 border-yellow-200";
    } else if (status === "approved") {
      return "bg-green-50 text-green-800 border-green-200";
    } else if (status === "rejected") {
      return "bg-red-50 text-red-800 border-red-200";
    }
    return "";
  };

  const LeaveRequestCard = ({ request }: { request: LeaveRequest }) => (
    <div className={cn("p-4 rounded-lg border mb-3", getStatusColor(request.status))}>
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{request.leaveType}</h4>
        <div className="flex items-center gap-1 text-sm">
          {getStatusIcon(request.status)}
          <span>{request.status}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2 text-sm">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>
          {format(new Date(request.startDate), "yyyy/MM/dd")} - {format(new Date(request.endDate), "yyyy/MM/dd")}
        </span>
      </div>
      <p className="mt-2 text-sm">{request.reason}</p>
      {request.approverNote && (
        <div className="mt-2 text-sm border-t pt-2">
          <p className="font-medium">审批备注:</p>
          <p className="text-muted-foreground">{request.approverNote}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">My leave records</h3>
          <TabsList>
            <TabsTrigger value="all" className="text-xs">All ({leaveRequests.length})</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">Waiting for approval ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="approved" className="text-xs">Approved ({approvedRequests.length})</TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs">Rejected ({rejectedRequests.length})</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          {leaveRequests.map((request) => (
            <LeaveRequestCard key={request.id} request={request} />
          ))}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <LeaveRequestCard key={request.id} request={request} />
            ))
          ) : (
            <p className="text-center p-4 text-muted-foreground">No leave requests waiting for approval</p>
          )}
        </TabsContent>
        
        <TabsContent value="approved" className="mt-0">
          {approvedRequests.length > 0 ? (
            approvedRequests.map((request) => (
              <LeaveRequestCard key={request.id} request={request} />
            ))
          ) : (
            <p className="text-center p-4 text-muted-foreground">No approved leave requests</p>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-0">
          {rejectedRequests.length > 0 ? (
            rejectedRequests.map((request) => (
              <LeaveRequestCard key={request.id} request={request} />
            ))
          ) : (
            <p className="text-center p-4 text-muted-foreground">No rejected leave requests</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 