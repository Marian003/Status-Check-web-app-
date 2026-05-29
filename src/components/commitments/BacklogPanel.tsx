"use client";

import { InboxIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CommitmentCard } from "@/components/commitments/CommitmentCard";
import type { CommitmentWithRelations } from "@/types";

export function BacklogPanel({
  commitments,
  onEditCommitment,
  onCreate,
}: {
  commitments: CommitmentWithRelations[];
  onEditCommitment: (commitment: CommitmentWithRelations) => void;
  onCreate: () => void;
}) {
  return (
    <aside className="flex h-fit flex-col gap-3 rounded-lg border bg-card p-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <InboxIcon className="size-4" />
          Backlog / без дедлайну
        </h2>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onCreate}
          aria-label="Додати елемент у backlog"
        >
          <PlusIcon />
        </Button>
      </div>

      {commitments.length === 0 ? (
        <p className="text-sm text-muted-foreground">Немає елементів.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {commitments.map((commitment) => (
            <CommitmentCard
              key={commitment.id}
              commitment={commitment}
              onEdit={onEditCommitment}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
