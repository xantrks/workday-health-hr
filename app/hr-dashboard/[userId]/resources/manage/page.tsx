'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  FileText, 
  File, 
  Image, 
  Video,
  Trash2,
  Download,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Upload,
  ChevronLeft,
  X,
  AlertCircle
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

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

export default function ManageResourcesPage({ params }: { params: { userId: string } }) {
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
  const [sortField, setSortField] = useState<keyof Resource>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);

  // Get resource list
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

  // Delete resource
  const deleteResource = async () => {
    if (!resourceToDelete) return;
    
    try {
      const response = await fetch(`/api/resources?id=${resourceToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }
      
      // Delete successful, update list
      setResources(resources.filter(r => r.id !== resourceToDelete.id));
      setResourceToDelete(null);
    } catch (error) {
      console.error('Error deleting resource:', error);
      setError('Failed to delete resource, please try again');
    }
  };

  // Filter and sort resources
  const filteredAndSortedResources = resources
    .filter(resource => {
      // Title search
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

      return matchesSearch && matchesCategory && matchesFileType;
    })
    .sort((a, b) => {
      // Handle sorting for different field types
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortDirection === 'asc'
          ? fieldA - fieldB
          : fieldB - fieldA;
      }
      
      // Default to sorting by createdAt
      return sortDirection === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Get file icon
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  // Toggle sort direction
  const toggleSort = (field: keyof Resource) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Check if user has HR or admin permissions
  if (session?.user?.role !== 'hr' && session?.user?.role !== 'admin') {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
            <CardDescription>You do not have permission to access this page</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Only HR personnel or admins can manage resource files.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.back()}>Return</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href={`/hr-dashboard/${params.userId}?tab=resources`}>
          <Button variant="ghost" size="sm" className="group mb-4 pl-1 flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Resource Management</h1>
            <p className="text-muted-foreground mt-1">Manage all uploaded company policies and health education resources</p>
          </div>
          <Button 
            onClick={() => router.push(`/hr-dashboard/${params.userId}/resources/upload`)}
            className="sm:self-start"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload New Resource
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-muted">
        <CardHeader className="border-b bg-muted/30 pb-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div>
              <CardTitle>All Resources</CardTitle>
              <CardDescription>Browse, filter and manage uploaded resources</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="policy_documents">Policy Documents</SelectItem>
                    <SelectItem value="menstrual_health_resources">Menstrual Health</SelectItem>
                    <SelectItem value="menopause_health_resources">Menopause Health</SelectItem>
                    <SelectItem value="workshop_materials">Workshop Materials</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setFileTypeFilter('all');
                  }}
                  title="Clear filters"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading resources...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="rounded-full bg-destructive/10 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <p className="text-destructive">{error}</p>
              <Button 
                variant="outline" 
                onClick={fetchResources} 
                className="mt-6"
              >
                Try Again
              </Button>
            </div>
          ) : filteredAndSortedResources.length === 0 ? (
            <div className="text-center py-16">
              <div className="rounded-full bg-muted p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No resources found</p>
              {searchTerm || categoryFilter !== 'all' || fileTypeFilter !== 'all' ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setFileTypeFilter('all');
                  }}
                  className="mt-6"
                >
                  Clear Filters
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/hr-dashboard/${params.userId}/resources/upload`)} 
                  className="mt-6"
                >
                  Upload a Resource
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%] pl-6">
                      <Button 
                        variant="ghost" 
                        className="p-0 font-medium flex items-center"
                        onClick={() => toggleSort('title')}
                      >
                        Title
                        {sortField === 'title' && (
                          <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="p-0 font-medium flex items-center"
                        onClick={() => toggleSort('category')}
                      >
                        Category
                        {sortField === 'category' && (
                          <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        className="p-0 font-medium flex items-center"
                        onClick={() => toggleSort('createdAt')}
                      >
                        Date
                        {sortField === 'createdAt' && (
                          <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          {getFileIcon(resource.fileType)}
                          <div>
                            <p className="font-medium">{resource.title}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {resource.tags.slice(0, 3).map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs py-0">
                                  {tag}
                                </Badge>
                              ))}
                              {resource.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs py-0">
                                  +{resource.tags.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {resource.category === 'policy_documents' ? 'Policy Documents' :
                           resource.category === 'menstrual_health_resources' ? 'Menstrual Health' :
                           resource.category === 'menopause_health_resources' ? 'Menopause Health' :
                           resource.category === 'workshop_materials' ? 'Workshop Materials' : 
                           'Other'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(resource.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => window.open(resource.fileUrl, '_blank')}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  asChild
                                >
                                  <a 
                                    href={resource.fileUrl}
                                    download
                                  >
                                    <Download className="h-4 w-4" />
                                  </a>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setResourceToDelete(resource)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!resourceToDelete} onOpenChange={(open) => !open && setResourceToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Resource</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this resource? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {resourceToDelete && (
            <div className="flex items-center gap-3 p-4 my-3 border rounded-md">
              {getFileIcon(resourceToDelete.fileType)}
              <div>
                <p className="font-medium">{resourceToDelete.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(resourceToDelete.createdAt).toLocaleDateString('en-US')} · {
                    resourceToDelete.category === 'policy_documents' ? 'Policy Documents' :
                    resourceToDelete.category === 'menstrual_health_resources' ? 'Menstrual Health' :
                    resourceToDelete.category === 'menopause_health_resources' ? 'Menopause Health' :
                    resourceToDelete.category === 'workshop_materials' ? 'Workshop Materials' : 
                    'Other'
                  }
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => setResourceToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteResource}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 