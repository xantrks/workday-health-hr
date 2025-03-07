'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
  Eye
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

// 资源类型定义
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

  // 获取资源列表
  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/resources');
      if (!response.ok) {
        throw new Error('获取资源失败');
      }
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('获取资源出错:', error);
      setError('获取资源列表失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // 删除资源
  const deleteResource = async () => {
    if (!resourceToDelete) return;
    
    try {
      const response = await fetch(`/api/resources?id=${resourceToDelete.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('删除资源失败');
      }
      
      // 删除成功，更新列表
      setResources(resources.filter(r => r.id !== resourceToDelete.id));
      setResourceToDelete(null);
    } catch (error) {
      console.error('删除资源出错:', error);
      setError('删除资源失败，请重试');
    }
  };

  // 筛选和排序资源
  const filteredAndSortedResources = resources
    .filter(resource => {
      // 标题搜索
      const matchesSearch = searchTerm 
        ? resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
      
      // 分类筛选
      const matchesCategory = categoryFilter && categoryFilter !== 'all'
        ? resource.category === categoryFilter
        : true;
      
      // 文件类型筛选
      const matchesFileType = fileTypeFilter && fileTypeFilter !== 'all'
        ? resource.fileType === fileTypeFilter
        : true;

      return matchesSearch && matchesCategory && matchesFileType;
    })
    .sort((a, b) => {
      // 处理不同字段类型的排序
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
      
      // 默认按创建时间排序
      return sortDirection === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // 获取文件图标
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

  // 切换排序方向
  const toggleSort = (field: keyof Resource) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // 检查用户是否有HR或管理员权限
  if (session?.user?.role !== 'hr' && session?.user?.role !== 'admin') {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>未授权</CardTitle>
            <CardDescription>您没有权限访问此页面</CardDescription>
          </CardHeader>
          <CardContent>
            <p>只有HR人员或管理员可以管理资源文件。</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.back()}>返回</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>资源管理</CardTitle>
            <CardDescription>管理所有上传的公司政策和健康教育资源</CardDescription>
          </div>
          <Button onClick={() => router.push(`/hr-dashboard/${params.userId}/resources/upload`)}>
            上传新资源
          </Button>
        </CardHeader>
        <CardContent>
          {/* 搜索和筛选 */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex items-center w-full md:w-1/3">
              <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索资源..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2 w-full md:w-2/3">
              <Select 
                value={categoryFilter} 
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="所有分类" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有分类</SelectItem>
                  <SelectItem value="政策文件">政策文件</SelectItem>
                  <SelectItem value="月经健康资源">月经健康资源</SelectItem>
                  <SelectItem value="更年期健康资源">更年期健康资源</SelectItem>
                  <SelectItem value="研讨会材料">研讨会材料</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={fileTypeFilter} 
                onValueChange={setFileTypeFilter}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4" />
                    <SelectValue placeholder="所有文件类型" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有文件类型</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="word">Word</SelectItem>
                  <SelectItem value="presentation">PPT</SelectItem>
                  <SelectItem value="spreadsheet">Excel</SelectItem>
                  <SelectItem value="image">图片</SelectItem>
                  <SelectItem value="video">视频</SelectItem>
                  <SelectItem value="text">文本</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 资源列表 */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-muted-foreground">加载中...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-destructive">{error}</p>
            </div>
          ) : filteredAndSortedResources.length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-muted-foreground">
                没有找到符合条件的资源。API已自动过滤掉不存在的文件，确保只显示有效资源。
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">类型</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort('title')}>
                      <div className="flex items-center gap-1">
                        标题
                        {sortField === 'title' && (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort('createdAt')}>
                      <div className="flex items-center gap-1">
                        上传日期
                        {sortField === 'createdAt' && (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort('viewCount')}>
                      <div className="flex items-center gap-1">
                        查看
                        {sortField === 'viewCount' && (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedResources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center justify-center">
                                {getFileIcon(resource.fileType)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{resource.fileType}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{resource.title}</span>
                          {resource.description && (
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {resource.description}
                            </span>
                          )}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {resource.tags && resource.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          {resource.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(resource.createdAt).toLocaleDateString('zh-CN')}
                      </TableCell>
                      <TableCell>{resource.viewCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" asChild>
                                  <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                                    <Eye className="h-4 w-4" />
                                  </a>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>查看</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" asChild>
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
                                <p>下载</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setResourceToDelete(resource)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>确认删除</DialogTitle>
                                <DialogDescription>
                                  您确定要删除资源 &ldquo;{resourceToDelete?.title}&rdquo; 吗？此操作无法撤销。
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">取消</Button>
                                </DialogClose>
                                <Button 
                                  variant="destructive" 
                                  onClick={deleteResource}
                                >
                                  删除
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            共 {filteredAndSortedResources.length} 个资源
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 