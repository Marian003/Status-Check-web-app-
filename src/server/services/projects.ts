import "server-only";

import { db } from "@/lib/db";
import type { ProjectOption } from "@/types";

export function listProjects(): Promise<ProjectOption[]> {
  return db.project.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export function createProject(name: string): Promise<ProjectOption> {
  return db.project.create({
    data: { name },
    select: { id: true, name: true },
  });
}
