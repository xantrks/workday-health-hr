'use client';

import { useRouter } from 'next/navigation';
import { CalendarIcon, Clock, Download, Edit, ExternalLink, MapPin, Trash2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Event } from '../types';
import { formatDate, getBadgeColor } from '../utils';

interface EventDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  userId: string;
  onDelete: () => void;
}

export default function EventDetailsDialog({
  open,
  onOpenChange,
  event,
  userId,
  onDelete
}: EventDetailsDialogProps) {
  const router = useRouter();

  if (!event) return null;

  const badgeColor = getBadgeColor(event.eventType);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription>
            <Badge className={`mt-2 ${badgeColor.text}`}>
              {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>Start: {formatDate(event.startDate)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>End: {formatDate(event.endDate)}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>Location: {event.location || 'Online'}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>Registrations: {event.registrationCount} {event.maxAttendees !== "Unlimited" ? `/ ${event.maxAttendees}` : ''}</span>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-muted-foreground whitespace-pre-line">
              {event.description || 'No description provided.'}
            </p>
          </div>
          
          {event.registrationLink && (
            <div>
              <h4 className="font-medium mb-2">Registration Link</h4>
              <div className="flex items-center">
                <a 
                  href={event.registrationLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  {event.registrationLink}
                </a>
              </div>
            </div>
          )}
          
          {event.resourceMaterials && event.resourceMaterials.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Resource Materials</h4>
              <div className="flex flex-col gap-2">
                {event.resourceMaterials.map((url, index) => (
                  <a 
                    key={index} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Material {index + 1}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => router.push(`/hr-dashboard/${userId}/events/edit/${event.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Event
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 