'use client';

import React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AdminMetrics() {
  const [activeTab, setActiveTab] = React.useState("users");

  return (
    <Card className="h-full w-full">
      <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-base sm:text-lg">Organization Metrics</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          View detailed metrics and trends for your organization
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 pb-2 sm:pb-4">
        <div className="space-y-3 sm:space-y-4 min-w-[250px]">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger
                value="users"
                className="text-xs sm:text-sm py-1 sm:py-2 px-1 sm:px-3"
                onClick={() => setActiveTab("users")}
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="text-xs sm:text-sm py-1 sm:py-2 px-1 sm:px-3"
                onClick={() => setActiveTab("events")}
              >
                Events
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="text-xs sm:text-sm py-1 sm:py-2 px-1 sm:px-3"
                onClick={() => setActiveTab("resources")}
              >
                Resources
              </TabsTrigger>
              <TabsTrigger
                value="health"
                className="text-xs sm:text-sm py-1 sm:py-2 px-1 sm:px-3"
                onClick={() => setActiveTab("health")}
              >
                Health
              </TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="mt-3 sm:mt-4">
              <div className="flex items-center justify-center h-32 sm:h-56 border rounded-md">
                <p className="text-xs sm:text-sm text-muted-foreground">Visualization for user metrics coming soon</p>
              </div>
            </TabsContent>
            <TabsContent value="events" className="mt-3 sm:mt-4">
              <div className="flex items-center justify-center h-32 sm:h-56 border rounded-md">
                <p className="text-xs sm:text-sm text-muted-foreground">Visualization for event metrics coming soon</p>
              </div>
            </TabsContent>
            <TabsContent value="resources" className="mt-3 sm:mt-4">
              <div className="flex items-center justify-center h-32 sm:h-56 border rounded-md">
                <p className="text-xs sm:text-sm text-muted-foreground">Visualization for resource metrics coming soon</p>
              </div>
            </TabsContent>
            <TabsContent value="health" className="mt-3 sm:mt-4">
              <div className="flex items-center justify-center h-32 sm:h-56 border rounded-md">
                <p className="text-xs sm:text-sm text-muted-foreground">Visualization for health metrics coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
} 