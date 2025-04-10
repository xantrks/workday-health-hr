'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AdminMetrics() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Organization Analytics</CardTitle>
        <CardDescription>
          Monitor key metrics across your organization
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="health">Health Records</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="p-4">
            <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">User metrics visualization would appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="events" className="p-4">
            <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">Event metrics visualization would appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="resources" className="p-4">
            <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">Resource usage visualization would appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="health" className="p-4">
            <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">Health data aggregation would appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 