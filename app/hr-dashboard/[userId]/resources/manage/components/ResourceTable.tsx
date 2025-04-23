'use client';

import { 
  ArrowUpDown, 
  Download, 
  Eye, 
  Trash2,
  FileText
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
import { Card } from '@/components/ui/card';

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
  // Sort controls for mobile view
  const SortControls = () => (
    <div className="flex items-center justify-between mb-3 px-4 pt-3">
      <p className="text-sm font-medium">Sort by:</p>
      <div className="flex space-x-2">
        <Button 
          variant={sortField === 'title' ? "secondary" : "ghost"} 
          size="sm"
          className="text-xs h-7"
          onClick={() => onSortChange('title')}
        >
          Title {sortField === 'title' && (
            <ArrowUpDown className="ml-1 h-3 w-3" />
          )}
        </Button>
        <Button 
          variant={sortField === 'category' ? "secondary" : "ghost"} 
          size="sm"
          className="text-xs h-7"
          onClick={() => onSortChange('category')}
        >
          Category {sortField === 'category' && (
            <ArrowUpDown className="ml-1 h-3 w-3" />
          )}
        </Button>
        <Button 
          variant={sortField === 'createdAt' ? "secondary" : "ghost"} 
          size="sm"
          className="text-xs h-7"
          onClick={() => onSortChange('createdAt')}
        >
          Date {sortField === 'createdAt' && (
            <ArrowUpDown className="ml-1 h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );

  // Mobile card view
  const MobileCardView = () => (
    <div className="space-y-3 px-4 pb-4">
      <SortControls />
      {resources.map((resource) => (
        <Card key={resource.id} className="p-3 shadow-sm">
          <div className="flex items-start gap-2">
            <FileIcon fileType={resource.fileType} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{resource.title}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge variant="secondary" className="text-xs py-0">
                  {formatCategoryName(resource.category)}
                </Badge>
                {resource.tags.slice(0, 2).map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs py-0">
                    {tag}
                  </Badge>
                ))}
                {resource.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs py-0">
                    +{resource.tags.length - 2}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(resource.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-1 mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={() => onViewResource(resource)}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 w-7 p-0"
              asChild
            >
              <a href={resource.fileUrl} download>
                <Download className="h-3.5 w-3.5" />
              </a>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => onDeleteResource(resource)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );

  // Desktop table view
  const DesktopTableView = () => (
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

  return (
    <>
      {/* Mobile view (hidden on larger screens) */}
      <div className="md:hidden">
        <MobileCardView />
      </div>
      
      {/* Desktop view (hidden on mobile) */}
      <div className="hidden md:block">
        <DesktopTableView />
      </div>
    </>
  );
} 