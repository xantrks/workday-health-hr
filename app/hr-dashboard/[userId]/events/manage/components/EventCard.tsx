'use client';

import { useRouter } from 'next/navigation';
import { Clock, Edit, ExternalLink, Info, MapPin, MoreVertical, Trash2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Event } from '../types';
import { formatDate, getBadgeColor } from '../utils';

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
  onDeleteClick: (event: Event) => void;
  userId: string;
}

export default function EventCard({ event, onViewDetails, onDeleteClick, userId }: EventCardProps) {
  const router = useRouter();
  const badgeColor = getBadgeColor(event.eventType);
  
  return (
    <Card className="overflow-hidden border-muted shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className={`pb-3 ${badgeColor.background}`}>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{event.title}</CardTitle>
            <Badge variant="secondary" className={badgeColor.text}>
              {event.eventType}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onViewDetails(event)}>
                <Info className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/hr-dashboard/${userId}/events/edit/${event.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit Event</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDeleteClick(event)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Event</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-start gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p>{formatDate(event.startDate)}</p>
              {event.endDate && event.endDate !== event.startDate && (
                <p className="text-muted-foreground">To: {formatDate(event.endDate)}</p>
              )}
            </div>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
          )}
          {event.maxAttendees && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{event.registrationCount || 0} / {event.maxAttendees}</span>
            </div>
          )}
        </div>
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 pb-4 flex justify-between gap-2">
        <Button variant="outline" size="sm" onClick={() => onViewDetails(event)}>
          View Details
        </Button>
        {event.registrationLink && (
          <Button size="sm" asChild>
            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Registration
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 