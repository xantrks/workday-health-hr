'use client';

import { ExternalLink, TrendingUp, Eye } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Resource } from "../types";
import { getFileTypeInfo } from "../utils";
import { trackResourceView } from "../services";

// Category color mappings - same as other components
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

interface PopularResourcesProps {
  resources: Resource[];
}

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
    <Card className="border shadow-sm bg-white/80">
      <CardHeader className="pb-3 border-b border-primary/5">
        <CardTitle className="text-md flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-primary" />
          Popular Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {resources.length > 0 ? (
          resources.map((resource) => {
            const { icon, color } = getFileTypeInfo(resource.fileType);
            return (
              <div key={resource.id} className="flex items-start gap-3 group p-2 rounded-md hover:bg-primary/5 transition-colors">
                <div className={`p-2 rounded-md ${color} flex items-center justify-center shrink-0`}>
                  {icon}
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={resource.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackResourceView(resource.id)}
                            className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2 flex-1 min-w-0"
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
                          <Badge className={`shrink-0 text-xs py-0 px-1.5 h-5 ml-auto ${getCategoryColorClass(resource.category)}`}>
                            {getCategoryDisplayName(resource.category)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{resource.category.replace(/_/g, ' ')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {resource.viewCount} views
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6">
            <TrendingUp className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No popular resources available yet</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Resources with the most views will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 