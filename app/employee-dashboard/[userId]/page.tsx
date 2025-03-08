'use client';

import { MessageSquare, FileText, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

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
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || "overview");
  
  // If the tab param changes, update the active tab
  useEffect(() => {
    if (tabParam && ['overview', 'cycle', 'health', 'appointments', 'resources'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

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
      
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        className="w-full" 
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cycle">Cycle</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
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
        
        <TabsContent value="resources">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center mb-10 max-w-md">
              <div className="inline-flex p-3 rounded-full bg-primary/10 mb-6">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Resource Library</h2>
              <p className="text-muted-foreground px-4">
                Access health guides, educational materials and company policies all in one place.
              </p>
            </div>
            <Link href={`/employee-dashboard/${params.userId}/resources`}>
              <Button size="lg" className="px-10">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Resource Library
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
      
      {activeTab === "resources" && (
        <div className="mt-12">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-md flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  Upcoming Health Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View and register for upcoming health workshops and webinars
                </p>
                <Link href={`/employee-dashboard/${params.userId}/events`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Events Calendar
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-md flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                  Share Your Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Help us improve our health support by sharing your anonymous feedback
                </p>
                <Link href={`/employee-dashboard/${params.userId}/feedback`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Submit Feedback
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
} 