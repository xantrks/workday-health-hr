'use client';

import { Control } from 'react-hook-form';
import { LinkIcon, MapPin, Users } from 'lucide-react';
import { FormValues } from '../types';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface LocationFieldsProps {
  control: Control<FormValues>;
}

export default function LocationFields({ control }: LocationFieldsProps) {
  return (
    <>
      {/* Location */}
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 opacity-70" />
                <Input 
                  placeholder="Physical location or 'Online'" 
                  {...field} 
                />
              </div>
            </FormControl>
            <FormDescription>
              For online events, you can enter "Online" and provide a meeting link in the registration link field.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Max Attendees */}
      <FormField
        control={control}
        name="maxAttendees"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Attendees</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 opacity-70" />
                <Input 
                  type="number" 
                  placeholder="Leave empty for unlimited" 
                  {...field} 
                />
              </div>
            </FormControl>
            <FormDescription>
              Maximum number of attendees. Leave empty for unlimited.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Registration Link */}
      <FormField
        control={control}
        name="registrationLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>External Registration Link (Optional)</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <LinkIcon className="mr-2 h-4 w-4 opacity-70" />
                <Input 
                  placeholder="https://example.com/register" 
                  {...field} 
                />
              </div>
            </FormControl>
            <FormDescription>
              Optional external registration link. If provided, employees will be directed to this link.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
} 