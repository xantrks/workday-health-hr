'use client';

import { Download, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Resource } from "../types";
import { getFileTypeInfo } from "../utils";
import { trackResourceDownload, trackResourceView } from "../services";

interface ResourceListProps {
  resources: Resource[];
}

export default function ResourceList({ resources }: ResourceListProps) {
  return (
    <div className="space-y-2">
      {resources.map((resource) => {
        const { icon, color } = getFileTypeInfo(resource.fileType);
        return (
          <div key={resource.id} className="flex items-center border rounded-lg p-3 hover:border-primary/50 transition-all">
            <div className={`p-2 rounded-md ${color} flex items-center justify-center mr-4`}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium line-clamp-1">{resource.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {resource.description || 'No description available'}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span>{new Date(resource.createdAt).toLocaleDateString('en-US')}</span>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  {resource.category.replace(/_/g, ' ')}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="secondary"
                      size="sm"
                      onClick={() => trackResourceView(resource.id)}
                      asChild
                    >
                      <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View resource</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => trackResourceDownload(resource.id)}
                      asChild
                    >
                      <a 
                        href={resource.fileUrl} 
                        download={resource.title}
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download resource</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        );
      })}
    </div>
  );
} 