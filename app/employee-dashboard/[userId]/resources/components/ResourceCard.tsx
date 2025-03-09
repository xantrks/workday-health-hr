'use client';

import { Clock, Download, ExternalLink, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Resource } from "../types";
import { getFileTypeInfo } from "../utils";
import { trackResourceDownload, trackResourceView } from "../services";

// Category color mappings
const CATEGORY_COLORS = {
  policy_documents: "bg-blue-50 text-blue-600 border-blue-200",
  menstrual_health_resources: "bg-rose-50 text-rose-600 border-rose-200",
  menopause_health_resources: "bg-amber-50 text-amber-600 border-amber-200",
  workshop_materials: "bg-emerald-50 text-emerald-600 border-emerald-200",
  others: "bg-purple-50 text-purple-600 border-purple-200"
};

// Category display names (shortened)
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  policy_documents: "Policy",
  menstrual_health_resources: "Menstrual",
  menopause_health_resources: "Menopause",
  workshop_materials: "Workshop",
  others: "Other"
};

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const { icon, color } = getFileTypeInfo(resource.fileType);
  
  // Get category color class
  const getCategoryColorClass = (category: string) => {
    const key = category as keyof typeof CATEGORY_COLORS;
    return CATEGORY_COLORS[key] || CATEGORY_COLORS.others;
  };
  
  // Get short display name for category
  const getCategoryDisplayName = (category: string) => {
    const key = category as keyof typeof CATEGORY_DISPLAY_NAMES;
    return CATEGORY_DISPLAY_NAMES[key] || category;
  };
  
  return (
    <Card key={resource.id} className="overflow-hidden transition-all border hover:shadow-md group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className={`p-2 rounded-md ${color} flex items-center justify-center`}>
            {icon}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={`${getCategoryColorClass(resource.category)}`}>
                  {getCategoryDisplayName(resource.category)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{resource.category.replace(/_/g, ' ')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardTitle className="mt-2 text-lg line-clamp-1 group-hover:text-primary transition-colors cursor-pointer">
                {resource.title}
              </CardTitle>
            </TooltipTrigger>
            <TooltipContent side="top" align="start" className="max-w-xs">
              <p className="text-sm font-medium">{resource.title}</p>
              {resource.description && (
                <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <CardDescription className="line-clamp-2">
          {resource.description || 'No description available'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {resource.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{resource.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(resource.createdAt).toLocaleDateString('en-US')}
          </div>
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {resource.viewCount}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Views</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {resource.downloadCount}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Downloads</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="secondary"
                size="sm"
                onClick={() => trackResourceView(resource.id)}
                asChild
                className="bg-primary/10 hover:bg-primary/20 text-primary"
              >
                <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View in new window</p>
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
                className="border-primary/20 hover:bg-primary/5"
              >
                <a 
                  href={resource.fileUrl} 
                  download={resource.title}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download file</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
} 