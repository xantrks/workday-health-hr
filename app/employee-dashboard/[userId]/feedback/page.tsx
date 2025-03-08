'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();

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
        router.push(`/employee-dashboard/${params.userId}`);
      }, 1500);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Button 
          onClick={() => router.back()}
          className="mb-6"
        >
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
            <CardDescription>
              Share your thoughts and experiences about menstrual and menopause health support in the workplace.
              Your feedback helps us improve our policies and programs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="text-green-500 mb-2 text-xl">Thank you for your feedback!</div>
                <p className="text-gray-500">Your input is valuable and helps us improve our support programs.</p>
                <p className="text-gray-500 mt-4">Redirecting to dashboard...</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
    </div>
  );
} 