'use client';

import { MessageSquare, FileText, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
          <div className="grid gap-4 grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Health Resource Library</CardTitle>
                <CardDescription>
                  Browse health resources and policy documents provided by the company
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Menstrual Health Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        View educational resources and articles about menstrual health
                      </p>
                    </CardContent>
                    <CardContent className="pt-0">
                      <Link href={`/employee-dashboard/${params.userId}/resources?tab=menstrual`}>
                        <Button variant="secondary" className="w-full">Browse Resources</Button>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Menopause Health Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        Learn about menopause health knowledge and support information
                      </p>
                    </CardContent>
                    <CardContent className="pt-0">
                      <Link href={`/employee-dashboard/${params.userId}/resources?tab=menopause`}>
                        <Button variant="secondary" className="w-full">Browse Resources</Button>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Company Policies</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        Access company policies related to health benefits and leave
                      </p>
                    </CardContent>
                    <CardContent className="pt-0">
                      <Link href={`/employee-dashboard/${params.userId}/resources?tab=policy`}>
                        <Button variant="secondary" className="w-full">Browse Policies</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-right mt-4">
                  <Link href={`/employee-dashboard/${params.userId}/resources`}>
                    <Button variant="link">View All Resources</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-2 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resources
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <Link href={`/employee-dashboard/${params.userId}/resources`}>
              <Button className="w-full">
                View Health Resources
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-2">
            <Link href={`/employee-dashboard/${params.userId}/events`}>
              <Button className="w-full">
                View Health Events
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 