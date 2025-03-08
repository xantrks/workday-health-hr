'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { 
  Users, 
  Activity, 
  Calendar, 
  MessageSquare, 
  BarChart,
  Heart,
  PieChart,
  FileText,
  Upload,
  ExternalLink,
  Files,
  CalendarPlus
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Add resource type definition
interface Resource {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdById: string;
  viewCount: number;
  downloadCount: number;
}

export default function HRDashboard({ params }: { params: { userId: string } }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login');
    },
  });
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Add resource states and functions
  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourcesError, setResourcesError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user && session.user.id !== params.userId) {
      router.replace(`/hr-dashboard/${session.user.id}`);
    }
  }, [session, params.userId, router]);

  // Fetch recently uploaded resources
  const fetchRecentResources = async () => {
    setResourcesLoading(true);
    setResourcesError(null);
    try {
      const response = await fetch('/api/resources?limit=5');
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      const data = await response.json();
      setRecentResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setResourcesError('Failed to fetch resource list, please try again');
    } finally {
      setResourcesLoading(false);
    }
  };

  // Fetch resources on component mount
  useEffect(() => {
    if (session?.user && session.user.role === 'hr') {
      fetchRecentResources();
    }
  }, [session]);

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
          <h1 className="text-3xl font-bold text-primary">HR Health Management Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {session.user.name}</p>
        </div>
        <Button 
          className="mt-4 md:mt-0"
          variant="accent"
          onClick={() => router.push(`/chat/new?userId=${params.userId}&role=hr`)}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Consult Sani Assistant
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="resources">Resources Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">248</div>
                <p className="text-xs text-muted-foreground">+12 from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leave Rate</CardTitle>
                <Calendar className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2%</div>
                <p className="text-xs text-muted-foreground">-0.5% from last month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Satisfaction</CardTitle>
                <Heart className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">+2% from last quarter</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96.8%</div>
                <p className="text-xs text-muted-foreground">+0.3% from last month</p>
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
                <CardTitle>Department Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">Department distribution chart will be displayed here</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="leave" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leave Analysis</CardTitle>
              <CardDescription>
                Track and analyze employee leave patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center border-t pt-4">
              <p className="text-muted-foreground text-center">Leave analysis chart will be displayed here</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Export Data</Button>
              <Button>Generate Report</Button>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Leave Types Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">Leave types chart will be displayed here</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Department Leave Comparison</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">Department comparison chart will be displayed here</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="workforce" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workforce Planning</CardTitle>
              <CardDescription>
                Manage and plan workforce scheduling
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center border-t pt-4">
              <p className="text-muted-foreground text-center">Workforce planning chart will be displayed here</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Update Schedule</Button>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Department Headcount</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">Department headcount chart will be displayed here</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Shift Coverage</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">Shift coverage chart will be displayed here</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Overtime Analysis</CardTitle>
              </CardHeader>
              <CardContent className="h-60 flex items-center justify-center border-t pt-4">
                <p className="text-muted-foreground text-center">Overtime analysis chart will be displayed here</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Trends Analysis</CardTitle>
              <CardDescription>
                Monitor employee health trends and patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 border-t pt-4">
              <div className="rounded-lg border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Stress Level Trends</h3>
                    <p className="text-sm text-muted-foreground mt-1">Average stress level has decreased by 5% this quarter</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Work-Life Balance Satisfaction</h3>
                    <p className="text-sm text-muted-foreground mt-1">Satisfaction rate has increased to 82%</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Mental Health Support Utilization</h3>
                    <p className="text-sm text-muted-foreground mt-1">15% increase in support program participation</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Generate Comprehensive Report</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Health Initiative Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 border-t pt-4">
              <div className="rounded-lg border p-4 bg-muted/50">
                <div>
                  <h3 className="font-medium">Wellness Program</h3>
                  <p className="text-sm text-muted-foreground mt-1">Participation: 68% | Satisfaction: 92%</p>
                  <p className="text-sm text-muted-foreground">Impact: 12% reduction in stress-related leave</p>
                </div>
              </div>
              
              <div className="rounded-lg border p-4 bg-muted/50">
                <div>
                  <h3 className="font-medium">Mental Health Awareness</h3>
                  <p className="text-sm text-muted-foreground mt-1">Participation: 75% | Satisfaction: 88%</p>
                  <p className="text-sm text-muted-foreground">Impact: 8% increase in work satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Upload Resources
                </CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Link href={`/hr-dashboard/${params.userId}/resources/upload`}>
                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Resource
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Manage Resources
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Link href={`/hr-dashboard/${params.userId}/resources/manage`}>
                  <Button className="w-full">
                    <Files className="mr-2 h-4 w-4" />
                    Manage Resources
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Create Event
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Link href={`/hr-dashboard/${params.userId}/events/create`}>
                  <Button className="w-full">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Create New Event
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Manage Events
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Link href={`/hr-dashboard/${params.userId}/events/manage`}>
                  <Button className="w-full">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Event Calendar
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Employee Feedback
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Link href={`/hr-dashboard/${params.userId}/feedback`}>
                  <Button className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    View Employee Feedback
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Recently Uploaded Resources</CardTitle>
                <CardDescription>
                  View and manage recently uploaded policy documents and educational resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resourcesLoading ? (
                  <p className="text-center text-muted-foreground py-4">
                    Loading...
                  </p>
                ) : resourcesError ? (
                  <p className="text-center text-destructive py-4">
                    {resourcesError}
                  </p>
                ) : recentResources.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">
                    No resources uploaded yet, <Link href={`/hr-dashboard/${params.userId}/resources/upload`} className="text-primary">upload resources</Link> now
                  </p>
                ) : (
                  <div className="space-y-4">
                    {recentResources.map((resource) => (
                      <div key={resource.id} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{resource.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(resource.createdAt).toLocaleDateString('en-US')} · {resource.category}
                            </p>
                          </div>
                        </div>
                        <Link href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                    <div className="pt-2">
                      <Link href={`/hr-dashboard/${params.userId}/resources/manage`}>
                        <Button variant="outline" className="w-full">View All Resources</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 