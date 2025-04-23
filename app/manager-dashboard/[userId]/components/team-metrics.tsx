'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TeamMetrics() {
  return (
    <Card className="col-span-4">
      <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-3">
        <CardTitle className="text-base sm:text-lg">Team Performance Metrics</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Track your team&apos;s performance and productivity
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 pb-3 sm:pb-6">
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 h-auto mb-2 sm:mb-4">
            <TabsTrigger 
              value="overview" 
              className="text-xs sm:text-sm py-1 sm:py-1.5 h-auto"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="projects" 
              className="text-xs sm:text-sm py-1 sm:py-1.5 h-auto"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="attendance" 
              className="text-xs sm:text-sm py-1 sm:py-1.5 h-auto"
            >
              Attendance
            </TabsTrigger>
            <TabsTrigger 
              value="leave" 
              className="text-xs sm:text-sm py-1 sm:py-1.5 h-auto"
            >
              Leave
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="p-2 sm:p-4">
            <div className="h-[200px] sm:h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-xs sm:text-sm text-muted-foreground">Team performance overview chart would appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="projects" className="p-2 sm:p-4">
            <div className="h-[200px] sm:h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-xs sm:text-sm text-muted-foreground">Project completion statistics would appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="attendance" className="p-2 sm:p-4">
            <div className="h-[200px] sm:h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-xs sm:text-sm text-muted-foreground">Team attendance records would appear here</p>
            </div>
          </TabsContent>
          <TabsContent value="leave" className="p-2 sm:p-4">
            <div className="h-[200px] sm:h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-xs sm:text-sm text-muted-foreground">Leave request statistics would appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 