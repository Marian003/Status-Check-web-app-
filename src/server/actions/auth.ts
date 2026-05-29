"use server";

import { hash } from "bcryptjs";

import { signOut } from "@/lib/auth";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";
import type { ActionResult } from "@/types";

const PASSWORD_SALT_ROUNDS = 10;

/** Register a new user (email + hashed password). Sign-in happens client-side. */
export async function registerUser(input: unknown): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Некоректні дані",
    };
  }

  const { name, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "Користувач з таким email вже існує" };
  }

  const passwordHash = await hash(password, PASSWORD_SALT_ROUNDS);
  await db.user.create({ data: { name, email, passwordHash } });

  return { ok: true };
}

/** Sign the current user out and send them back to the login page. */
export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
