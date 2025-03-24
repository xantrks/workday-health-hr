"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
        <Command>
          <CommandInput placeholder="Search leave types..." />
          <CommandEmpty>No leave types found</CommandEmpty>
          <CommandGroup>
            {leaveTypes.map((type) => (
              <CommandItem
                key={type.id}
                value={type.id}
                onSelect={() => {
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
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 