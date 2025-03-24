"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface LeaveType {
  id: string;
  name: string;
  description: string;
  maxDays: number;
}

interface LeaveTypeSelectorProps {
  leaveTypes: LeaveType[];
  selectedType: LeaveType | null;
  onSelect: (type: LeaveType) => void;
}

export function LeaveTypeSelector({
  leaveTypes,
  selectedType,
  onSelect,
}: LeaveTypeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter leave types by search term
  const filteredTypes = leaveTypes.filter(type => 
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    type.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedType ? selectedType.name : "Select leave type..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="flex flex-col">
          {/* Search input */}
          <div className="flex items-center border-b px-3">
            <input
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search leave types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* No results message */}
          {filteredTypes.length === 0 && (
            <div className="py-6 text-center text-sm">No leave types found</div>
          )}
          
          {/* Leave type list */}
          <div className="overflow-hidden p-1">
            {filteredTypes.map((type) => (
              <div
                key={type.id}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                onClick={() => {
                  onSelect(type);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedType?.id === type.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{type.name}</span>
                  <span className="text-xs text-muted-foreground">{type.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 