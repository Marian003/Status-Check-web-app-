"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { createProject } from "@/server/services/projects";
import type { ProjectOption } from "@/types";

export type CreateProjectResult =
  | { ok: true; project: ProjectOption }
  | { ok: false; error: string };

/** Create a project on the fly from the commitment form. */
export async function createProjectAction(
  name: string,
): Promise<CreateProjectResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Потрібна авторизація" };

  const trimmed = name.trim();
  if (!trimmed) return { ok: false, error: "Вкажіть назву проєкту" };
  if (trimmed.length > 100) {
    return { ok: false, error: "Назва занадто довга (макс. 100 символів)" };
  }

  try {
    const project = await createProject(trimmed);
    revalidatePath("/calendar");
    return { ok: true, project };
  } catch {
    return { ok: false, error: "Проєкт з такою назвою вже існує" };
  }
}
