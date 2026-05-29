"use client";

import { useMemo } from "react";

import {
  getMonthMatrix,
  isSameMonth,
  isToday,
  toDateKey,
  WEEKDAY_LABELS,
} from "@/lib/date";
import { CalendarDayCell } from "@/components/calendar/CalendarDayCell";
import type { CommitmentWithRelations } from "@/types";

export function CalendarGrid({
  month,
  commitments,
  onAddCommitment,
  onEditCommitment,
}: {
  month: Date;
  commitments: CommitmentWithRelations[];
  onAddCommitment: (date: Date) => void;
  onEditCommitment: (commitment: CommitmentWithRelations) => void;
}) {
  const days = useMemo(() => getMonthMatrix(month).flat(), [month]);

  // Group commitments by their deadline day (local date key).
  const byDay = useMemo(() => {
    const map = new Map<string, CommitmentWithRelations[]>();
    for (const commitment of commitments) {
      if (!commitment.deadline) continue;
      const key = toDateKey(commitment.deadline);
      const existing = map.get(key);
      if (existing) {
        existing.push(commitment);
      } else {
        map.set(key, [commitment]);
      }
    }
    return map;
  }, [commitments]);

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-2">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((date) => (
          <CalendarDayCell
            key={date.toISOString()}
            date={date}
            inCurrentMonth={isSameMonth(date, month)}
            isToday={isToday(date)}
            commitments={byDay.get(toDateKey(date)) ?? []}
            onAddCommitment={onAddCommitment}
            onEditCommitment={onEditCommitment}
          />
        ))}
      </div>
    </div>
  );
}
