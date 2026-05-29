"use client";

import { Button } from "@/components/ui/button";
import { ProjectFilter } from "@/components/filters/ProjectFilter";
import { CheckerFilter } from "@/components/filters/CheckerFilter";
import type { CommitmentFilters, ProjectOption, PublicUser } from "@/types";

export function FilterBar({
  projects,
  users,
  filters,
  onChange,
}: {
  projects: ProjectOption[];
  users: PublicUser[];
  filters: CommitmentFilters;
  onChange: (filters: CommitmentFilters) => void;
}) {
  const hasActive = filters.projectId !== null || filters.checkerId !== null;

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-3">
      <ProjectFilter
        projects={projects}
        value={filters.projectId}
        onChange={(projectId) => onChange({ ...filters, projectId })}
      />
      <CheckerFilter
        users={users}
        value={filters.checkerId}
        onChange={(checkerId) => onChange({ ...filters, checkerId })}
      />
      {hasActive ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({ projectId: null, checkerId: null })}
        >
          Скинути
        </Button>
      ) : null}
    </div>
  );
}
