import "server-only";

import type { CommitmentStatus } from "@prisma/client";

import { db } from "@/lib/db";
import type { CommitmentInput } from "@/lib/validations/commitment";
import { commitmentInclude, type CommitmentWithRelations } from "@/types";

// Data-access layer for commitments. All commitment DB access lives here so the
// CRUD logic is not duplicated across actions/components.

/** All commitments (shared calendar) with the relations needed to render. */
export function listCommitments(): Promise<CommitmentWithRelations[]> {
  return db.commitment.findMany({
    include: commitmentInclude,
    orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
  });
}

export function createCommitment(
  data: CommitmentInput,
): Promise<CommitmentWithRelations> {
  return db.commitment.create({
    data,
    include: commitmentInclude,
  });
}

export function updateCommitment(
  id: string,
  data: CommitmentInput,
): Promise<CommitmentWithRelations> {
  return db.commitment.update({
    where: { id },
    data,
    include: commitmentInclude,
  });
}

export function updateCommitmentStatus(
  id: string,
  status: CommitmentStatus,
): Promise<CommitmentWithRelations> {
  return db.commitment.update({
    where: { id },
    data: { status },
    include: commitmentInclude,
  });
}

export async function deleteCommitment(id: string): Promise<void> {
  await db.commitment.delete({ where: { id } });
}
