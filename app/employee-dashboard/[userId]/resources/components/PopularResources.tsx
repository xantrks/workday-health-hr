'use client';

import { ExternalLink, TrendingUp, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { trackResourceView } from "../services";
import { Resource } from "../types";
import { getFileTypeInfo } from "../utils";

// Category color mappings - same as other components
const CATEGORY_COLORS = {
  policy_documents: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800",
  menstrual_health_resources: "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800",
  menopause_health_resources: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800",
  workshop_materials: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800",
  others: "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800"
};

// Category display names (shortened)
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  policy_documents: "Policy",
  menstrual_health_resources: "Menstrual",
  menopause_health_resources: "Menopause",
  workshop_materials: "Workshop",
  others: "Other"
};

interface PopularResourcesProps {
  resources: Resource[];
}

/**
 * PopularResources component for displaying trending resources
 * Enhanced for mobile responsiveness
 */
export default function PopularResources({ resources }: PopularResourcesProps) {
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
    <Card className="border shadow-sm bg-white/80 dark:bg-card/80 dark:border-border/40 backdrop-blur-sm dark:shadow-primary/5">
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-4 border-b border-primary/5 dark:border-primary/10">
        <CardTitle className="text-sm sm:text-md flex items-center">
          <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-primary" />
          Popular Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 px-3 sm:px-6">
        {resources.length > 0 ? (
          resources.map((resource) => {
            const { icon, color } = getFileTypeInfo(resource.fileType);
            return (
              <div key={resource.id} className="flex items-start gap-2 sm:gap-3 group p-1.5 sm:p-2 rounded-md hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
                <div className={`p-1.5 sm:p-2 rounded-md ${color} flex items-center justify-center shrink-0 dark:bg-opacity-90`}>
                  {icon}
                </div>
                <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
                  <div className="flex items-start gap-1 sm:gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={resource.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackResourceView(resource.id)}
                            className="font-medium text-xs sm:text-sm group-hover:text-primary transition-colors line-clamp-2 flex-1 min-w-0"
                          >
                            {resource.title}
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="start" className="max-w-xs">
                          <p className="text-sm font-medium">{resource.title}</p>
                          {resource.description && (
                            <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge className={`shrink-0 text-[10px] sm:text-xs py-0 px-1 sm:px-1.5 h-4 sm:h-5 ml-auto ${getCategoryColorClass(resource.category)}`}>
                            {getCategoryDisplayName(resource.category)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{resource.category.replace(/_/g, ' ')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1">
                    <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    {resource.viewCount} views
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4 sm:py-6">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground/50 dark:text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-muted-foreground">No popular resources available yet</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground/70 dark:text-muted-foreground/50 mt-1">Resources with the most views will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 