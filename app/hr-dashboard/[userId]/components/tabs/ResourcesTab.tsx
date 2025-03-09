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

export default function ResourcesTab({ 
  userId, 
  recentResources, 
  resourcesLoading, 
  resourcesError 
}: ResourcesTabProps) {
  return (
    <div className="flex flex-col space-y-8 px-2"> 
      <div className="grid gap-8 md:grid-cols-3">
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Resource Library
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-muted-foreground">
              Access and manage all company documents, guides, and policies
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href={`/hr-dashboard/${userId}/resources/manage`} className="w-full">
              <Button variant="default" size="sm" className="w-full">
                <Files className="mr-2 h-4 w-4" />
                Access Resource Center
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Event Management
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-muted-foreground">
              Schedule and manage company events and activities
            </p>
          </CardContent>
          <CardFooter className="pt-0 flex space-x-2">
            <Link href={`/hr-dashboard/${userId}/events/create`} className="flex-1">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <CalendarPlus className="mr-2 h-4 w-4" />
                New Event
              </Button>
            </Link>
            <Link href={`/hr-dashboard/${userId}/events/manage`} className="flex-1">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-md flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-primary" />
              Employee Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-muted-foreground">
              Review and respond to employee feedback and suggestions
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href={`/hr-dashboard/${userId}/feedback`} className="w-full">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                View Feedback
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 