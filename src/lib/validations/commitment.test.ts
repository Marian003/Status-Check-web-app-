import { describe, expect, it } from "vitest";

import {
  commitmentInputSchema,
  commitmentUpdateSchema,
  statusUpdateSchema,
} from "@/lib/validations/commitment";

const validInput = {
  title: "Перевірити звіт",
  description: "опис",
  projectId: "p1",
  authorId: "u1",
  executorId: "u2",
  checkerId: "u3",
  status: "TO_CHECK",
  isAllDay: true,
  deadline: new Date("2026-05-29T09:00:00Z"),
};

describe("commitmentInputSchema", () => {
  it("accepts a valid commitment", () => {
    expect(commitmentInputSchema.safeParse(validInput).success).toBe(true);
  });

  it("accepts a null deadline (backlog item)", () => {
    expect(
      commitmentInputSchema.safeParse({ ...validInput, deadline: null }).success,
    ).toBe(true);
  });

  it("coerces an ISO string deadline to a Date", () => {
    const result = commitmentInputSchema.safeParse({
      ...validInput,
      deadline: "2026-05-29T09:00:00Z",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.deadline).toBeInstanceOf(Date);
    }
  });

  it("defaults description to an empty string when omitted", () => {
    const result = commitmentInputSchema.safeParse({
      title: "T",
      projectId: "p1",
      authorId: "u1",
      executorId: "u2",
      checkerId: "u3",
      status: "TO_CHECK",
      isAllDay: true,
      deadline: null,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe("");
    }
  });

  it("rejects an empty title", () => {
    expect(
      commitmentInputSchema.safeParse({ ...validInput, title: "" }).success,
    ).toBe(false);
  });

  it("rejects a title longer than 200 characters", () => {
    expect(
      commitmentInputSchema.safeParse({ ...validInput, title: "a".repeat(201) })
        .success,
    ).toBe(false);
  });

  it.each(["projectId", "authorId", "executorId", "checkerId"] as const)(
    "requires %s",
    (field) => {
      expect(
        commitmentInputSchema.safeParse({ ...validInput, [field]: "" }).success,
      ).toBe(false);
    },
  );

  it("accepts every one of the five statuses", () => {
    for (const status of [
      "TO_CHECK",
      "EXPIRED",
      "DONE",
      "NOT_ACTUAL",
      "IDEAS_BACKLOG",
    ]) {
      expect(
        commitmentInputSchema.safeParse({ ...validInput, status }).success,
      ).toBe(true);
    }
  });

  it("rejects an unknown status", () => {
    expect(
      commitmentInputSchema.safeParse({ ...validInput, status: "NOPE" }).success,
    ).toBe(false);
  });
});

describe("commitmentUpdateSchema", () => {
  it("requires an id", () => {
    expect(commitmentUpdateSchema.safeParse(validInput).success).toBe(false);
    expect(
      commitmentUpdateSchema.safeParse({ ...validInput, id: "c1" }).success,
    ).toBe(true);
  });
});

describe("statusUpdateSchema", () => {
  it("accepts an id with a valid status", () => {
    expect(
      statusUpdateSchema.safeParse({ id: "c1", status: "DONE" }).success,
    ).toBe(true);
  });

  it("rejects an unknown status", () => {
    expect(
      statusUpdateSchema.safeParse({ id: "c1", status: "NOPE" }).success,
    ).toBe(false);
  });

  it("requires an id", () => {
    expect(statusUpdateSchema.safeParse({ status: "DONE" }).success).toBe(false);
  });
});
