'use client';

import { FeedbackListProps } from '../types';
import { FeedbackCard } from './FeedbackCard';

/**
 * List component for displaying multiple feedback items
 */
export function FeedbackList({ feedback }: FeedbackListProps) {
  return (
    <div className="grid gap-6">
      {feedback.map((item) => (
        <FeedbackCard key={item.id} feedback={item} />
      ))}
    </div>
  );
} 