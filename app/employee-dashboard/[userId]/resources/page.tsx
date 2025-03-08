'use client';

import { 
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  File, 
  FileText, 
  Filter,
  Image, 
  Info,
  Search,
  Video,
  Clock,
  ArrowLeft,
  ChevronRight,
  Tag,
  BookmarkIcon,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DashboardLayout from "../../components/DashboardLayout";

// Resource type definition
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

export default function EmployeeResourcesPage({ params }: { params: { userId: string } }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login');
    },
  });
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [popularResources, setPopularResources] = useState<Resource[]>([]);

  // Fetch resources list
  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/resources');
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }
      const data = await response.json();
      setResources(data);
      // Set popular resources (top 3 by view count)
      setPopularResources(
        [...data].sort((a, b) => b.viewCount - a.viewCount).slice(0, 3)
      );
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to fetch resource list, please try again');
    } finally {
      setLoading(false);
    }
  };

  // Call the fetch function when component mounts
  useEffect(() => {
    if (session) {
      fetchResources();
    }
  }, [session]);

  // Track resource views
  const trackResourceView = async (resourceId: string) => {
    try {
      await fetch(`/api/resources/${resourceId}/view`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error tracking resource view:', error);
      // Continue silently even if tracking fails
    }
  };

  // Track resource downloads
  const trackResourceDownload = async (resourceId: string) => {
    try {
      await fetch(`/api/resources/${resourceId}/download`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error tracking resource download:', error);
      // Continue silently even if tracking fails
    }
  };

  // Filter resources based on user selections
  const getFilteredResources = () => {
    return resources.filter(resource => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      // Category filter
      const matchesCategory = categoryFilter === 'all' || resource.category.includes(categoryFilter);
      
      // File type filter
      const matchesFileType = fileTypeFilter === 'all' || resource.fileType === fileTypeFilter;
      
      // Tab filter
      let matchesTab = true;
      if (activeTab === 'menstrual') {
        matchesTab = resource.category.includes('menstrual_health_resources');
      } else if (activeTab === 'menopause') {
        matchesTab = resource.category.includes('menopause_health_resources');
      } else if (activeTab === 'policy') {
        matchesTab = resource.category.includes('policy_documents');
      }
      
      return matchesSearch && matchesCategory && matchesFileType && matchesTab;
    });
  };

  // Helper function to get icon and color based on file type
  const getFileTypeInfo = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return { icon: <FileText className="h-5 w-5" />, color: 'bg-red-100 text-red-600' };
      case 'word':
        return { icon: <FileText className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600' };
      case 'presentation':
        return { icon: <FileText className="h-5 w-5" />, color: 'bg-orange-100 text-orange-600' };
      case 'spreadsheet':
        return { icon: <FileText className="h-5 w-5" />, color: 'bg-green-100 text-green-600' };
      case 'image':
        return { icon: <Image className="h-5 w-5" />, color: 'bg-purple-100 text-purple-600' };
      case 'video':
        return { icon: <Video className="h-5 w-5" />, color: 'bg-pink-100 text-pink-600' };
      default:
        return { icon: <File className="h-5 w-5" />, color: 'bg-gray-100 text-gray-600' };
    }
  };

  // Get category counts
  const getCategoryCounts = () => {
    const counts = {
      all: resources.length,
      period: resources.filter(r => r.category.includes('menstrual_health_resources')).length,
      menopause: resources.filter(r => r.category.includes('menopause_health_resources')).length,
      policy: resources.filter(r => r.category.includes('policy_documents')).length,
    };
    return counts;
  };

  const filteredResources = getFilteredResources();
  const categoryCounts = getCategoryCounts();

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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-md flex items-center">
                <Search className="h-4 w-4 mr-2 text-primary" />
                Find Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Resource Category</p>
                  <Select 
                    value={categoryFilter} 
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="policy_documents">Policy Documents</SelectItem>
                      <SelectItem value="menstrual_health_resources">Menstrual Health Resources</SelectItem>
                      <SelectItem value="menopause_health_resources">Menopause Health Resources</SelectItem>
                      <SelectItem value="workshop_materials">Workshop Materials</SelectItem>
                      <SelectItem value="others">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">File Type</p>
                  <Select 
                    value={fileTypeFilter} 
                    onValueChange={setFileTypeFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All File Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All File Types</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="word">Word</SelectItem>
                      <SelectItem value="presentation">PPT</SelectItem>
                      <SelectItem value="spreadsheet">Excel</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Resources */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-md flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                Popular Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {popularResources.length > 0 ? (
                popularResources.map((resource) => {
                  const { icon, color } = getFileTypeInfo(resource.fileType);
                  return (
                    <div key={resource.id} className="flex items-start gap-3 group">
                      <div className={`p-2 rounded-md ${color} flex items-center justify-center shrink-0`}>
                        {icon}
                      </div>
                      <div className="space-y-1">
                        <a
                          href={resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackResourceView(resource.id)}
                          className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2"
                        >
                          {resource.title}
                        </a>
                        <p className="text-xs text-muted-foreground">
                          {resource.viewCount} views
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No resources available</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Category Tabs */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all" className="flex items-center justify-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>All</span>
                <Badge variant="secondary" className="ml-1">
                  {categoryCounts.all}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="menstrual" className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Menstrual</span>
                <Badge variant="secondary" className="ml-1">
                  {categoryCounts.period}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="menopause" className="flex items-center justify-center gap-2">
                <Info className="h-4 w-4" />
                <span>Menopause</span>
                <Badge variant="secondary" className="ml-1">
                  {categoryCounts.menopause}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="policy" className="flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Policy</span>
                <Badge variant="secondary" className="ml-1">
                  {categoryCounts.policy}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* View toggle and count display */}
            <div className="flex justify-between items-center mt-4 mb-2">
              <p className="text-sm text-muted-foreground">
                Showing {filteredResources.length} resources
              </p>
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'grid' ? "secondary" : "outline"} 
                  size="sm" 
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button 
                  variant={viewMode === 'list' ? "secondary" : "outline"} 
                  size="sm" 
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
            </div>

            {/* Resource content area */}
            <TabsContent value={activeTab} className="mt-0">
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center py-10">
                  <p className="text-destructive">{error}</p>
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="flex justify-center items-center py-10">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">No resources found matching your criteria</p>
                    <p className="text-xs text-muted-foreground">Try adjusting your filters or search term</p>
                  </div>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredResources.map((resource) => {
                    const { icon, color } = getFileTypeInfo(resource.fileType);
                    return (
                      <Card key={resource.id} className="overflow-hidden hover:border-primary/50 transition-all">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className={`p-2 rounded-md ${color} flex items-center justify-center`}>
                              {icon}
                            </div>
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                              {resource.category.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                          <CardTitle className="mt-2 text-lg line-clamp-1">{resource.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {resource.description || 'No description available'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          {resource.tags && resource.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {resource.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {resource.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{resource.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(resource.createdAt).toLocaleDateString('en-US')}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" />
                                {resource.viewCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {resource.downloadCount}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <Button 
                            variant="secondary"
                            size="sm"
                            onClick={() => trackResourceView(resource.id)}
                            asChild
                          >
                            <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View
                            </a>
                          </Button>
                          
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => trackResourceDownload(resource.id)}
                            asChild
                          >
                            <a 
                              href={resource.fileUrl} 
                              download={resource.title}
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredResources.map((resource) => {
                    const { icon, color } = getFileTypeInfo(resource.fileType);
                    return (
                      <div key={resource.id} className="flex items-center border rounded-lg p-3 hover:border-primary/50 transition-all">
                        <div className={`p-2 rounded-md ${color} flex items-center justify-center mr-4`}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium line-clamp-1">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {resource.description || 'No description available'}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span>{new Date(resource.createdAt).toLocaleDateString('en-US')}</span>
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                              {resource.category.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => trackResourceView(resource.id)}
                                  asChild
                                >
                                  <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View resource</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => trackResourceDownload(resource.id)}
                                  asChild
                                >
                                  <a 
                                    href={resource.fileUrl} 
                                    download={resource.title}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                  >
                                    <Download className="h-4 w-4" />
                                  </a>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download resource</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
} 