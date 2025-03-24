'use client';

import { format, parseISO } from 'date-fns';
import { Calendar, Clock, MapPin, Trash2, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { Event } from '../types';
import { getEventTypeColor } from '../utils';

interface EventCardProps {
  event: Event;
  onViewDetails: () => void;
  onDeleteClick: () => void;
  className?: string;
}

export default function EventCard({
  event,
  onViewDetails,
  onDeleteClick,
  className
}: EventCardProps) {
  const router = useRouter();
  const eventTypeColor = getEventTypeColor(event.eventType);
  
  return (
    <Card 
      className={cn(
        "overflow-hidden border-border/30 dark:border-border/20",
        className
      )}
    >
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className={cn(
              "px-2 py-0.5 text-xs font-medium",
              eventTypeColor
            )}
          >
            {event.eventType}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="text-lg">{event.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {event.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            {format(parseISO(event.startDate), 'h:mm a')} - {format(parseISO(event.endDate), 'h:mm a')}
          </div>
          {event.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              {event.location}
            </div>
          )}
          {event.maxParticipants && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              Max Participants: {event.maxParticipants}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full hover:bg-muted/50 dark:hover:bg-muted/20"
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
} 