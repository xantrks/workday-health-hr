'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from "../../components/DashboardLayout";

// Form validation schema
const feedbackSchema = z.object({
  content: z
    .string()
    .min(10, { message: 'Feedback must be at least 10 characters' })
    .max(1000, { message: 'Feedback must not exceed 1000 characters' }),
  category: z.string({
    required_error: 'Please select a category',
  }),
  anonymous: z.boolean().default(true),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export default function SubmitFeedback({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Initialize form
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      content: '',
      anonymous: true,
    },
  });

  // Handle form submission
  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      // Show success state
      setSubmitSuccess(true);
      
      // Reset form
      form.reset();
      
      // Redirect back to dashboard after short delay
      setTimeout(() => {
        if (linkRef.current) {
          linkRef.current.click();
        }
      }, 1500);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      userId={params.userId}
      title="Submit Feedback"
      description="Share your thoughts and experiences about menstrual and menopause health support in the workplace."
    >
      {/* Hidden link for redirection */}
      <Link ref={linkRef} href={`/employee-dashboard/${params.userId}?tab=resources`} className="hidden" />
      
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="text-green-500 mb-3 text-xl">Thank you for your feedback!</div>
                <p className="text-muted-foreground">Your input is valuable and helps us improve our support programs.</p>
                <p className="text-muted-foreground mt-4">Redirecting to dashboard...</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Menstrual Health">Menstrual Health</SelectItem>
                            <SelectItem value="Menopause Health">Menopause Health</SelectItem>
                            <SelectItem value="Benefit Policies">Benefit Policies</SelectItem>
                            <SelectItem value="Support Programs">Support Programs</SelectItem>
                            <SelectItem value="Workplace Environment">Workplace Environment</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the area your feedback relates to.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Feedback</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your thoughts, suggestions, or experiences..." 
                            className="min-h-[150px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Please be specific and constructive in your feedback.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="anonymous"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Submit Anonymously</FormLabel>
                          <FormDescription>
                            Your feedback will be completely anonymous to HR if enabled.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="h-4 w-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Feedback'
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 