import type { Prisma, Project, User } from "@prisma/client";

// Single source of truth for app-wide types. Base types come from Prisma;
// the relation shape is derived from one shared `include` so the query and the
// type can never drift apart.

/** User fields safe to expose to the client (never the password hash). */
export type PublicUser = Pick<User, "id" | "name" | "email">;

/** Project fields used across the UI. */
export type ProjectOption = Pick<Project, "id" | "name">;

/** Shared relation selection for commitment queries. */
export const commitmentInclude = {
  project: { select: { id: true, name: true } },
  author: { select: { id: true, name: true, email: true } },
  executor: { select: { id: true, name: true, email: true } },
  checker: { select: { id: true, name: true, email: true } },
} satisfies Prisma.CommitmentInclude;

/** A commitment together with the relations the UI needs to render a card. */
export type CommitmentWithRelations = Prisma.CommitmentGetPayload<{
  include: typeof commitmentInclude;
}>;

/** Active filter selection — shared by the calendar grid and the backlog. */
export interface CommitmentFilters {
  projectId: string | null;
  checkerId: string | null;
}

/** Result shape returned by server actions (drives inline UI messages). */
export type ActionResult = { ok: true } | { ok: false; error: string };
