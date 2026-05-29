"use client";

import { FilterSelect } from "@/components/filters/FilterSelect";
import type { ProjectOption } from "@/types";

export function ProjectFilter({
  projects,
  value,
  onChange,
}: {
  projects: ProjectOption[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <FilterSelect
      label="Проєкт"
      allLabel="Усі проєкти"
      value={value}
      onChange={onChange}
      options={projects.map((project) => ({
        value: project.id,
        label: project.name,
      }))}
    />
  );
}
