"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MonthNav({
  onPrev,
  onNext,
  onToday,
}: {
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={onPrev}
        aria-label="Попередній місяць"
      >
        <ChevronLeftIcon />
      </Button>
      <Button variant="outline" size="sm" onClick={onToday}>
        Сьогодні
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={onNext}
        aria-label="Наступний місяць"
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
}
