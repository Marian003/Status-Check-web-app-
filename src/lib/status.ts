import type { CommitmentStatus } from "@prisma/client";

/**
 * Centralized status configuration — the single source of truth for the
 * Ukrainian label, badge colors and whether the status can be set manually.
 * No status strings/colors should be hard-coded anywhere else.
 */
export interface StatusConfig {
  /** Ukrainian label shown in the UI. */
  label: string;
  /** Whether the user can pick this status manually. */
  selectable: boolean;
  /** Tailwind classes for the status badge. */
  badgeClassName: string;
  /** Tailwind left-border accent color for the commitment card. */
  accentClassName: string;
}

export const STATUS_CONFIG: Record<CommitmentStatus, StatusConfig> = {
  TO_CHECK: {
    label: "Перевірити",
    selectable: true,
    badgeClassName: "bg-blue-100 text-blue-700 border-blue-200",
    accentClassName: "border-l-blue-400",
  },
  EXPIRED: {
    label: "Прострочено",
    selectable: true,
    badgeClassName: "bg-red-100 text-red-700 border-red-200",
    accentClassName: "border-l-red-400",
  },
  DONE: {
    label: "Виконано",
    selectable: true,
    badgeClassName: "bg-emerald-100 text-emerald-700 border-emerald-200",
    accentClassName: "border-l-emerald-400",
  },
  NOT_ACTUAL: {
    label: "Не актуально",
    selectable: true,
    badgeClassName: "bg-zinc-100 text-zinc-600 border-zinc-200",
    accentClassName: "border-l-zinc-300",
  },
  IDEAS_BACKLOG: {
    label: "Ідеї / Backlog",
    selectable: true,
    badgeClassName: "bg-violet-100 text-violet-700 border-violet-200",
    accentClassName: "border-l-violet-400",
  },
};

/** All statuses in display order (mirrors the Prisma enum). */
export const ALL_STATUSES = [
  "TO_CHECK",
  "EXPIRED",
  "DONE",
  "NOT_ACTUAL",
  "IDEAS_BACKLOG",
] as const satisfies readonly CommitmentStatus[];

/** Statuses the user may set manually (all five). */
export const SELECTABLE_STATUSES: CommitmentStatus[] = ALL_STATUSES.filter(
  (status) => STATUS_CONFIG[status].selectable,
);

/** Minimal shape required to compute the effective (derived) status. */
export interface EffectiveStatusInput {
  status: CommitmentStatus;
  deadline: Date | null;
}

/**
 * Effective status used for display/filtering. All five statuses can be set
 * manually, but EXPIRED is also derived: a commitment stored as TO_CHECK whose
 * deadline is in the past automatically shows as EXPIRED (matching the spec:
 * "дедлайн минув, комітмент не закрили й не перенесли"). This is the single
 * source of truth for that rule.
 */
export function getEffectiveStatus(
  commitment: EffectiveStatusInput,
  now: Date = new Date(),
): CommitmentStatus {
  if (
    commitment.status === "TO_CHECK" &&
    commitment.deadline !== null &&
    commitment.deadline.getTime() < now.getTime()
  ) {
    return "EXPIRED";
  }
  return commitment.status;
}
