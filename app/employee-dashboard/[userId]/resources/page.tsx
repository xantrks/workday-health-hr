'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import DashboardLayout from "../../components/DashboardLayout";

import { Resource, ViewMode } from './types';
import { fetchResources } from './services';
import { getCategoryCounts, getFilteredResources, getPopularResources } from './utils';
import SearchSidebar from './components/SearchSidebar';
import PopularResources from './components/PopularResources';
import ResourceTabs from './components/ResourceTabs';

export default function EmployeeResourcesPage({ params }: { params: { userId: string } }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login');
    },
  });
  const router = useRouter();
  
  // State management
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [popularResources, setPopularResources] = useState<Resource[]>([]);

  // Load resources when component mounts
  useEffect(() => {
    if (session) {
      const loadResources = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchResources();
          setResources(data);
          // Set popular resources (top 3 by view count)
          setPopularResources(getPopularResources(data, 3));
        } catch (error) {
          console.error('Error loading resources:', error);
          setError('Failed to fetch resource list, please try again');
        } finally {
          setLoading(false);
        }
      };
      
      loadResources();
    }
  }, [session]);

  // Apply filters to resources
  const filteredResources = getFilteredResources(
    resources,
    searchTerm,
    categoryFilter,
    fileTypeFilter,
    activeTab
  );
  
  // Get category counts for tabs
  const categoryCounts = getCategoryCounts(resources);

  return (
    <DashboardLayout 
      userId={params.userId}
      title="Health Resource Library"
      description="Access health resources, guides and policy documents to support your wellbeing"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search */}
          <SearchSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            fileTypeFilter={fileTypeFilter}
            setFileTypeFilter={setFileTypeFilter}
          />

          {/* Popular Resources */}
          <PopularResources resources={popularResources} />
        </div>
        
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <ResourceTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            viewMode={viewMode}
            setViewMode={setViewMode}
            filteredResources={filteredResources}
            categoryCounts={categoryCounts}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </DashboardLayout>
  );
} 