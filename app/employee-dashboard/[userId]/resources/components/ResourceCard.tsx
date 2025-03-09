'use client';

import { Clock, Download, ExternalLink } from "lucide-react";

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

import { Resource } from "../types";
import { getFileTypeInfo } from "../utils";
import { trackResourceDownload, trackResourceView } from "../services";

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const { icon, color } = getFileTypeInfo(resource.fileType);
  
  return (
    <Card key={resource.id} className="overflow-hidden hover:border-primary/50 transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className={`p-2 rounded-md ${color} flex items-center justify-center`}>
            {icon}
          </div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            {resource.category.replace(/_/g, ' ')}
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg line-clamp-1">{resource.title}</CardTitle>
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
            <span className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              {resource.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {resource.downloadCount}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button 
          variant="secondary"
          size="sm"
          onClick={() => trackResourceView(resource.id)}
          asChild
        >
          <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            View
          </a>
        </Button>
        
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
            <Download className="h-4 w-4 mr-2" />
            Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
} 