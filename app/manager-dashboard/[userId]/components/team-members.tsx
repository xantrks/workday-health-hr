'use client';

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  status: "active" | "vacation" | "sick" | "remote";
  performance: "excellent" | "good" | "average" | "needs-improvement";
};

// Mock data - would be fetched from server
const mockTeamMembers: TeamMember[] = [
  { 
    id: "1", 
    name: "Alice Johnson", 
    email: "alice@example.com", 
    position: "Senior Developer", 
    department: "Engineering", 
    status: "active",
    performance: "excellent" 
  },
  { 
    id: "2", 
    name: "Bob Smith", 
    email: "bob@example.com", 
    position: "UX Designer", 
    department: "Design", 
    status: "vacation",
    performance: "good" 
  },
  { 
    id: "3", 
    name: "Carol Williams", 
    email: "carol@example.com", 
    position: "Product Manager", 
    department: "Product", 
    status: "remote",
    performance: "excellent" 
  },
  { 
    id: "4", 
    name: "David Brown", 
    email: "david@example.com", 
    position: "Junior Developer", 
    department: "Engineering", 
    status: "active",
    performance: "average" 
  },
  { 
    id: "5", 
    name: "Eve Davis", 
    email: "eve@example.com", 
    position: "QA Engineer", 
    department: "Quality Assurance", 
    status: "sick",
    performance: "good" 
  },
];

export function TeamMembers({ managerId }: { managerId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  
  // Filter team members based on search query
  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get member initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Get status badge color
  const getStatusBadge = (status: TeamMember["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "vacation":
        return <Badge variant="outline">Vacation</Badge>;
      case "sick":
        return <Badge variant="destructive">Sick Leave</Badge>;
      case "remote":
        return <Badge variant="secondary">Remote</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Get performance badge color
  const getPerformanceBadge = (performance: TeamMember["performance"]) => {
    switch (performance) {
      case "excellent":
        return <Badge className="bg-green-500">Excellent</Badge>;
      case "good":
        return <Badge className="bg-blue-500">Good</Badge>;
      case "average":
        return <Badge className="bg-yellow-500">Average</Badge>;
      case "needs-improvement":
        return <Badge className="bg-red-500">Needs Improvement</Badge>;
      default:
        return <Badge>Not Rated</Badge>;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Manage your direct reports and their performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="w-full max-w-sm">
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>Add Team Member</Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://avatar.vercel.sh/${member.id}.png`} alt={member.name} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell>{getPerformanceBadge(member.performance)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No team members found.
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