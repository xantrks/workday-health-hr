'use client';

import { formatDistanceToNow } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';

import { FeedbackCardProps, CATEGORY_DISPLAY_NAMES } from '../types';
import { markFeedbackAsReviewed } from '../services';

/**
 * Card component for displaying a single feedback item
 */
export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const handleMarkAsReviewed = async () => {
    try {
      await markFeedbackAsReviewed(feedback.id);
      // In a real app, you might update the UI or refresh the data here
    } catch (error) {
      console.error('Error marking feedback as reviewed:', error);
      alert('Failed to update feedback status');
    }
  };

  return (
    <Card className="shadow-sm border-muted overflow-hidden">
      <CardHeader className="pb-3 bg-muted/20">
        <div className="flex justify-between items-start">
          <div>
            <Badge className="mb-2" variant="outline">
              {CATEGORY_DISPLAY_NAMES[feedback.category] || feedback.category}
            </Badge>
            <p className="text-xs text-muted-foreground">
              Submitted {formatDistanceToNow(new Date(feedback.createdAt))} ago 
              {!feedback.anonymous && feedback.userId && ' by Employee ID: ' + feedback.userId.substring(0, 6)}
              {feedback.anonymous && ' (Anonymous)'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm">{feedback.content}</p>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={handleMarkAsReviewed}>
          Mark as Reviewed
        </Button>
      </CardFooter>
    </Card>
  );
} 