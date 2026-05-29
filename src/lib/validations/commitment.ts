import { z } from "zod";

import { ALL_STATUSES, STATUS_CONFIG } from "@/lib/status";

// Single, shared validation source for commitments — the same schemas run on
// the client (form) and the server (actions). The server never trusts the
// client and re-validates with these exact schemas.

// Accept any of the configured selectable statuses (all five).
const selectableStatus = z
  .enum(ALL_STATUSES)
  .refine((status) => STATUS_CONFIG[status].selectable, {
    message: "Цей статус не можна встановити вручну",
  });

export const commitmentInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Вкажіть назву")
    .max(200, "Назва занадто довга (макс. 200 символів)"),
  description: z
    .string()
    .trim()
    .max(2000, "Опис занадто довгий (макс. 2000 символів)")
    .default(""),
  projectId: z.string().min(1, "Оберіть проєкт"),
  authorId: z.string().min(1, "Оберіть автора"),
  executorId: z.string().min(1, "Оберіть відповідального виконавця"),
  checkerId: z.string().min(1, "Оберіть відповідального за перевірку"),
  status: selectableStatus,
  isAllDay: z.boolean(),
  // Nullable: ideas backlog / no-deadline commitments have no deadline.
  deadline: z.coerce.date().nullable(),
});

export type CommitmentInput = z.infer<typeof commitmentInputSchema>;

export const commitmentUpdateSchema = commitmentInputSchema.extend({
  id: z.string().min(1),
});

export type CommitmentUpdateInput = z.infer<typeof commitmentUpdateSchema>;

// Quick status change uses only the id and the new (selectable) status.
export const statusUpdateSchema = z.object({
  id: z.string().min(1),
  status: selectableStatus,
});

export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>;
