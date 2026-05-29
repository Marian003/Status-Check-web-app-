"use client";

import { FilterSelect } from "@/components/filters/FilterSelect";
import type { PublicUser } from "@/types";

export function CheckerFilter({
  users,
  value,
  onChange,
}: {
  users: PublicUser[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <FilterSelect
      label="Відповідальний за перевірку"
      allLabel="Усі"
      value={value}
      onChange={onChange}
      options={users.map((user) => ({ value: user.id, label: user.name }))}
    />
  );
}
