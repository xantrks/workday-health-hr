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
} from "lucide-react";
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
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to fetch resource list, please try again');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // Record resource view
  const trackResourceView = async (resourceId: string) => {
    try {
      // Call API to increase view count
      await fetch(`/api/resources/${resourceId}/view`, { 
        method: 'POST' 
      });
    } catch (error) {
      console.error('Failed to record view:', error);
    }
  };

  // Record resource download
  const trackResourceDownload = async (resourceId: string) => {
    try {
      // Call API to increase download count
      await fetch(`/api/resources/${resourceId}/download`, { 
        method: 'POST' 
      });
    } catch (error) {
      console.error('Failed to record download:', error);
    }
  };

  // Filter resources by category
  const getFilteredResources = () => {
    return resources.filter(resource => {
      // Title or description search
      const matchesSearch = searchTerm
        ? resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
      
      // Category filter
      const matchesCategory = categoryFilter && categoryFilter !== 'all'
        ? resource.category === categoryFilter
        : true;
      
      // File type filter
      const matchesFileType = fileTypeFilter && fileTypeFilter !== 'all'
        ? resource.fileType === fileTypeFilter
        : true;
      
      // Tab filter
      const matchesTab = activeTab === 'all' 
        ? true 
        : activeTab === 'menstrual' 
          ? resource.category === 'menstrual_health_resources'
          : activeTab === 'menopause'
            ? resource.category === 'menopause_health_resources'
            : activeTab === 'policy'
              ? resource.category === 'policy_documents'
              : false;

      return matchesSearch && matchesCategory && matchesFileType && matchesTab;
    });
  };

  // Get file type icon and color
  const getFileTypeInfo = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return { icon: <Image className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600' };
      case 'video':
        return { icon: <Video className="h-5 w-5" />, color: 'bg-red-100 text-red-600' };
      case 'pdf':
        return { icon: <FileText className="h-5 w-5" />, color: 'bg-amber-100 text-amber-600' };
      case 'word':
        return { icon: <File className="h-5 w-5" />, color: 'bg-indigo-100 text-indigo-600' };
      case 'presentation':
        return { icon: <FileText className="h-5 w-5" />, color: 'bg-orange-100 text-orange-600' };
      case 'spreadsheet':
        return { icon: <FileText className="h-5 w-5" />, color: 'bg-green-100 text-green-600' };
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
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Health Resource Library</h1>
          <p className="text-muted-foreground">
            View company-provided health resources and policy documents
          </p>
        </div>

        {/* Search and filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex items-center w-full md:w-1/2">
                <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2 w-full md:w-1/2">
                <Select 
                  value={categoryFilter} 
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="All Categories" />
                    </div>
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

                <Select 
                  value={fileTypeFilter} 
                  onValueChange={setFileTypeFilter}
                >
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      <SelectValue placeholder="All File Types" />
                    </div>
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

        {/* Resource tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>All Resources</span>
              <Badge variant="secondary" className="ml-auto">
                {categoryCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="menstrual" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Menstrual Health</span>
              <Badge variant="secondary" className="ml-auto">
                {categoryCounts.period}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="menopause" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Menopause Health</span>
              <Badge variant="secondary" className="ml-auto">
                {categoryCounts.menopause}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="policy" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Company Policy</span>
              <Badge variant="secondary" className="ml-auto">
                {categoryCounts.policy}
              </Badge>
            </TabsTrigger>
          </TabsList>

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
                  <p className="text-xs text-muted-foreground">The system has automatically filtered out invalid resources and only displays accessible files</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((resource) => {
                  const { icon, color } = getFileTypeInfo(resource.fileType);
                  return (
                    <Card key={resource.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className={`p-2 rounded-md ${color} flex items-center justify-center`}>
                            {icon}
                          </div>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                            {resource.category}
                          </Badge>
                        </div>
                        <CardTitle className="mt-2 text-lg">{resource.title}</CardTitle>
                        <CardDescription>
                          {resource.description || 'No description available'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        {resource.tags && resource.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {resource.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                          <Clock className="h-3 w-3" />
                          Uploaded on {new Date(resource.createdAt).toLocaleDateString('en-US')}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0">
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
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Open in new window</p>
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
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download file</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 