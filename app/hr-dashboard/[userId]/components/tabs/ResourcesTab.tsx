'use client';

import Link from 'next/link';
import { 
  Upload, 
  Files, 
  FileText, 
  Calendar, 
  CalendarPlus, 
  MessageSquare, 
  ExternalLink 
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
import { formatDate, formatCategory } from '../../services';

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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-primary">Resources Management</h2>
        <div className="flex space-x-3">
          <Link href={`/hr-dashboard/${userId}/resources/upload`}>
            <Button variant="default" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload Resource
            </Button>
          </Link>
          <Link href={`/hr-dashboard/${userId}/resources/manage`}>
            <Button variant="outline" size="sm">
              <Files className="mr-2 h-4 w-4" />
              Manage Resources
            </Button>
          </Link>
        </div>
      </div>
      
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
              Manage all company documents, guides, and policies
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href={`/hr-dashboard/${userId}/resources/manage`} className="w-full">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Files className="mr-2 h-4 w-4" />
                View Library
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
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recently Uploaded Resources</CardTitle>
          <CardDescription>
            View and manage recently uploaded policy documents and educational resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resourcesLoading ? (
            <p className="text-center text-muted-foreground py-4">
              Loading...
            </p>
          ) : resourcesError ? (
            <p className="text-center text-destructive py-4">
              {resourcesError}
            </p>
          ) : recentResources.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No resources uploaded yet, <Link href={`/hr-dashboard/${userId}/resources/upload`} className="text-primary">upload resources</Link> now
            </p>
          ) : (
            <div className="space-y-4">
              {recentResources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(resource.createdAt)} · {formatCategory(resource.category)}
                      </p>
                    </div>
                  </div>
                  <Link href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))}
              <div className="pt-2">
                <Link href={`/hr-dashboard/${userId}/resources/manage`}>
                  <Button variant="outline" className="w-full">View All Resources</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 