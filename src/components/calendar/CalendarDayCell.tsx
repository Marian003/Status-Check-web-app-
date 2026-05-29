"use client";

import { PlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { CommitmentCard } from "@/components/commitments/CommitmentCard";
import type { CommitmentWithRelations } from "@/types";

export function CalendarDayCell({
  date,
  inCurrentMonth,
  isToday,
  commitments,
  onAddCommitment,
  onEditCommitment,
}: {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  commitments: CommitmentWithRelations[];
  onAddCommitment: (date: Date) => void;
  onEditCommitment: (commitment: CommitmentWithRelations) => void;
}) {
  return (
    <div
      className={cn(
        "flex min-h-28 flex-col gap-1 border-r border-b p-1.5 last:border-r-0",
        !inCurrentMonth && "bg-muted/30",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex size-6 items-center justify-center rounded-full text-sm",
            !inCurrentMonth && "text-muted-foreground",
            isToday && "bg-primary font-semibold text-primary-foreground",
          )}
        >
          {date.getDate()}
        </span>
        <button
          type="button"
          onClick={() => onAddCommitment(date)}
          aria-label="Додати комітмент на цей день"
          className="rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <PlusIcon className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        {commitments.map((commitment) => (
          <CommitmentCard
            key={commitment.id}
            commitment={commitment}
            onEdit={onEditCommitment}
          />
        ))}
      </div>
    </div>
  );
}
