"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { SELECTABLE_STATUSES, STATUS_CONFIG } from "@/lib/status";
import { updateStatusAction } from "@/server/actions/commitments";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/commitments/StatusBadge";
import type { CommitmentWithRelations } from "@/types";

/**
 * Quick status control: the trigger shows the effective status badge and the
 * dropdown offers all five statuses.
 */
export function StatusSelect({
  commitment,
  className,
}: {
  commitment: CommitmentWithRelations;
  className?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleChange(next: CommitmentWithRelations["status"] | null) {
    if (!next || next === commitment.status) return;

    setPending(true);
    const result = await updateStatusAction({ id: commitment.id, status: next });
    setPending(false);

    if (result.ok) {
      toast.success("Статус оновлено");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Select
      value={commitment.status}
      onValueChange={handleChange}
      disabled={pending}
    >
      <SelectTrigger
        aria-label="Змінити статус"
        className={cn(
          "h-auto! w-fit cursor-pointer rounded-full border-0! bg-transparent! p-0.5! shadow-none! hover:bg-muted focus-visible:ring-0 [&>svg]:hidden",
          className,
        )}
      >
        <StatusBadge commitment={commitment} />
      </SelectTrigger>
      <SelectContent align="start">
        {SELECTABLE_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {STATUS_CONFIG[status].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
