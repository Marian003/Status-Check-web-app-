"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export interface FilterOption {
  value: string;
  label: string;
}

const ALL_VALUE = "__all__";

/** Generic single-select filter with an "all" option mapped to `null`. */
export function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel,
  className,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: FilterOption[];
  allLabel: string;
  className?: string;
}) {
  const selected = value
    ? options.find((option) => option.value === value)?.label
    : null;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Select
        value={value ?? ALL_VALUE}
        onValueChange={(next) =>
          onChange(!next || next === ALL_VALUE ? null : next)
        }
      >
        <SelectTrigger className="w-full sm:w-48">
          <span className="truncate">{selected ?? allLabel}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{allLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
