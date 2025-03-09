'use client';

import { 
  ArrowUpDown, 
  Download, 
  Eye, 
  Trash2 
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { Resource } from '../types';
import { formatCategoryName, formatDate } from '../utils';
import FileIcon from './FileIcon';

interface ResourceTableProps {
  resources: Resource[];
  sortField: keyof Resource;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: keyof Resource) => void;
  onViewResource: (resource: Resource) => void;
  onDeleteResource: (resource: Resource) => void;
}

export default function ResourceTable({
  resources,
  sortField,
  sortDirection,
  onSortChange,
  onViewResource,
  onDeleteResource
}: ResourceTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%] pl-6">
              <Button 
                variant="ghost" 
                className="p-0 font-medium flex items-center"
                onClick={() => onSortChange('title')}
              >
                Title
                {sortField === 'title' && (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                className="p-0 font-medium flex items-center"
                onClick={() => onSortChange('category')}
              >
                Category
                {sortField === 'category' && (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                )}
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                className="p-0 font-medium flex items-center"
                onClick={() => onSortChange('createdAt')}
              >
                Date
                {sortField === 'createdAt' && (
                  <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
                )}
              </Button>
            </TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => (
            <TableRow key={resource.id}>
              <TableCell className="pl-6">
                <div className="flex items-center gap-3">
                  <FileIcon fileType={resource.fileType} />
                  <div>
                    <p className="font-medium">{resource.title}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {resource.tags.slice(0, 3).map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs py-0">
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs py-0">
                          +{resource.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal">
                  {formatCategoryName(resource.category)}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDate(resource.createdAt)}
              </TableCell>
              <TableCell className="pr-6">
                <div className="flex justify-end gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onViewResource(resource)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          asChild
                        >
                          <a 
                            href={resource.fileUrl}
                            download
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Download</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onDeleteResource(resource)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 