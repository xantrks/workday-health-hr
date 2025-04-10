'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PlatformStats() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Platform Statistics</CardTitle>
        <CardDescription>
          Monitor key metrics across the entire platform
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <Tabs defaultValue="growth">
          <TabsList>
            <TabsTrigger value="growth">Growth</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          <TabsContent value="growth" className="p-4">
            <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">Platform growth chart would appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="organizations" className="p-4">
            <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">Organization statistics would appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="users" className="p-4">
            <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">User analytics would appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="resources" className="p-4">
            <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">Resource usage statistics would appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 