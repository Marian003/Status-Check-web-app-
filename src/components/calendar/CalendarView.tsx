"use client";

import { useState } from "react";

import { addMonths, subMonths } from "@/lib/date";
import { useFilteredCommitments } from "@/hooks/useFilters";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { BacklogPanel } from "@/components/commitments/BacklogPanel";
import { FilterBar } from "@/components/filters/FilterBar";
import { CommitmentDialog } from "@/components/commitments/CommitmentDialog";
import type {
  CommitmentFilters,
  CommitmentWithRelations,
  ProjectOption,
  PublicUser,
} from "@/types";

interface DialogState {
  open: boolean;
  commitment: CommitmentWithRelations | null;
  presetDate: Date | null;
}

const EMPTY_FILTERS: CommitmentFilters = {
  projectId: null,
  checkerId: null,
};

export function CalendarView({
  commitments,
  projects: initialProjects,
  users,
  currentUserId,
}: {
  commitments: CommitmentWithRelations[];
  projects: ProjectOption[];
  users: PublicUser[];
  currentUserId: string;
}) {
  const [month, setMonth] = useState(() => new Date());
  const [filters, setFilters] = useState<CommitmentFilters>(EMPTY_FILTERS);
  const [projects, setProjects] = useState(initialProjects);
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    commitment: null,
    presetDate: null,
  });

  const { calendar, backlog } = useFilteredCommitments(commitments, filters);

  function openCreate(date: Date | null = null) {
    setDialog({ open: true, commitment: null, presetDate: date });
  }

  function openEdit(commitment: CommitmentWithRelations) {
    setDialog({ open: true, commitment, presetDate: null });
  }

  function handleProjectCreated(project: ProjectOption) {
    setProjects((prev) =>
      [...prev, project].sort((a, b) => a.name.localeCompare(b.name)),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <CalendarHeader
        month={month}
        onPrev={() => setMonth((current) => subMonths(current, 1))}
        onNext={() => setMonth((current) => addMonths(current, 1))}
        onToday={() => setMonth(new Date())}
        onCreate={() => openCreate(null)}
      />

      <FilterBar
        projects={projects}
        users={users}
        filters={filters}
        onChange={setFilters}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <CalendarGrid
          month={month}
          commitments={calendar}
          onAddCommitment={openCreate}
          onEditCommitment={openEdit}
        />
        <BacklogPanel
          commitments={backlog}
          onEditCommitment={openEdit}
          onCreate={() => openCreate(null)}
        />
      </div>

      <CommitmentDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}
        commitment={dialog.commitment}
        presetDate={dialog.presetDate}
        projects={projects}
        users={users}
        currentUserId={currentUserId}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
