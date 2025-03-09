'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function UnauthorizedView() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Unauthorized</CardTitle>
          <CardDescription>You do not have permission to access this page</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Only HR personnel or administrators can create events.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.back()}>Return</Button>
        </CardFooter>
      </Card>
    </div>
  );
} 