import { describe, expect, it } from "vitest";

import { partitionCommitments } from "@/lib/commitments";
import type { CommitmentFilters, CommitmentWithRelations } from "@/types";

function makeCommitment(
  overrides: Partial<CommitmentWithRelations> = {},
): CommitmentWithRelations {
  return {
    id: "c1",
    title: "Title",
    description: "",
    createdAt: new Date("2026-05-01T00:00:00Z"),
    deadline: new Date("2026-05-20T09:00:00Z"),
    isAllDay: false,
    status: "TO_CHECK",
    authorId: "author",
    projectId: "p1",
    executorId: "exec",
    checkerId: "check",
    project: { id: "p1", name: "Project 1" },
    author: { id: "author", name: "Author", email: "author@x.com" },
    executor: { id: "exec", name: "Exec", email: "exec@x.com" },
    checker: { id: "check", name: "Check", email: "check@x.com" },
    ...overrides,
  };
}

const NO_FILTERS: CommitmentFilters = { projectId: null, checkerId: null };

describe("partitionCommitments", () => {
  it("places deadline-bearing commitments on the calendar", () => {
    const { calendar, backlog } = partitionCommitments(
      [makeCommitment({ id: "a" })],
      NO_FILTERS,
    );
    expect(calendar.map((c) => c.id)).toEqual(["a"]);
    expect(backlog).toHaveLength(0);
  });

  it("places no-deadline commitments in the backlog", () => {
    const { calendar, backlog } = partitionCommitments(
      [makeCommitment({ id: "b", deadline: null })],
      NO_FILTERS,
    );
    expect(backlog.map((c) => c.id)).toEqual(["b"]);
    expect(calendar).toHaveLength(0);
  });

  it("places IDEAS_BACKLOG in the backlog even with a deadline", () => {
    const { backlog } = partitionCommitments(
      [makeCommitment({ id: "c", status: "IDEAS_BACKLOG" })],
      NO_FILTERS,
    );
    expect(backlog.map((c) => c.id)).toEqual(["c"]);
  });

  it("filters by project", () => {
    const items = [
      makeCommitment({ id: "a", projectId: "p1" }),
      makeCommitment({ id: "b", projectId: "p2" }),
    ];
    const { calendar } = partitionCommitments(items, {
      projectId: "p1",
      checkerId: null,
    });
    expect(calendar.map((c) => c.id)).toEqual(["a"]);
  });

  it("filters by checker", () => {
    const items = [
      makeCommitment({ id: "a", checkerId: "u1" }),
      makeCommitment({ id: "b", checkerId: "u2" }),
    ];
    const { calendar } = partitionCommitments(items, {
      projectId: null,
      checkerId: "u2",
    });
    expect(calendar.map((c) => c.id)).toEqual(["b"]);
  });

  it("combines project and checker filters (AND)", () => {
    const items = [
      makeCommitment({ id: "a", projectId: "p1", checkerId: "u1" }),
      makeCommitment({ id: "b", projectId: "p1", checkerId: "u2" }),
    ];
    const { calendar } = partitionCommitments(items, {
      projectId: "p1",
      checkerId: "u1",
    });
    expect(calendar.map((c) => c.id)).toEqual(["a"]);
  });
});
