'use client';

import { useState } from "react";
import { Filter, MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

// Sample team members data
const teamMembers = [
  { id: 1, name: 'Alex Johnson', email: 'alex@company.com', role: 'Employee', department: 'Engineering' },
  { id: 2, name: 'Sarah Wilson', email: 'sarah@company.com', role: 'Manager', department: 'Design' },
  { id: 3, name: 'Taylor Brown', email: 'taylor@company.com', role: 'Employee', department: 'Marketing' },
  { id: 4, name: 'Jordan Smith', email: 'jordan@company.com', role: 'HR Lead', department: 'HR' },
  { id: 5, name: 'Casey Garcia', email: 'casey@company.com', role: 'Admin', department: 'IT' },
];

export function TeamMembersList() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter team members based on search query
  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="px-5 pt-4 pb-0 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <CardTitle className="text-xl mb-2 sm:mb-0">Team Members</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-[180px] lg:w-[260px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search members..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="sm" variant="outline" className="ml-0 sm:ml-2">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filter</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-1 sm:p-3 overflow-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell w-[80px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Role</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="hidden sm:table-cell">{member.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-muted-foreground md:hidden">{member.email}</div>
                          <div className="text-xs text-muted-foreground sm:hidden">
                            <Badge variant="outline" className="text-xs py-0 h-5">
                              {member.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{member.email}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{member.role}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{member.department}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin-dashboard/user/${member.id}`}>View Profile</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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