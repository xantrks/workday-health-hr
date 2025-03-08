'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface Feedback {
  id: string;
  content: string;
  category: string;
  anonymous: boolean;
  userId?: string;
  createdAt: string;
}

export default function FeedbackDashboard({ params }: { params: { userId: string } }) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const router = useRouter();

  // Fetch feedback
  const fetchFeedback = async (category?: string) => {
    try {
      setLoading(true);
      const url = category && category !== 'all' 
        ? `/api/feedback?category=${category}`
        : '/api/feedback';
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      
      const data = await response.json();
      setFeedback(data.data || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      alert('Failed to load employee feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback(categoryFilter);
  }, [categoryFilter]);

  const handleFilterChange = (value: string) => {
    setCategoryFilter(value);
  };

  const categoryColorMap: Record<string, string> = {
    'Menstrual Health': 'bg-pink-100 text-pink-800',
    'Menopause Health': 'bg-purple-100 text-purple-800',
    'Benefit Policies': 'bg-blue-100 text-blue-800',
    'Support Programs': 'bg-green-100 text-green-800',
    'Workplace Environment': 'bg-yellow-100 text-yellow-800',
    'Other': 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Employee Feedback</h1>
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="flex items-center">
          <label className="mr-2 text-sm">Filter by category:</label>
          <Select onValueChange={handleFilterChange} defaultValue="all">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="Menstrual Health">Menstrual Health</SelectItem>
              <SelectItem value="Menopause Health">Menopause Health</SelectItem>
              <SelectItem value="Benefit Policies">Benefit Policies</SelectItem>
              <SelectItem value="Support Programs">Support Programs</SelectItem>
              <SelectItem value="Workplace Environment">Workplace Environment</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => router.back()}>
          Back to Dashboard
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : feedback.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-lg text-gray-500 mb-4">No feedback submitted yet</p>
            <p className="text-sm text-gray-400">When employees submit feedback, it will appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {feedback.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className={categoryColorMap[item.category] || "bg-gray-100"}>
                      {item.category}
                    </Badge>
                    <div className="mt-2 text-xs text-gray-500">
                      {item.createdAt ? (
                        <span>Submitted {formatDistanceToNow(new Date(item.createdAt))} ago</span>
                      ) : (
                        <span>Date not available</span>
                      )}
                      {item.anonymous ? (
                        <span className="ml-3">• Anonymous</span>
                      ) : (
                        <span className="ml-3">• From employee</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p className="whitespace-pre-wrap">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 