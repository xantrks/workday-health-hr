'use client';

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type UserInfo = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive";
};

// Mock data - would be fetched from server
const mockUsers: UserInfo[] = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "HR Manager", department: "Human Resources", status: "active" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Employee", department: "Engineering", status: "active" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "Manager", department: "Marketing", status: "active" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", role: "Employee", department: "Finance", status: "inactive" },
  { id: "5", name: "Charlie Wilson", email: "charlie@example.com", role: "Employee", department: "Product", status: "active" },
];

export function OrganizationUsers({ organizationId }: { organizationId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserInfo[]>(mockUsers);
  
  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get user initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="mt-4 sm:mt-6 w-full">
      <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">Organization Users</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Manage users in your organization</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
          <div className="w-full sm:max-w-xs">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm"
            />
          </div>
          <Button className="w-full sm:w-auto text-sm" size="sm" aria-label="Add User">Add User</Button>
        </div>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Role</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium min-w-[180px]">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                          <AvatarImage src={`https://avatar.vercel.sh/${user.id}.png`} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                          <div className="sm:hidden text-xs mt-1">
                            <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{user.department}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"} className="text-xs">
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-auto sm:px-3 p-0">
                        <span className="hidden sm:inline">Edit</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-sm">
                    No users found.
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