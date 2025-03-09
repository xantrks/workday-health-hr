'use client';

import { ExternalLink, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Resource } from "../types";
import { getFileTypeInfo } from "../utils";
import { trackResourceView } from "../services";

interface PopularResourcesProps {
  resources: Resource[];
}

export default function PopularResources({ resources }: PopularResourcesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-primary" />
          Popular Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {resources.length > 0 ? (
          resources.map((resource) => {
            const { icon, color } = getFileTypeInfo(resource.fileType);
            return (
              <div key={resource.id} className="flex items-start gap-3 group">
                <div className={`p-2 rounded-md ${color} flex items-center justify-center shrink-0`}>
                  {icon}
                </div>
                <div className="space-y-1">
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackResourceView(resource.id)}
                    className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2"
                  >
                    {resource.title}
                  </a>
                  <p className="text-xs text-muted-foreground">
                    {resource.viewCount} views
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">No resources available</p>
        )}
      </CardContent>
    </Card>
  );
} 