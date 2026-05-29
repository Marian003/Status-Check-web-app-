"use client";

import { toDateInputValue, toTimeInputValue } from "@/lib/date";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CommitmentWithRelations } from "@/types";

export interface DeadlineValue {
  hasDeadline: boolean;
  isAllDay: boolean;
  date: string; // "yyyy-MM-dd"
  time: string; // "HH:mm"
}

const DEFAULT_TIME = "09:00";

/** Initial deadline form state from a commitment (edit) or preset date (create). */
export function initialDeadlineValue(
  commitment: CommitmentWithRelations | null,
  presetDate: Date | null,
): DeadlineValue {
  if (commitment) {
    return {
      hasDeadline: commitment.deadline !== null,
      isAllDay: commitment.isAllDay,
      date: commitment.deadline ? toDateInputValue(commitment.deadline) : "",
      time: commitment.deadline
        ? toTimeInputValue(commitment.deadline)
        : DEFAULT_TIME,
    };
  }
  const base = presetDate ?? new Date();
  return {
    hasDeadline: true,
    isAllDay: true,
    date: toDateInputValue(base),
    time: DEFAULT_TIME,
  };
}

export function DeadlineField({
  value,
  onChange,
}: {
  value: DeadlineValue;
  onChange: (value: DeadlineValue) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="hasDeadline"
          checked={value.hasDeadline}
          onCheckedChange={(checked) =>
            onChange({ ...value, hasDeadline: checked === true })
          }
        />
        <Label htmlFor="hasDeadline">Має дедлайн</Label>
      </div>

      {value.hasDeadline ? (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="deadline-date">Дата</Label>
              <Input
                id="deadline-date"
                type="date"
                value={value.date}
                onChange={(event) =>
                  onChange({ ...value, date: event.target.value })
                }
                required
              />
            </div>
            {!value.isAllDay ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="deadline-time">Час</Label>
                <Input
                  id="deadline-time"
                  type="time"
                  value={value.time}
                  onChange={(event) =>
                    onChange({ ...value, time: event.target.value })
                  }
                />
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isAllDay"
              checked={value.isAllDay}
              onCheckedChange={(checked) =>
                onChange({ ...value, isAllDay: checked === true })
              }
            />
            <Label htmlFor="isAllDay">Весь день (без конкретного часу)</Label>
          </div>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">
          Без дедлайну — комітмент потрапить у Backlog.
        </p>
      )}
    </div>
  );
}
