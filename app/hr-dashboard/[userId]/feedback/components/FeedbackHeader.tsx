'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { FeedbackHeaderProps } from '../types';

/**
 * Header component for the feedback dashboard
 * Includes navigation, title, and category filter
 */
export function FeedbackHeader({ userId, categoryFilter, onFilterChange }: FeedbackHeaderProps) {
  return (
    <div className="mb-8">
      <Link href={`/hr-dashboard/${userId}?tab=resources`}>
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
          <Select value={categoryFilter} onValueChange={onFilterChange}>
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
  );
} 