import { describe, expect, it } from "vitest";

import {
  buildDeadline,
  formatDeadlineLabel,
  formatFullDate,
  formatMonthTitle,
  formatTime,
  getMonthMatrix,
  toDateInputValue,
  toDateKey,
  toTimeInputValue,
} from "@/lib/date";

describe("buildDeadline", () => {
  it("returns null when there is no deadline", () => {
    expect(
      buildDeadline({
        hasDeadline: false,
        isAllDay: true,
        date: "2026-05-29",
        time: "09:00",
      }),
    ).toBeNull();
  });

  it("returns null when the date is empty", () => {
    expect(
      buildDeadline({
        hasDeadline: true,
        isAllDay: true,
        date: "",
        time: "09:00",
      }),
    ).toBeNull();
  });

  it("builds a local midnight date for all-day deadlines", () => {
    const d = buildDeadline({
      hasDeadline: true,
      isAllDay: true,
      date: "2026-05-29",
      time: "09:00",
    });
    expect(d?.getFullYear()).toBe(2026);
    expect(d?.getMonth()).toBe(4); // May (0-indexed)
    expect(d?.getDate()).toBe(29);
    expect(d?.getHours()).toBe(0);
    expect(d?.getMinutes()).toBe(0);
  });

  it("builds a local timed date when not all-day", () => {
    const d = buildDeadline({
      hasDeadline: true,
      isAllDay: false,
      date: "2026-05-29",
      time: "14:30",
    });
    expect(d?.getHours()).toBe(14);
    expect(d?.getMinutes()).toBe(30);
  });
});

describe("date input round-trip", () => {
  it("round-trips a date/time through the input helpers", () => {
    const original = new Date(2026, 4, 29, 14, 30);
    const rebuilt = buildDeadline({
      hasDeadline: true,
      isAllDay: false,
      date: toDateInputValue(original),
      time: toTimeInputValue(original),
    });
    expect(rebuilt?.getTime()).toBe(original.getTime());
  });
});

describe("toDateKey / formatTime", () => {
  it("formats a local date key as yyyy-MM-dd", () => {
    expect(toDateKey(new Date(2026, 4, 29))).toBe("2026-05-29");
  });

  it("formats time as HH:mm", () => {
    expect(formatTime(new Date(2026, 4, 29, 9, 5))).toBe("09:05");
  });
});

describe("getMonthMatrix", () => {
  const weeks = getMonthMatrix(new Date(2026, 4, 15)); // May 2026
  const days = weeks.flat();

  it("returns full weeks of 7 days", () => {
    expect(weeks.length).toBeGreaterThanOrEqual(4);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(days.length % 7).toBe(0);
  });

  it("starts the grid on a Monday", () => {
    expect(days[0].getDay()).toBe(1);
  });

  it("contains every day of the target month", () => {
    for (let day = 1; day <= 31; day += 1) {
      expect(
        days.some((d) => d.getMonth() === 4 && d.getDate() === day),
      ).toBe(true);
    }
  });
});

describe("display formatters", () => {
  it("formats the full date with day and year", () => {
    const label = formatFullDate(new Date(2026, 4, 29));
    expect(label).toContain("29");
    expect(label).toContain("2026");
  });

  it("formats the month title with the year", () => {
    expect(formatMonthTitle(new Date(2026, 4, 1))).toContain("2026");
  });

  it("includes the time only for non-all-day deadlines", () => {
    const date = new Date(2026, 4, 29, 14, 30);
    expect(formatDeadlineLabel(date, false)).toContain("14:30");
    expect(formatDeadlineLabel(date, true)).not.toContain("14:30");
  });
});
