"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PlusIcon, XIcon } from "lucide-react";

import { createProjectAction } from "@/server/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { ProjectOption } from "@/types";

export function ProjectField({
  value,
  onChange,
  projects,
  onProjectCreated,
}: {
  value: string;
  onChange: (value: string) => void;
  projects: ProjectOption[];
  onProjectCreated: (project: ProjectOption) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const selected = projects.find((project) => project.id === value);

  async function handleCreate() {
    setPending(true);
    const result = await createProjectAction(name);
    setPending(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    onProjectCreated(result.project);
    onChange(result.project.id);
    setName("");
    setAdding(false);
    toast.success("Проєкт створено");
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="project">Проєкт</Label>
      {adding ? (
        <div className="flex items-center gap-2">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Назва нового проєкту"
            autoFocus
          />
          <Button
            type="button"
            size="sm"
            onClick={handleCreate}
            disabled={pending || name.trim().length === 0}
          >
            Додати
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => {
              setAdding(false);
              setName("");
            }}
            aria-label="Скасувати створення проєкту"
          >
            <XIcon />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Select
            value={value || null}
            onValueChange={(next) => onChange(next ?? "")}
          >
            <SelectTrigger id="project" className="w-full">
              <span
                className={selected ? "truncate" : "truncate text-muted-foreground"}
              >
                {selected ? selected.name : "Оберіть проєкт"}
              </span>
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => setAdding(true)}
            aria-label="Новий проєкт"
          >
            <PlusIcon />
          </Button>
        </div>
      )}
    </div>
  );
}
