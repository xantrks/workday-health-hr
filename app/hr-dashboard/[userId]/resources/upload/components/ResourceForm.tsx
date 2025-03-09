'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { formSchema, ResourceFormValues, UploadStatus } from '../types';
import FileUploadArea from './FileUploadArea';
import StatusMessage from './StatusMessage';

interface ResourceFormProps {
  userId: string;
  file: File | null;
  uploading: boolean;
  uploadStatus: UploadStatus;
  errorMessage: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  onSubmit: (values: ResourceFormValues) => void;
}

export default function ResourceForm({
  userId,
  file,
  uploading,
  uploadStatus,
  errorMessage,
  onFileChange,
  onRemoveFile,
  onSubmit
}: ResourceFormProps) {
  const router = useRouter();
  
  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      tags: ''
    },
  });

  return (
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

        <FileUploadArea 
          file={file}
          onFileChange={onFileChange}
          onRemoveFile={onRemoveFile}
        />

        <StatusMessage
          status={uploadStatus}
          errorMessage={errorMessage}
        />

        <div className="flex justify-end gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/hr-dashboard/${userId}?tab=resources`)}
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
  );
} 