'use client';

import { 
  BookOpen, 
  Calendar, 
  FileText, 
  MessageSquare 
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

interface ResourcesTabProps {
  userId: string;
}

/**
 * ResourcesTab component for employee dashboard
 * Enhanced for mobile responsiveness
 */
export default function ResourcesTab({ userId }: ResourcesTabProps) {
  return (
    <div className="container mx-auto py-2 sm:py-8 px-0 sm:px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {/* Resource Library Card */}
        <Card className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-3 sm:px-6 py-2 sm:py-4">
            <CardTitle className="flex items-center text-sm sm:text-lg">
              <FileText className="mr-1.5 sm:mr-3 h-3.5 sm:h-5 w-3.5 sm:w-5 text-primary" />
              Resource Library
            </CardTitle>
          </div>
          <CardContent className="p-3 sm:p-6">
            <p className="mb-3 sm:mb-6 text-xs sm:text-sm text-muted-foreground h-auto sm:h-24">
              Access health guides, educational materials, and company policies all in one place.
            </p>
            <Link href={`/employee-dashboard/${userId}/resources`}>
              <Button className="w-full text-xs sm:text-base h-8 sm:h-10">
                <BookOpen className="mr-1.5 sm:mr-2 h-3.5 sm:h-5 w-3.5 sm:w-5" />
                Browse Resources
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Events Card */}
        <Card className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 sm:px-6 py-2 sm:py-4">
            <CardTitle className="flex items-center text-sm sm:text-lg">
              <Calendar className="mr-1.5 sm:mr-3 h-3.5 sm:h-5 w-3.5 sm:w-5 text-blue-600" />
              Health Events
            </CardTitle>
          </div>
          <CardContent className="p-3 sm:p-6">
            <p className="mb-3 sm:mb-6 text-xs sm:text-sm text-muted-foreground h-auto sm:h-24">
              View and register for upcoming health workshops and webinars designed to support your wellbeing journey.
            </p>
            <Link href={`/employee-dashboard/${userId}/events`}>
              <Button variant="outline" className="w-full text-xs sm:text-base h-8 sm:h-10 border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                View Events Calendar
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Feedback Card */}
        <Card className="overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-3 sm:px-6 py-2 sm:py-4">
            <CardTitle className="flex items-center text-sm sm:text-lg">
              <MessageSquare className="mr-1.5 sm:mr-3 h-3.5 sm:h-5 w-3.5 sm:w-5 text-purple-600" />
              Share Feedback
            </CardTitle>
          </div>
          <CardContent className="p-3 sm:p-6">
            <p className="mb-3 sm:mb-6 text-xs sm:text-sm text-muted-foreground h-auto sm:h-24">
              Help us improve our health support services by sharing your thoughts and experiences anonymously.
            </p>
            <Link href={`/employee-dashboard/${userId}/feedback`}>
              <Button variant="outline" className="w-full text-xs sm:text-base h-8 sm:h-10 border-purple-200 hover:bg-purple-50 hover:text-purple-700">
                Submit Feedback
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 