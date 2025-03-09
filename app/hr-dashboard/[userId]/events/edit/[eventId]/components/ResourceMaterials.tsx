'use client';

import { Control } from 'react-hook-form';
import { FormValues } from '../types';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface ResourceMaterialsProps {
  control: Control<FormValues>;
}

export default function ResourceMaterials({ control }: ResourceMaterialsProps) {
  return (
    <FormField
      control={control}
      name="resourceMaterials"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Resource Materials (Optional)</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Enter resource links, separated by commas" 
              className="resize-none" 
              {...field} 
            />
          </FormControl>
          <FormDescription>
            Links to materials, slides or resources for this event (comma separated).
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
} 