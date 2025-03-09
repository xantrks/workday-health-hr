'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ErrorViewProps {
  errorMessage: string;
}

export default function ErrorView({ errorMessage }: ErrorViewProps) {
  const router = useRouter();
  
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Error Fetching Event</CardTitle>
          <CardDescription>Could not load event information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/15 p-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5" />
            <div className="text-destructive text-sm">{errorMessage}</div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.back()}>Return</Button>
        </CardFooter>
      </Card>
    </div>
  );
} 