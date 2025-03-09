'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Resource } from '../types';
import { formatCategoryName, formatDate } from '../utils';
import FileIcon from './FileIcon';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource: Resource | null;
  onConfirmDelete: () => void;
}

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  resource,
  onConfirmDelete
}: DeleteConfirmationDialogProps) {
  if (!resource) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Resource</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this resource? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 p-4 my-3 border rounded-md">
          <FileIcon fileType={resource.fileType} />
          <div>
            <p className="font-medium">{resource.title}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(resource.createdAt)} · {formatCategoryName(resource.category)}
            </p>
          </div>
        </div>
        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirmDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 