'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Calendar, 
  Activity, 
  Clock, 
  MessageSquare, 
  Calendar as CalendarIcon,
  Heart,
  PlusCircle
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EmployeeDashboard({ params }: { params: { userId: string } }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login');
    },
  });
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

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
          className="mt-4 md:mt-0 bg-pink-600 hover:bg-pink-700"
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
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Period Prediction</CardTitle>
                <Calendar className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">March 15</div>
                <p className="text-xs text-muted-foreground">7 days from now</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mood Status</CardTitle>
                <Heart className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Good</div>
                <p className="text-xs text-muted-foreground">Last 7 days average</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                <Clock className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">March 10 - Gynecological Exam</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Activity</CardTitle>
                <Activity className="h-4 w-4 text-pink-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Health Index</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Monthly Health Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">Health data chart will be displayed here</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-lg border p-3">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Period Reminder</p>
                      <p className="text-sm text-muted-foreground">
                        Your next period is expected to start in 7 days
                      </p>
                    </div>
                    <CalendarIcon className="h-5 w-5 text-pink-500" />
                  </div>
                  
                  <div className="flex items-start gap-4 rounded-lg border p-3">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Appointment Confirmation</p>
                      <p className="text-sm text-muted-foreground">
                        Your gynecological exam appointment has been confirmed
                      </p>
                    </div>
                    <Clock className="h-5 w-5 text-pink-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="cycle" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Period Calendar</CardTitle>
              <CardDescription>
                Track and predict your menstrual cycle
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center border-t pt-4">
              <p className="text-muted-foreground text-center">Period calendar will be displayed here</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Record Symptoms</Button>
              <Button>Update Cycle</Button>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cycle Analysis</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">Cycle analysis chart will be displayed here</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Symptom Records</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex flex-col space-y-4 border-t pt-4">
                <div className="flex justify-between items-center">
                  <p>Abdominal Pain</p>
                  <div className="flex">
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-200"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-300"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-400"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-gray-200"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-gray-200"></span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p>Mood Swings</p>
                  <div className="flex">
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-200"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-300"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-gray-200"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-gray-200"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-gray-200"></span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p>Fatigue</p>
                  <div className="flex">
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-200"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-300"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-400"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-pink-500"></span>
                    <span className="block w-4 h-4 mx-1 rounded-full bg-gray-200"></span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Status Tracking</CardTitle>
              <CardDescription>
                Record and monitor your overall health condition
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center border-t pt-4">
              <p className="text-muted-foreground text-center">Health status chart will be displayed here</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add Today's Record</Button>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Mood Records</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">Mood tracking chart will be displayed here</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sleep Quality</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">Sleep quality chart will be displayed here</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Stress Level</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">Stress level chart will be displayed here</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Medical Appointments</CardTitle>
              <CardDescription>
                Manage your upcoming medical appointments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 border-t pt-4">
              <div className="rounded-lg border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Gynecological Examination</h3>
                    <p className="text-sm text-muted-foreground mt-1">March 10, 2023 - 10:00 AM</p>
                    <p className="text-sm text-muted-foreground">Women's Health Clinic, Floor 3</p>
                  </div>
                  <Button variant="outline" size="sm">Reschedule</Button>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Annual Health Check</h3>
                    <p className="text-sm text-muted-foreground mt-1">April 15, 2023 - 9:30 AM</p>
                    <p className="text-sm text-muted-foreground">General Hospital, Health Check Center</p>
                  </div>
                  <Button variant="outline" size="sm">Reschedule</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Book New Appointment
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 border-t pt-4">
              <div className="rounded-lg border p-4 bg-muted/50">
                <div>
                  <h3 className="font-medium">General Consultation</h3>
                  <p className="text-sm text-muted-foreground mt-1">February 5, 2023 - 11:00 AM</p>
                  <p className="text-sm text-muted-foreground">Dr. Sarah Johnson</p>
                </div>
              </div>
              
              <div className="rounded-lg border p-4 bg-muted/50">
                <div>
                  <h3 className="font-medium">Blood Test</h3>
                  <p className="text-sm text-muted-foreground mt-1">January 20, 2023 - 8:30 AM</p>
                  <p className="text-sm text-muted-foreground">Medical Laboratory, Floor 1</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 