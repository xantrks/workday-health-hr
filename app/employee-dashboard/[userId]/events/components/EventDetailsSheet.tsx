'use client';

import { Clock, MapPin, Users, ExternalLink, CheckCircle, PlusCircle, XCircle, FileText } from 'lucide-react';

import { Event } from '../types';
import { formatDate, formatTime, isPast } from '../utils/dateUtils';
import { isRegistrationAvailable } from '../utils/eventUtils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter
} from '@/components/ui/sheet';

interface EventDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: Event | null;
  isRegistered: (eventId: string) => boolean;
  registerForEvent: (eventId: string) => Promise<void>;
  cancelRegistration: (eventId: string) => Promise<void>;
}

export default function EventDetailsSheet({
  isOpen,
  onOpenChange,
  selectedEvent,
  isRegistered,
  registerForEvent,
  cancelRegistration
}: EventDetailsSheetProps) {
  if (!selectedEvent) return null;
  
  const registered = isRegistered(selectedEvent.id);
  const canRegister = isRegistrationAvailable(selectedEvent);
  const isPastEvent = isPast(selectedEvent.startDate);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-full">
        <SheetHeader>
          <SheetTitle>Event Details</SheetTitle>
        </SheetHeader>
        
        <div className="h-[calc(100vh-180px)] mt-4 overflow-y-auto pr-4">
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline">{selectedEvent.eventType}</Badge>
                {registered && (
                  <Badge className="bg-primary/10 text-primary">Registered</Badge>
                )}
              </div>
              <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <div>{formatDate(selectedEvent.startDate)}</div>
                  <div className="text-muted-foreground">to {formatTime(selectedEvent.endDate)}</div>
                </div>
              </div>
              
              {selectedEvent.location && (
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}
              
              {selectedEvent.maxAttendees && (
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {selectedEvent.currentAttendees !== undefined 
                      ? `${selectedEvent.currentAttendees}/${selectedEvent.maxAttendees} attendees` 
                      : 'Limited capacity'}
                  </span>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {selectedEvent.description || 'No description available.'}
              </p>
            </div>
            
            {selectedEvent.resourceMaterials && selectedEvent.resourceMaterials.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Resources & Materials</h4>
                  <div className="space-y-2">
                    {selectedEvent.resourceMaterials.map((resource, index) => (
                      <div key={index} className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a 
                          href={resource} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center"
                        >
                          Material {index + 1}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {selectedEvent.registrationLink && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">External Registration</h4>
                  <a 
                    href={selectedEvent.registrationLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center"
                  >
                    Register on external platform
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
        
        <SheetFooter className="flex flex-col sm:flex-row gap-3 mt-6">
          <SheetClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Close
            </Button>
          </SheetClose>
          
          {registered ? (
            <Button 
              className="w-full sm:w-auto"
              variant="default"
              onClick={() => cancelRegistration(selectedEvent.id)}
              disabled={isPastEvent}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Registration
            </Button>
          ) : (
            <Button 
              className="w-full sm:w-auto"
              onClick={() => registerForEvent(selectedEvent.id)}
              disabled={!canRegister}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Register for Event
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
} 