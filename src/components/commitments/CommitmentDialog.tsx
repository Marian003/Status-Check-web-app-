"use client";

import { formatFullDate } from "@/lib/date";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CommitmentForm } from "@/components/commitments/CommitmentForm";
import type {
  CommitmentWithRelations,
  ProjectOption,
  PublicUser,
} from "@/types";

export function CommitmentDialog({
  open,
  onOpenChange,
  commitment,
  presetDate,
  projects,
  users,
  currentUserId,
  onProjectCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commitment: CommitmentWithRelations | null;
  presetDate: Date | null;
  projects: ProjectOption[];
  users: PublicUser[];
  currentUserId: string;
  onProjectCreated: (project: ProjectOption) => void;
}) {
  const isEdit = commitment !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Редагувати комітмент" : "Новий комітмент"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Змініть будь-які поля та збережіть."
              : presetDate
                ? `Обрана дата: ${formatFullDate(presetDate)}`
                : "Заповніть поля та збережіть."}
          </DialogDescription>
        </DialogHeader>
        {open ? (
          <CommitmentForm
            key={commitment?.id ?? presetDate?.toISOString() ?? "new"}
            commitment={commitment}
            presetDate={presetDate}
            projects={projects}
            users={users}
            currentUserId={currentUserId}
            onProjectCreated={onProjectCreated}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
