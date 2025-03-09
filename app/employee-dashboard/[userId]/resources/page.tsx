'use client';

import { Search, Grid, List } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Local imports
import DashboardLayout from "../../components/DashboardLayout";
import PopularResources from './components/PopularResources';
import ResourceGrid from './components/ResourceGrid';
import ResourceList from './components/ResourceList';
import { fetchResources } from './services';
import { Resource, ViewMode } from './types';
import { getCategoryCounts, getFilteredResources, getPopularResources } from './utils';

// Color schemes for different resource categories
const CATEGORY_COLORS = {
  policy_documents: "bg-blue-50 text-blue-600 border-blue-200",
  menstrual_health_resources: "bg-rose-50 text-rose-600 border-rose-200",
  menopause_health_resources: "bg-amber-50 text-amber-600 border-amber-200",
  workshop_materials: "bg-emerald-50 text-emerald-600 border-emerald-200",
  others: "bg-purple-50 text-purple-600 border-purple-200",
  all: "bg-gray-50 text-gray-600 border-gray-200"
};

// Color schemes for different file types
const FILE_TYPE_COLORS = {
  pdf: "bg-red-50 text-red-600 border-red-200",
  word: "bg-blue-50 text-blue-600 border-blue-200",
  presentation: "bg-orange-50 text-orange-600 border-orange-200",
  spreadsheet: "bg-green-50 text-green-600 border-green-200",
  image: "bg-purple-50 text-purple-600 border-purple-200",
  video: "bg-pink-50 text-pink-600 border-pink-200",
  text: "bg-slate-50 text-slate-600 border-slate-200",
  all: "bg-gray-50 text-gray-600 border-gray-200"
};

// Category display names (shortened) - same as in other components
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  policy_documents: "Policy",
  menstrual_health_resources: "Menstrual",
  menopause_health_resources: "Menopause",
  workshop_materials: "Workshop",
  others: "Other",
  all: "All Categories"
};

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
    'all' // Pass default 'all' as activeTab parameter to maintain compatibility
  );
  
  // Get category counts for display
  const categoryCounts = getCategoryCounts(resources);

  // Get color class for the category
  const getCategoryColorClass = (category: string) => {
    return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.others;
  };

  // Get color class for the file type
  const getFileTypeColorClass = (fileType: string) => {
    return FILE_TYPE_COLORS[fileType as keyof typeof FILE_TYPE_COLORS] || FILE_TYPE_COLORS.text;
  };
  
  // Get short display name for category
  const getCategoryDisplayName = (category: string) => {
    const key = category as keyof typeof CATEGORY_DISPLAY_NAMES;
    return CATEGORY_DISPLAY_NAMES[key] || category;
  };

  return (
    <DashboardLayout 
      userId={params.userId}
      title="Health Resource Library"
      description="Access health resources, guides and policy documents to support your wellbeing"
    >
      {/* New Horizontal Search & Filter Bar */}
      <Card className="mb-6 border shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-primary/10 focus:border-primary/30 focus:ring-primary/20"
              />
            </div>
            
            <div className="flex-shrink-0 w-full md:w-auto">
              <Select 
                value={categoryFilter} 
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className={`w-full md:w-auto md:min-w-[200px] border ${getCategoryColorClass(categoryFilter)}`}>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="policy_documents" className={CATEGORY_COLORS.policy_documents}>Policy Documents</SelectItem>
                  <SelectItem value="menstrual_health_resources" className={CATEGORY_COLORS.menstrual_health_resources}>Menstrual Health Resources</SelectItem>
                  <SelectItem value="menopause_health_resources" className={CATEGORY_COLORS.menopause_health_resources}>Menopause Health Resources</SelectItem>
                  <SelectItem value="workshop_materials" className={CATEGORY_COLORS.workshop_materials}>Workshop Materials</SelectItem>
                  <SelectItem value="others" className={CATEGORY_COLORS.others}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-shrink-0 w-full md:w-auto">
              <Select 
                value={fileTypeFilter} 
                onValueChange={setFileTypeFilter}
              >
                <SelectTrigger className={`w-full md:w-auto md:min-w-[180px] border ${getFileTypeColorClass(fileTypeFilter)}`}>
                  <SelectValue placeholder="All File Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All File Types</SelectItem>
                  <SelectItem value="pdf" className={FILE_TYPE_COLORS.pdf}>PDF</SelectItem>
                  <SelectItem value="word" className={FILE_TYPE_COLORS.word}>Word</SelectItem>
                  <SelectItem value="presentation" className={FILE_TYPE_COLORS.presentation}>PPT</SelectItem>
                  <SelectItem value="spreadsheet" className={FILE_TYPE_COLORS.spreadsheet}>Excel</SelectItem>
                  <SelectItem value="image" className={FILE_TYPE_COLORS.image}>Image</SelectItem>
                  <SelectItem value="video" className={FILE_TYPE_COLORS.video}>Video</SelectItem>
                  <SelectItem value="text" className={FILE_TYPE_COLORS.text}>Text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 ml-auto">
              <Button 
                variant={viewMode === 'grid' ? "secondary" : "outline"} 
                size="sm" 
                onClick={() => setViewMode('grid')}
                className="w-10 h-10 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? "secondary" : "outline"} 
                size="sm" 
                onClick={() => setViewMode('list')}
                className="w-10 h-10 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="text-center">
                <div className="w-10 h-10 border-t-2 border-primary border-r-2 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading resources...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-10 border border-red-200 rounded-lg bg-red-50">
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="flex justify-center items-center py-12 border rounded-lg bg-gray-50/50">
              <div className="text-center px-4 py-8">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No resources found</h3>
                <p className="text-muted-foreground mb-2">We couldn&apos;t find any resources matching your search criteria</p>
                <p className="text-xs text-muted-foreground">Try adjusting your filters or search term</p>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <ResourceGrid resources={filteredResources} />
          ) : (
            <ResourceList resources={filteredResources} />
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Popular Resources */}
          <div className="sticky top-24">
            <PopularResources resources={popularResources} />
          </div>
        </div>
      </div>

      {/* Resource Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start mt-6 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing {filteredResources.length} of {resources.length} resources
            {categoryFilter !== 'all' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className={`ml-2 ${getCategoryColorClass(categoryFilter)}`}>
                      {getCategoryDisplayName(categoryFilter)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{categoryFilter.replace(/_/g, ' ')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {fileTypeFilter !== 'all' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className={`ml-2 ${getFileTypeColorClass(fileTypeFilter)}`}>
                      {fileTypeFilter}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{fileTypeFilter} file</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
} 