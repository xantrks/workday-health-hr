'use client';

import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import split components
import { AppointmentsTab } from "../components/AppointmentsTab";
import CycleTab from "../components/CycleTab";
import { HealthTab } from "../components/HealthTab";
import { OverviewTab } from "../components/OverviewTab";

export default function EmployeeDashboard({ params }: { params: { userId: string } }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login');
    },
  });
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user ID matches
  useEffect(() => {
    if (session?.user && session.user.id !== params.userId) {
      router.replace(`/employee-dashboard/${session.user.id}`);
    }
  }, [session, params.userId, router]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Loading...</div>
    </div>;
  }

  if (!session?.user) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Employee Health Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {session.user.name}</p>
        </div>
        <Button 
          className="mt-4 md:mt-0"
          variant="accent"
          onClick={() => router.push(`/chat/new?userId=${params.userId}&role=employee`)}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Consult Sani Assistant
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cycle">Period Tracking</TabsTrigger>
          <TabsTrigger value="health">Health Status</TabsTrigger>
          <TabsTrigger value="appointments">Medical Appointments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab userId={params.userId} userName={session.user.name || ''} />
        </TabsContent>
        
        <TabsContent value="cycle">
          <CycleTab userId={params.userId} />
        </TabsContent>
        
        <TabsContent value="health">
          <HealthTab userId={params.userId} />
        </TabsContent>
        
        <TabsContent value="appointments">
          <AppointmentsTab userId={params.userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 