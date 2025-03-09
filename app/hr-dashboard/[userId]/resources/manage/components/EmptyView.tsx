'use client';

import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyViewProps {
  userId: string;
  hasFilters: boolean;
  onClearFilters: () => void;
}

export default function EmptyView({ userId, hasFilters, onClearFilters }: EmptyViewProps) {
  const router = useRouter();
  
  return (
    <div className="text-center py-16">
      <div className="rounded-full bg-muted p-3 w-12 h-12 flex items-center justify-center mx-auto mb-4">
        <FileText className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground">No resources found</p>
      {hasFilters ? (
        <Button 
          variant="outline" 
          onClick={onClearFilters}
          className="mt-6"
        >
          Clear Filters
        </Button>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => router.push(`/hr-dashboard/${userId}/resources/upload`)} 
          className="mt-6"
        >
          Upload a Resource
        </Button>
      )}
    </div>
  );
} 