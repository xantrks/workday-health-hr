'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Upload, 
  FileText, 
  File, 
  Image, 
  Video,
  X,
  AlertCircle,
  CheckCircle,
  ChevronLeft
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
  title: z.string().min(1, { message: 'Title cannot be empty' }),
  description: z.string().optional(),
  category: z.string().min(1, { message: 'Please select a category' }),
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
      setErrorMessage('Please select a file to upload');
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
      
      // Process tags: if user enters comma-separated tags, convert to array
      // No longer attach default JSON string, let backend handle it
      let tagsValue = values.tags || '';
      formData.append('tags', tagsValue);

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      setUploadStatus('success');
      setTimeout(() => {
        router.push(`/hr-dashboard/${params.userId}/resources/manage`);
      }, 1500);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed, please try again');
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
            <p>Only HR personnel or administrators can upload resource files.</p>
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
        <h1 className="text-2xl font-bold text-primary">Upload New Resource</h1>
        <p className="text-muted-foreground mt-1">Add new documents, guidelines or educational materials for employees</p>
      </div>

      <Card className="shadow-sm border-muted">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle>Resource Information</CardTitle>
          <CardDescription>Upload company policy files, menstrual health or menopause health educational resources</CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter resource title" {...field} />
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
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="policy_documents">Policy Documents</SelectItem>
                          <SelectItem value="menstrual_health_resources">Menstrual Health Resources</SelectItem>
                          <SelectItem value="menopause_health_resources">Menopause Health Resources</SelectItem>
                          <SelectItem value="workshop_materials">Workshop Materials</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter resource description (optional)" 
                        className="resize-none min-h-24" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter tags, separated by commas (optional)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Tags help users find resources more easily (e.g. health, policy, guidelines)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border border-dashed rounded-lg p-8 bg-muted/20">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="bg-primary/10 p-5 rounded-full">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium text-lg">Drag & drop your file here</p>
                  <p className="text-sm text-muted-foreground">or click to browse files</p>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2"
                  >
                    Browse Files
                  </Button>
                </div>

                {file && (
                  <div className="mt-5 p-4 border rounded-md bg-background flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getFileIcon()}
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="rounded-md p-4 bg-destructive/10 flex items-center gap-3 text-destructive">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {uploadStatus === 'success' && (
                <div className="rounded-md p-4 bg-success/10 flex items-center gap-3 text-success">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <p>Resource uploaded successfully!</p>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/hr-dashboard/${params.userId}?tab=resources`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <span className="loading loading-spinner loading-xs mr-2"></span>
                      Uploading...
                    </>
                  ) : (
                    <>Upload Resource</>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 