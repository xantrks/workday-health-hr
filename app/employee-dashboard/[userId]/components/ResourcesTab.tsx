'use client';

import Link from 'next/link';
import { 
  FileText, 
  BookOpen, 
  Calendar, 
  MessageSquare 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ResourcesTabProps {
  userId: string;
}

export default function ResourcesTab({ userId }: ResourcesTabProps) {
  return (
    <>
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center mb-10 max-w-md">
          <div className="inline-flex p-3 rounded-full bg-primary/10 mb-6">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Resource Library</h2>
          <p className="text-muted-foreground px-4">
            Access health guides, educational materials and company policies all in one place.
          </p>
        </div>
        <Link href={`/employee-dashboard/${userId}/resources`}>
          <Button size="lg" className="px-10">
            <BookOpen className="mr-2 h-5 w-5" />
            Browse Resource Library
          </Button>
        </Link>
      </div>
      
      <div className="mt-12">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-md flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                Upcoming Health Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View and register for upcoming health workshops and webinars
              </p>
              <Link href={`/employee-dashboard/${userId}/events`}>
                <Button variant="outline" size="sm" className="w-full">
                  View Events Calendar
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-md flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                Share Your Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Help us improve our health support by sharing your anonymous feedback
              </p>
              <Link href={`/employee-dashboard/${userId}/feedback`}>
                <Button variant="outline" size="sm" className="w-full">
                  Submit Feedback
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
} 