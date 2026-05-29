"use client";

import type { CommitmentStatus } from "@prisma/client";

import { SELECTABLE_STATUSES, STATUS_CONFIG } from "@/lib/status";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

/** Status picker for the form — offers only the manually-selectable statuses. */
export function StatusField({
  value,
  onChange,
}: {
  value: CommitmentStatus;
  onChange: (value: CommitmentStatus) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="status">Статус</Label>
      <Select
        value={value}
        onValueChange={(next) => {
          if (next) onChange(next);
        }}
      >
        <SelectTrigger id="status" className="w-full">
          <span className="truncate">{STATUS_CONFIG[value].label}</span>
        </SelectTrigger>
        <SelectContent>
          {SELECTABLE_STATUSES.map((option) => (
            <SelectItem key={option} value={option}>
              {STATUS_CONFIG[option].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
