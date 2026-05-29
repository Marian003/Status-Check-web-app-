import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { uk } from "date-fns/locale";

// All date logic lives here so formatting/grid rules are not duplicated.
// The app assumes a single (local) timezone — see README assumptions.

const WEEK_OPTIONS = { weekStartsOn: 1 as const, locale: uk }; // Monday-first

/** Weekday headers for the calendar grid (Monday-first). */
export const WEEKDAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

/** Stable per-day key based on LOCAL date parts (used to group commitments). */
export function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** Build the month grid (weeks of 7 days) covering `month`, Monday-first. */
export function getMonthMatrix(month: Date): Date[][] {
  const gridStart = startOfWeek(startOfMonth(month), WEEK_OPTIONS);
  const gridEnd = endOfWeek(endOfMonth(month), WEEK_OPTIONS);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

/** e.g. "травень 2026". */
export function formatMonthTitle(month: Date): string {
  return format(month, "LLLL yyyy", { locale: uk });
}

/** e.g. "14:30". */
export function formatTime(date: Date): string {
  return format(date, "HH:mm");
}

/** e.g. "28 травня 2026". */
export function formatFullDate(date: Date): string {
  return format(date, "d MMMM yyyy", { locale: uk });
}

/** Human-readable deadline, with time only when it is not an all-day deadline. */
export function formatDeadlineLabel(deadline: Date, isAllDay: boolean): string {
  return isAllDay
    ? formatFullDate(deadline)
    : `${formatFullDate(deadline)}, ${formatTime(deadline)}`;
}

/** "yyyy-MM-dd" for an <input type="date"> (local time). */
export function toDateInputValue(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

/** "HH:mm" for an <input type="time"> (local time). */
export function toTimeInputValue(date: Date): string {
  return format(date, "HH:mm");
}

/** Build a deadline Date from form inputs, interpreted as LOCAL time. */
export function buildDeadline(params: {
  hasDeadline: boolean;
  isAllDay: boolean;
  date: string; // "yyyy-MM-dd"
  time: string; // "HH:mm"
}): Date | null {
  const { hasDeadline, isAllDay, date, time } = params;
  if (!hasDeadline || !date) return null;

  const [year, month, day] = date.split("-").map(Number);
  if (isAllDay) {
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  }
  const [hours, minutes] = (time || "00:00").split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

// Re-exported so components depend on "@/lib/date" rather than date-fns directly.
export { addMonths, subMonths, isSameDay, isSameMonth, isToday };
