'use client';

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchSidebarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  fileTypeFilter: string;
  setFileTypeFilter: (value: string) => void;
}

export default function SearchSidebar({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  fileTypeFilter,
  setFileTypeFilter
}: SearchSidebarProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center">
          <Search className="h-4 w-4 mr-2 text-primary" />
          Find Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Resource Category</p>
            <Select 
              value={categoryFilter} 
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="policy_documents">Policy Documents</SelectItem>
                <SelectItem value="menstrual_health_resources">Menstrual Health Resources</SelectItem>
                <SelectItem value="menopause_health_resources">Menopause Health Resources</SelectItem>
                <SelectItem value="workshop_materials">Workshop Materials</SelectItem>
                <SelectItem value="others">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">File Type</p>
            <Select 
              value={fileTypeFilter} 
              onValueChange={setFileTypeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="All File Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All File Types</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="word">Word</SelectItem>
                <SelectItem value="presentation">PPT</SelectItem>
                <SelectItem value="spreadsheet">Excel</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 