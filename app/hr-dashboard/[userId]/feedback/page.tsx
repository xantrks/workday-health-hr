'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MessageSquare, Filter, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
            <h1 className="text-2xl font-bold text-primary">Employee Feedback</h1>
            <p className="text-muted-foreground mt-1">Review feedback and suggestions from employees</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={categoryFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General Feedback</SelectItem>
                <SelectItem value="health_programs">Health Programs</SelectItem>
                <SelectItem value="workplace">Workplace</SelectItem>
                <SelectItem value="benefits">Benefits & Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading feedback...</p>
          </div>
        </div>
      ) : feedback.length === 0 ? (
        <div className="text-center py-16">
          <div className="rounded-full bg-muted p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium">No feedback found</p>
          <p className="text-muted-foreground mt-1 mb-6">
            {categoryFilter !== 'all' 
              ? "Try changing your filter to see more feedback"
              : "Employees haven't submitted any feedback yet"}
          </p>
          {categoryFilter !== 'all' && (
            <Button variant="outline" onClick={() => setCategoryFilter('all')}>
              Show All Feedback
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {feedback.map((item) => (
            <Card key={item.id} className="shadow-sm border-muted overflow-hidden">
              <CardHeader className="pb-3 bg-muted/20">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="mb-2" variant="outline">
                      {item.category === 'general' && 'General Feedback'}
                      {item.category === 'health_programs' && 'Health Programs'}
                      {item.category === 'workplace' && 'Workplace'}
                      {item.category === 'benefits' && 'Benefits & Support'}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Submitted {formatDistanceToNow(new Date(item.createdAt))} ago 
                      {!item.anonymous && item.userId && ' by Employee ID: ' + item.userId.substring(0, 6)}
                      {item.anonymous && ' (Anonymous)'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm">{item.content}</p>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  Mark as Reviewed
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 