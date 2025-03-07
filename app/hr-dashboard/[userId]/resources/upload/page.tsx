'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  Upload, 
  FileText, 
  File, 
  Image, 
  Video,
  X,
  AlertCircle,
  CheckCircle
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
  title: z.string().min(1, { message: '标题不能为空' }),
  description: z.string().optional(),
  category: z.string().min(1, { message: '请选择分类' }),
  tags: z.string().optional()
});

export default function UploadResourcePage({ params }: { params: { userId: string } }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/login');
    },
  });
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      tags: ''
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!file) {
      setErrorMessage('请选择要上传的文件');
      return;
    }

    setUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', values.title);
      formData.append('description', values.description || '');
      formData.append('category', values.category);
      
      // 处理标签：如果用户输入了逗号分隔的标签，转换为数组
      let tagsValue = values.tags || '';
      // 不再附加默认的JSON字符串，让后端处理
      formData.append('tags', tagsValue);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '上传失败');
      }

      setUploadStatus('success');
      setTimeout(() => {
        router.push(`/hr-dashboard/${params.userId}/resources/manage`);
      }, 1500);
    } catch (error) {
      console.error('上传出错:', error);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!file) return <File className="h-5 w-5" />;

    const fileType = file.type;
    if (fileType.includes('image')) return <Image className="h-5 w-5" />;
    if (fileType.includes('video')) return <Video className="h-5 w-5" />;
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
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
            <p>只有HR人员或管理员可以上传资源文件。</p>
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
        <CardHeader>
          <CardTitle>上传新资源</CardTitle>
          <CardDescription>上传公司政策文件、月经健康或更年期健康教育资源</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>资源标题</FormLabel>
                    <FormControl>
                      <Input placeholder="输入资源标题" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>描述</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="输入资源描述（可选）" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>分类</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择分类" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="政策文件">政策文件</SelectItem>
                        <SelectItem value="月经健康资源">月经健康资源</SelectItem>
                        <SelectItem value="更年期健康资源">更年期健康资源</SelectItem>
                        <SelectItem value="研讨会材料">研讨会材料</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标签</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="输入标签，用逗号分隔（可选）" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      例如：教育,视频,科学
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file">文件</Label>
                <div className="flex items-center gap-2">
                  <Input
                    ref={fileInputRef}
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className={file ? 'hidden' : ''}
                  />
                  {file && (
                    <div className="flex items-center p-2 border rounded-md w-full justify-between">
                      <div className="flex items-center gap-2">
                        {getFileIcon()}
                        <span className="text-sm truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={removeFile}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {!file && (
                  <p className="text-sm text-muted-foreground mt-1">
                    支持PDF、Word、PPT、Excel、图片和视频文件，最大20MB
                  </p>
                )}
                {errorMessage && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errorMessage}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={uploading}
                >
                  取消
                </Button>
                <Button 
                  type="submit" 
                  disabled={uploading}
                  className="flex items-center gap-2"
                >
                  {uploading ? '上传中...' : '上传资源'}
                  {uploadStatus === 'success' && <CheckCircle className="h-4 w-4" />}
                  {uploadStatus === 'error' && <AlertCircle className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 