import { useMemo } from "react";

import {
  partitionCommitments,
  type SplitCommitments,
} from "@/lib/commitments";
import type { CommitmentFilters, CommitmentWithRelations } from "@/types";

export type { SplitCommitments };

/** Memoized React wrapper around the pure `partitionCommitments` logic. */
export function useFilteredCommitments(
  commitments: CommitmentWithRelations[],
  filters: CommitmentFilters,
): SplitCommitments {
  return useMemo(
    () => partitionCommitments(commitments, filters),
    [commitments, filters],
  );
}
