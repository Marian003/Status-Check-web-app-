"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import {
  commitmentInputSchema,
  commitmentUpdateSchema,
  statusUpdateSchema,
} from "@/lib/validations/commitment";
import {
  createCommitment,
  deleteCommitment,
  updateCommitment,
  updateCommitmentStatus,
} from "@/server/services/commitments";
import type { ActionResult } from "@/types";

const CALENDAR_PATH = "/calendar";

async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

function invalid(message: string | undefined): ActionResult {
  return { ok: false, error: message ?? "Некоректні дані" };
}

export async function createCommitmentAction(
  input: unknown,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { ok: false, error: "Потрібна авторизація" };

  const parsed = commitmentInputSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error.issues[0]?.message);

  try {
    await createCommitment(parsed.data);
    revalidatePath(CALENDAR_PATH);
    return { ok: true };
  } catch (error) {
    console.error("createCommitmentAction failed:", error);
    return { ok: false, error: "Не вдалося створити комітмент" };
  }
}

export async function updateCommitmentAction(
  input: unknown,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { ok: false, error: "Потрібна авторизація" };

  const parsed = commitmentUpdateSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error.issues[0]?.message);

  const { id, ...data } = parsed.data;
  try {
    await updateCommitment(id, data);
    revalidatePath(CALENDAR_PATH);
    return { ok: true };
  } catch (error) {
    console.error("updateCommitmentAction failed:", error);
    return { ok: false, error: "Не вдалося оновити комітмент" };
  }
}

export async function updateStatusAction(input: unknown): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { ok: false, error: "Потрібна авторизація" };

  const parsed = statusUpdateSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error.issues[0]?.message);

  try {
    await updateCommitmentStatus(parsed.data.id, parsed.data.status);
    revalidatePath(CALENDAR_PATH);
    return { ok: true };
  } catch (error) {
    console.error("updateStatusAction failed:", error);
    return { ok: false, error: "Не вдалося змінити статус" };
  }
}

export async function deleteCommitmentAction(
  id: string,
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { ok: false, error: "Потрібна авторизація" };
  if (!id) return { ok: false, error: "Некоректний ідентифікатор" };

  try {
    await deleteCommitment(id);
    revalidatePath(CALENDAR_PATH);
    return { ok: true };
  } catch (error) {
    console.error("deleteCommitmentAction failed:", error);
    return { ok: false, error: "Не вдалося видалити комітмент" };
  }
}
