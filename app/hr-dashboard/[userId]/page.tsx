'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import types
import { DashboardTab, Resource } from './types';

// Import services
import { fetchRecentResources } from './services';

// Import components
import LoadingView from './components/LoadingView';
import DashboardHeader from './components/DashboardHeader';
import OverviewTab from './components/tabs/OverviewTab';
import ResourcesTab from './components/tabs/ResourcesTab';

/**
 * HR Dashboard Page
 * Enhanced for mobile responsiveness
 */
export default function HRDashboard({ params }: { params: { userId: string } }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login');
    },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<DashboardTab>(
    (tabParam as DashboardTab) || 'overview'
  );

  // Resource states
  const [recentResources, setRecentResources] = useState<Resource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourcesError, setResourcesError] = useState<string | null>(null);

  // Redirect if user ID doesn't match session
  useEffect(() => {
    if (session?.user && session.user.id !== params.userId) {
      router.replace(`/hr-dashboard/${session.user.id}`);
    }
  }, [session, params.userId, router]);

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam && ['overview', 'analytics', 'reports', 'notifications', 'resources'].includes(tabParam)) {
      setActiveTab(tabParam as DashboardTab);
    }
  }, [tabParam]);

  // Load resources for the resources tab
  useEffect(() => {
    if (session?.user && session.user.role === 'hr') {
      loadResources();
    }
  }, [session]);

  // Function to load resources
  const loadResources = async () => {
    setResourcesLoading(true);
    setResourcesError(null);
    
    const { resources, error } = await fetchRecentResources(5);
    
    if (error) {
      setResourcesError(error);
    } else {
      setRecentResources(resources);
    }
    
    setResourcesLoading(false);
  };

  // Loading state
  if (status === 'loading') {
    return <LoadingView />;
  }

  // No session
  if (!session?.user) return null;

  return (
    <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 max-w-[100vw] overflow-hidden">
      <DashboardHeader 
        userName={session.user.name || 'User'} 
        userId={params.userId} 
        profileImageUrl={session.user.profileImageUrl}
      />

      <Tabs defaultValue={activeTab} className="w-full" onValueChange={(value) => setActiveTab(value as DashboardTab)}>
        <TabsList className="grid w-full grid-cols-5 overflow-x-auto max-w-[100vw] mb-1 sm:mb-2">
          <TabsTrigger value="overview" className="text-xs sm:text-sm py-1.5 sm:py-2 whitespace-nowrap">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm py-1.5 sm:py-2 whitespace-nowrap">Analytics</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs sm:text-sm py-1.5 sm:py-2 whitespace-nowrap">Reports</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm py-1.5 sm:py-2 whitespace-nowrap">Notifications</TabsTrigger>
          <TabsTrigger value="resources" className="text-xs sm:text-sm py-1.5 sm:py-2 whitespace-nowrap">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <OverviewTab />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <div className="text-center py-4 sm:py-10">
            <p className="text-sm text-muted-foreground">Analytics content will be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4 sm:space-y-6">
          <div className="text-center py-4 sm:py-10">
            <p className="text-sm text-muted-foreground">Reports content will be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 sm:space-y-6">
          <div className="text-center py-4 sm:py-10">
            <p className="text-sm text-muted-foreground">Notifications content will be displayed here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <ResourcesTab
            userId={params.userId}
            recentResources={recentResources}
            resourcesLoading={resourcesLoading}
            resourcesError={resourcesError}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 