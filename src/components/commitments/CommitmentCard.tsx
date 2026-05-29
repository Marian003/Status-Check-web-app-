"use client";

import { ClockIcon } from "lucide-react";

import { formatTime } from "@/lib/date";
import { getEffectiveStatus, STATUS_CONFIG } from "@/lib/status";
import { cn } from "@/lib/utils";
import { StatusSelect } from "@/components/commitments/StatusSelect";
import type { CommitmentWithRelations } from "@/types";

export function CommitmentCard({
  commitment,
  onEdit,
}: {
  commitment: CommitmentWithRelations;
  onEdit: (commitment: CommitmentWithRelations) => void;
}) {
  const showTime = commitment.deadline !== null && !commitment.isAllDay;
  const accent = STATUS_CONFIG[getEffectiveStatus(commitment)].accentClassName;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-l-4 bg-card p-2 shadow-xs transition-shadow hover:shadow-sm",
        accent,
      )}
    >
      <StatusSelect commitment={commitment} />

      <button
        type="button"
        onClick={() => onEdit(commitment)}
        className="mt-1 block w-full text-left text-sm font-medium hover:underline"
      >
        <span className="line-clamp-2">{commitment.title}</span>
      </button>

      <dl className="mt-1 space-y-0.5 text-xs text-muted-foreground">
        <div className="flex min-w-0 items-center gap-1">
          {showTime && commitment.deadline ? (
            <span className="inline-flex shrink-0 items-center gap-0.5 font-medium text-foreground/70">
              <ClockIcon className="size-3" />
              {formatTime(commitment.deadline)}
            </span>
          ) : null}
          <span className="min-w-0 truncate" title={commitment.project.name}>
            {commitment.project.name}
          </span>
        </div>
        <div className="truncate">
          <span className="text-foreground/70">Викон.:</span>{" "}
          {commitment.executor.name}
        </div>
        <div className="truncate">
          <span className="text-foreground/70">Перев.:</span>{" "}
          {commitment.checker.name}
        </div>
      </dl>
    </div>
  );
}
