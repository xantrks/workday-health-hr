'use client';

import Link from 'next/link';

import { 
  Files, 
  FileText, 
  Calendar, 
  CalendarPlus, 
  MessageSquare
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { Resource } from '../../types';

interface ResourcesTabProps {
  userId: string;
  recentResources: Resource[];
  resourcesLoading: boolean;
  resourcesError: string | null;
}

/**
 * ResourcesTab component for HR dashboard
 * Enhanced for mobile responsiveness
 */
export default function ResourcesTab({ 
  userId, 
  recentResources, 
  resourcesLoading, 
  resourcesError 
}: ResourcesTabProps) {
  return (
    <div className="flex flex-col space-y-4 sm:space-y-8 px-1 sm:px-2"> 
      <div className="grid gap-3 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-sm sm:text-md flex items-center">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-primary" />
              Resource Library
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2 sm:pb-3 px-3 sm:px-6">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Access and manage all company documents, guides, and policies
            </p>
          </CardContent>
          <CardFooter className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6">
            <Link href={`/hr-dashboard/${userId}/resources/manage`} className="w-full">
              <Button variant="default" size="sm" className="w-full text-xs sm:text-sm h-8 sm:h-9">
                <Files className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Access Resource Center
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-sm sm:text-md flex items-center">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-primary" />
              Event Management
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2 sm:pb-3 px-3 sm:px-6">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Schedule and manage company events and activities
            </p>
          </CardContent>
          <CardFooter className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Link href={`/hr-dashboard/${userId}/events/create`} className="w-full sm:flex-1">
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs sm:text-sm h-8 sm:h-9">
                <CalendarPlus className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                New Event
              </Button>
            </Link>
            <Link href={`/hr-dashboard/${userId}/events/manage`} className="w-full sm:flex-1">
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs sm:text-sm h-8 sm:h-9">
                <Calendar className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Calendar
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-sm sm:text-md flex items-center">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-primary" />
              Employee Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2 sm:pb-3 px-3 sm:px-6">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Review and respond to employee feedback and suggestions
            </p>
          </CardContent>
          <CardFooter className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6">
            <Link href={`/hr-dashboard/${userId}/feedback`} className="w-full">
              <Button variant="ghost" size="sm" className="w-full justify-start text-xs sm:text-sm h-8 sm:h-9">
                <MessageSquare className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                View Feedback
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 