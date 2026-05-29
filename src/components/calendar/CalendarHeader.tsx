"use client";

import { PlusIcon } from "lucide-react";

import { formatMonthTitle } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { MonthNav } from "@/components/calendar/MonthNav";

export function CalendarHeader({
  month,
  onPrev,
  onNext,
  onToday,
  onCreate,
}: {
  month: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold capitalize">
          {formatMonthTitle(month)}
        </h1>
        <MonthNav onPrev={onPrev} onNext={onNext} onToday={onToday} />
      </div>
      <Button onClick={onCreate}>
        <PlusIcon />
        Створити
      </Button>
    </div>
  );
}
