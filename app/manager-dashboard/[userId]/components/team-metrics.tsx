'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TeamMetrics() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Team Performance Metrics</CardTitle>
        <CardDescription>
          Track your team&apos;s performance and productivity
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="leave">Leave Requests</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="p-4">
            <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">Team performance overview chart would appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="projects" className="p-4">
            <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">Project completion statistics would appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="attendance" className="p-4">
            <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">Team attendance records would appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="leave" className="p-4">
            <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">Leave request statistics would appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 