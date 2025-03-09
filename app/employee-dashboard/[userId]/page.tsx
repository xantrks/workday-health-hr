'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import types
import { DashboardTab } from './types';

// Import components
import LoadingView from './components/LoadingView';
import DashboardHeader from './components/DashboardHeader';
import { OverviewTab } from '../components/OverviewTab';
import CycleTab from '../components/CycleTab';
import { HealthTab } from '../components/HealthTab';
import { AppointmentsTab } from '../components/AppointmentsTab';
import ResourcesTab from './components/ResourcesTab';

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
  const [activeTab, setActiveTab] = useState<DashboardTab>(
    (tabParam as DashboardTab) || 'overview'
  );
  
  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam && ['overview', 'cycle', 'health', 'appointments', 'resources'].includes(tabParam)) {
      setActiveTab(tabParam as DashboardTab);
    }
  }, [tabParam]);

  // Redirect if user ID doesn't match session
  useEffect(() => {
    if (session?.user && session.user.id !== params.userId) {
      router.replace(`/employee-dashboard/${session.user.id}`);
    }
  }, [session, params.userId, router]);

  // Loading state
  if (status === 'loading') {
    return <LoadingView />;
  }

  // No session
  if (!session?.user) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <DashboardHeader 
        userName={session.user.name || 'User'} 
        userId={params.userId} 
      />
      
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        className="w-full" 
        onValueChange={(value) => setActiveTab(value as DashboardTab)}
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
          <ResourcesTab userId={params.userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 