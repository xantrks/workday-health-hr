'use client';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { FormValues } from '../types';
import { Control } from 'react-hook-form';

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
          <FormLabel>Resource Materials</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Enter resource links, separated by commas (optional)" 
              className="resize-none min-h-20" 
              {...field} 
            />
          </FormControl>
          <FormDescription>
            Links to slides, handouts, or other materials (comma separated)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
} 