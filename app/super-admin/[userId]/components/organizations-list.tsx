'use client';

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Organization = {
  id: string;
  name: string;
  plan: "basic" | "professional" | "business" | "enterprise";
  userCount: number;
  createdAt: string;
  status: "active" | "inactive" | "trial" | "suspended";
};

// Mock data for display purposes
const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Acme Corporation",
    plan: "enterprise",
    userCount: 125,
    createdAt: "2023-01-15T10:30:00Z",
    status: "active",
  },
  {
    id: "2",
    name: "Globex Inc.",
    plan: "business",
    userCount: 78,
    createdAt: "2023-03-22T14:20:00Z",
    status: "active",
  },
  {
    id: "3",
    name: "Initech",
    plan: "professional",
    userCount: 45,
    createdAt: "2023-05-10T09:15:00Z",
    status: "trial",
  },
  {
    id: "4",
    name: "Massive Dynamic",
    plan: "enterprise",
    userCount: 210,
    createdAt: "2023-02-05T16:45:00Z",
    status: "active",
  },
  {
    id: "5",
    name: "Cyberdyne Systems",
    plan: "basic",
    userCount: 23,
    createdAt: "2023-07-01T11:10:00Z",
    status: "inactive",
  },
];

export function OrganizationsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);

  // Filter organizations based on search query
  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get badge color based on status
  const getStatusBadgeVariant = (status: Organization["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "trial":
        return "warning";
      case "suspended":
        return "destructive";
      default:
        return "default";
    }
  };

  // Get badge color based on plan
  const getPlanBadgeVariant = (plan: Organization["plan"]) => {
    switch (plan) {
      case "basic":
        return "outline";
      case "professional":
        return "secondary";
      case "business":
        return "default";
      case "enterprise":
        return "premium";
      default:
        return "default";
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Organizations</CardTitle>
        <CardDescription>Manage all organizations on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="w-full max-w-sm">
            <Input
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>Add Organization</Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrganizations.length > 0 ? (
                filteredOrganizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://avatar.vercel.sh/${org.id}.png`} alt={org.name} />
                          <AvatarFallback>{org.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{org.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPlanBadgeVariant(org.plan) as any}>
                        {org.plan.charAt(0).toUpperCase() + org.plan.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{org.userCount}</TableCell>
                    <TableCell>{formatDate(org.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(org.status) as any}>
                        {org.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No organizations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
} 