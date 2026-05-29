import type { CommitmentFilters, CommitmentWithRelations } from "@/types";

export interface SplitCommitments {
  /** Items placed on the calendar grid (have a deadline, not in backlog). */
  calendar: CommitmentWithRelations[];
  /** Items shown in the side panel (no deadline or IDEAS_BACKLOG status). */
  backlog: CommitmentWithRelations[];
}

/**
 * Pure logic: apply the combinable filters (project / checker) and split the
 * result into calendar vs backlog items. Extracted from the React hook so it
 * can be unit-tested in isolation.
 */
export function partitionCommitments(
  commitments: CommitmentWithRelations[],
  filters: CommitmentFilters,
): SplitCommitments {
  const filtered = commitments.filter((commitment) => {
    if (filters.projectId && commitment.projectId !== filters.projectId) {
      return false;
    }
    if (filters.checkerId && commitment.checkerId !== filters.checkerId) {
      return false;
    }
    return true;
  });

  const calendar: CommitmentWithRelations[] = [];
  const backlog: CommitmentWithRelations[] = [];
  for (const commitment of filtered) {
    const isBacklog =
      commitment.deadline === null || commitment.status === "IDEAS_BACKLOG";
    (isBacklog ? backlog : calendar).push(commitment);
  }

  return { calendar, backlog };
}
