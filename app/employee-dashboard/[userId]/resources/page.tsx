'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  FileText, 
  File, 
  Image, 
  Video,
  Download,
  Search,
  Filter,
  BookOpen,
  Info,
  Calendar,
  ExternalLink
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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

  // 记录资源查看
  const trackResourceView = async (resourceId: string) => {
    try {
      // 调用API增加查看计数
      await fetch(`/api/resources/${resourceId}/view`, { 
        method: 'POST' 
      });
    } catch (error) {
      console.error('记录查看失败:', error);
    }
  };

  // 记录资源下载
  const trackResourceDownload = async (resourceId: string) => {
    try {
      // 调用API增加下载计数
      await fetch(`/api/resources/${resourceId}/download`, { 
        method: 'POST' 
      });
    } catch (error) {
      console.error('记录下载失败:', error);
    }
  };

  // 按分类筛选资源
  const getFilteredResources = () => {
    return resources.filter(resource => {
      // 标题或描述搜索
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
      
      // 选项卡筛选
      const matchesTab = activeTab === 'all' 
        ? true 
        : resource.category.includes(activeTab);

      return matchesSearch && matchesCategory && matchesFileType && matchesTab;
    });
  };

  // 获取文件图标和颜色
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

  // 获取每种类型的数量
  const getCategoryCounts = () => {
    const counts = {
      all: resources.length,
      period: resources.filter(r => r.category.includes('月经')).length,
      menopause: resources.filter(r => r.category.includes('更年期')).length,
      policy: resources.filter(r => r.category.includes('政策')).length,
    };
    return counts;
  };

  const filteredResources = getFilteredResources();
  const categoryCounts = getCategoryCounts();

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">健康资源库</h1>
          <p className="text-muted-foreground">
            查看公司提供的健康资源和政策文件
          </p>
        </div>

        {/* 搜索和筛选 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex items-center w-full md:w-1/2">
                <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索资源..."
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
          </CardContent>
        </Card>

        {/* 资源选项卡 */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>全部资源</span>
              <Badge variant="secondary" className="ml-auto">
                {categoryCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="月经" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>月经健康</span>
              <Badge variant="secondary" className="ml-auto">
                {categoryCounts.period}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="更年期" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>更年期健康</span>
              <Badge variant="secondary" className="ml-auto">
                {categoryCounts.menopause}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="政策" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>公司政策</span>
              <Badge variant="secondary" className="ml-auto">
                {categoryCounts.policy}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* 资源内容区域 */}
          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <p className="text-muted-foreground">加载中...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-10">
                <p className="text-destructive">{error}</p>
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="flex justify-center items-center py-10">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">没有找到符合条件的资源</p>
                  <p className="text-xs text-muted-foreground">系统已自动过滤掉无效资源，仅显示可访问文件</p>
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
                          {resource.description || '暂无描述'}
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
                        <p className="text-xs text-muted-foreground">
                          上传于 {new Date(resource.createdAt).toLocaleDateString('zh-CN')}
                        </p>
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
                                  查看
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>在新窗口中打开</p>
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
                                  下载
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>下载文件</p>
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