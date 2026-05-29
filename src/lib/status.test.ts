import { describe, expect, it } from "vitest";
import type { CommitmentStatus } from "@prisma/client";

import {
  ALL_STATUSES,
  getEffectiveStatus,
  SELECTABLE_STATUSES,
  STATUS_CONFIG,
} from "@/lib/status";

const NOW = new Date("2026-05-29T12:00:00Z");
const PAST = new Date("2026-05-20T12:00:00Z");
const FUTURE = new Date("2026-06-10T12:00:00Z");

describe("getEffectiveStatus", () => {
  it("derives EXPIRED for an overdue TO_CHECK", () => {
    expect(getEffectiveStatus({ status: "TO_CHECK", deadline: PAST }, NOW)).toBe(
      "EXPIRED",
    );
  });

  it("keeps TO_CHECK when the deadline is in the future", () => {
    expect(
      getEffectiveStatus({ status: "TO_CHECK", deadline: FUTURE }, NOW),
    ).toBe("TO_CHECK");
  });

  it("keeps TO_CHECK when there is no deadline", () => {
    expect(getEffectiveStatus({ status: "TO_CHECK", deadline: null }, NOW)).toBe(
      "TO_CHECK",
    );
  });

  it("does not treat a deadline exactly equal to now as expired", () => {
    expect(getEffectiveStatus({ status: "TO_CHECK", deadline: NOW }, NOW)).toBe(
      "TO_CHECK",
    );
  });

  it.each(["DONE", "NOT_ACTUAL", "IDEAS_BACKLOG", "EXPIRED"] as CommitmentStatus[])(
    "never re-derives a non-TO_CHECK status (%s) even when overdue",
    (status) => {
      expect(getEffectiveStatus({ status, deadline: PAST }, NOW)).toBe(status);
    },
  );

  it("uses the current time when `now` is omitted", () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    expect(
      getEffectiveStatus({ status: "TO_CHECK", deadline: oneHourAgo }),
    ).toBe("EXPIRED");
  });
});

describe("status configuration", () => {
  it("has a non-empty config entry for every status", () => {
    for (const status of ALL_STATUSES) {
      expect(STATUS_CONFIG[status]).toBeDefined();
      expect(STATUS_CONFIG[status].label.length).toBeGreaterThan(0);
    }
  });

  it("lists exactly the five spec statuses", () => {
    expect([...ALL_STATUSES].sort()).toEqual(
      ["DONE", "EXPIRED", "IDEAS_BACKLOG", "NOT_ACTUAL", "TO_CHECK"].sort(),
    );
  });

  it("derives SELECTABLE_STATUSES from the config flags", () => {
    expect(SELECTABLE_STATUSES).toEqual(
      ALL_STATUSES.filter((status) => STATUS_CONFIG[status].selectable),
    );
  });
});
