'use client';

import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { ResourceCategory } from '../types';
import { useState } from 'react';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function SearchAndFilters({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  onClearFilters
}: SearchAndFiltersProps) {
  const [open, setOpen] = useState(false);
  const hasFilters = searchTerm !== '' || categoryFilter !== 'all';
  
  // Apply filters and close sheet
  const applyFilters = () => {
    setOpen(false);
  };
  
  // Clear filters and close sheet
  const clearFiltersAndClose = () => {
    onClearFilters();
    setOpen(false);
  };
  
  return (
    <div className="flex flex-col space-y-3 sm:space-y-4">
      <div>
        <h2 className="text-base sm:text-lg font-medium">All Resources</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">Browse, filter and manage uploaded resources</p>
      </div>
      
      {/* Mobile view */}
      <div className="flex gap-2 sm:hidden">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-9 text-sm h-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className={hasFilters ? "bg-primary/10" : ""}
            >
              <Filter className="h-4 w-4" />
              {hasFilters && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-80">
            <SheetHeader className="text-left">
              <SheetTitle>Filter Resources</SheetTitle>
              <SheetDescription>
                Apply filters to narrow down your resource list
              </SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={categoryFilter}
                  onValueChange={onCategoryChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="policy_documents">Policy Documents</SelectItem>
                    <SelectItem value="menstrual_health_resources">Menstrual Health</SelectItem>
                    <SelectItem value="menopause_health_resources">Menopause Health</SelectItem>
                    <SelectItem value="workshop_materials">Workshop Materials</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <SheetFooter className="flex-row justify-between sm:justify-between gap-2">
              <Button variant="outline" onClick={clearFiltersAndClose} className="flex-1">
                Clear All
              </Button>
              <Button onClick={applyFilters} className="flex-1">
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        {hasFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearFilters}
            title="Clear filters"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Desktop view */}
      <div className="hidden sm:flex sm:flex-row gap-3 w-full">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={categoryFilter}
            onValueChange={onCategoryChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="policy_documents">Policy Documents</SelectItem>
              <SelectItem value="menstrual_health_resources">Menstrual Health</SelectItem>
              <SelectItem value="menopause_health_resources">Menopause Health</SelectItem>
              <SelectItem value="workshop_materials">Workshop Materials</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={onClearFilters}
            title="Clear filters"
            className={!hasFilters ? "opacity-50" : ""}
            disabled={!hasFilters}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 