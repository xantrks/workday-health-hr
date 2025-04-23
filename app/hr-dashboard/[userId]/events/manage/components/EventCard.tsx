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
      <CardHeader className="space-y-1 px-3 sm:px-6 pt-3 sm:pt-4 pb-2 sm:pb-3">
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className={cn(
              "px-1.5 sm:px-2 py-0 sm:py-0.5 text-[10px] sm:text-xs font-medium",
              eventTypeColor
            )}
          >
            {event.eventType}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive -mr-1.5 sm:-mr-2"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick();
            }}
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </div>
        <CardTitle className="text-base sm:text-lg leading-tight">{event.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-xs sm:text-sm">
          {event.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 sm:gap-4 px-3 sm:px-6 pb-2 sm:pb-3">
        <div className="grid gap-1.5 sm:gap-2">
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <Clock className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">
              {format(parseISO(event.startDate), 'h:mm a')} - {format(parseISO(event.endDate), 'h:mm a')}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
              <MapPin className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          {event.maxParticipants && (
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
              <Users className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">Max Participants: {event.maxParticipants}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-3 sm:px-6 pb-3 sm:pb-4 pt-1 sm:pt-2">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full hover:bg-muted/50 dark:hover:bg-muted/20 text-xs sm:text-sm h-8 sm:h-9"
          onClick={onViewDetails}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
} 