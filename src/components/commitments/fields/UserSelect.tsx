"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { PublicUser } from "@/types";

export function UserSelect({
  id,
  label,
  value,
  onChange,
  users,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  users: PublicUser[];
  placeholder?: string;
}) {
  const selected = users.find((user) => user.id === value);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value || null}
        onValueChange={(next) => onChange(next ?? "")}
      >
        <SelectTrigger id={id} className="w-full">
          <span className={selected ? "truncate" : "truncate text-muted-foreground"}>
            {selected ? selected.name : (placeholder ?? "Оберіть…")}
          </span>
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
