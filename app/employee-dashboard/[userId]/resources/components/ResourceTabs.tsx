'use client';

import { BookOpen, Calendar, FileText, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CategoryCounts, Resource, ViewMode } from "../types";
import ResourceGrid from "./ResourceGrid";
import ResourceList from "./ResourceList";

interface ResourceTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  filteredResources: Resource[];
  categoryCounts: CategoryCounts;
  loading: boolean;
  error: string | null;
}

export default function ResourceTabs({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  filteredResources,
  categoryCounts,
  loading,
  error
}: ResourceTabsProps) {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="all" className="flex items-center justify-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span>All</span>
          <Badge variant="secondary" className="ml-1">
            {categoryCounts.all}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="menstrual" className="flex items-center justify-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Menstrual</span>
          <Badge variant="secondary" className="ml-1">
            {categoryCounts.period}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="menopause" className="flex items-center justify-center gap-2">
          <Info className="h-4 w-4" />
          <span>Menopause</span>
          <Badge variant="secondary" className="ml-1">
            {categoryCounts.menopause}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="policy" className="flex items-center justify-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Policy</span>
          <Badge variant="secondary" className="ml-1">
            {categoryCounts.policy}
          </Badge>
        </TabsTrigger>
      </TabsList>

      {/* View toggle and count display */}
      <div className="flex justify-between items-center mt-4 mb-2">
        <p className="text-sm text-muted-foreground">
          Showing {filteredResources.length} resources
        </p>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'grid' ? "secondary" : "outline"} 
            size="sm" 
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button 
            variant={viewMode === 'list' ? "secondary" : "outline"} 
            size="sm" 
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Resource content area */}
      <TabsContent value={activeTab} className="mt-0">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-destructive">{error}</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No resources found matching your criteria</p>
              <p className="text-xs text-muted-foreground">Try adjusting your filters or search term</p>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <ResourceGrid resources={filteredResources} />
        ) : (
          <ResourceList resources={filteredResources} />
        )}
      </TabsContent>
    </Tabs>
  );
} 