'use client';

import { MessageSquare, FileText, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="cycle">周期</TabsTrigger>
          <TabsTrigger value="health">健康</TabsTrigger>
          <TabsTrigger value="appointments">预约</TabsTrigger>
          <TabsTrigger value="resources">资源</TabsTrigger>
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
                <CardTitle>健康资源库</CardTitle>
                <CardDescription>
                  浏览公司提供的健康资源和政策文件
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">月经健康资源</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        查看关于月经健康的教育资源和文章
                      </p>
                    </CardContent>
                    <CardContent className="pt-0">
                      <Link href={`/employee-dashboard/${params.userId}/resources?tab=月经`}>
                        <Button variant="secondary" className="w-full">浏览资源</Button>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">更年期健康资源</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        了解更年期健康知识和支持信息
                      </p>
                    </CardContent>
                    <CardContent className="pt-0">
                      <Link href={`/employee-dashboard/${params.userId}/resources?tab=更年期`}>
                        <Button variant="secondary" className="w-full">浏览资源</Button>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">公司政策文件</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">
                        查看公司健康福利和相关政策
                      </p>
                    </CardContent>
                    <CardContent className="pt-0">
                      <Link href={`/employee-dashboard/${params.userId}/resources?tab=政策`}>
                        <Button variant="secondary" className="w-full">浏览文件</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-4">
                  <Link href={`/employee-dashboard/${params.userId}/resources`}>
                    <Button className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      查看所有资源
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 