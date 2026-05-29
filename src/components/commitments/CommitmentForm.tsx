"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { commitmentInputSchema } from "@/lib/validations/commitment";
import { buildDeadline, formatFullDate } from "@/lib/date";
import {
  createCommitmentAction,
  updateCommitmentAction,
} from "@/server/actions/commitments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserSelect } from "@/components/commitments/fields/UserSelect";
import { ProjectField } from "@/components/commitments/fields/ProjectField";
import { StatusField } from "@/components/commitments/fields/StatusField";
import {
  DeadlineField,
  initialDeadlineValue,
  type DeadlineValue,
} from "@/components/commitments/fields/DeadlineField";
import { DeleteCommitmentButton } from "@/components/commitments/DeleteCommitmentButton";
import type {
  CommitmentWithRelations,
  ProjectOption,
  PublicUser,
} from "@/types";

export function CommitmentForm({
  commitment,
  presetDate,
  projects,
  users,
  currentUserId,
  onProjectCreated,
  onClose,
}: {
  commitment: CommitmentWithRelations | null;
  presetDate: Date | null;
  projects: ProjectOption[];
  users: PublicUser[];
  currentUserId: string;
  onProjectCreated: (project: ProjectOption) => void;
  onClose: () => void;
}) {
  const router = useRouter();
  const isEdit = commitment !== null;

  const [title, setTitle] = useState(commitment?.title ?? "");
  const [description, setDescription] = useState(commitment?.description ?? "");
  const [projectId, setProjectId] = useState(commitment?.projectId ?? "");
  const [authorId, setAuthorId] = useState(
    commitment?.authorId ?? currentUserId,
  );
  const [executorId, setExecutorId] = useState(commitment?.executorId ?? "");
  const [checkerId, setCheckerId] = useState(commitment?.checkerId ?? "");
  const [status, setStatus] = useState(commitment?.status ?? "TO_CHECK");
  const [deadline, setDeadline] = useState<DeadlineValue>(() =>
    initialDeadlineValue(commitment, presetDate),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = commitmentInputSchema.safeParse({
      title,
      description,
      projectId,
      authorId,
      executorId,
      checkerId,
      status,
      isAllDay: deadline.hasDeadline ? deadline.isAllDay : true,
      deadline: buildDeadline(deadline),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Перевірте поля форми");
      return;
    }

    setPending(true);
    const result =
      isEdit && commitment
        ? await updateCommitmentAction({ ...parsed.data, id: commitment.id })
        : await createCommitmentAction(parsed.data);
    setPending(false);

    if (result.ok) {
      toast.success(isEdit ? "Комітмент оновлено" : "Комітмент створено");
      router.refresh();
      onClose();
    } else {
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {isEdit && commitment ? (
        <p className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          Створено: {formatFullDate(commitment.createdAt)}
        </p>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Назва</Label>
        <Input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Опис</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          maxLength={2000}
        />
      </div>

      <ProjectField
        value={projectId}
        onChange={setProjectId}
        projects={projects}
        onProjectCreated={onProjectCreated}
      />

      <UserSelect
        id="author"
        label="Автор"
        value={authorId}
        onChange={setAuthorId}
        users={users}
        placeholder="Хто автор"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <UserSelect
          id="executor"
          label="Відповідальний виконавець"
          value={executorId}
          onChange={setExecutorId}
          users={users}
          placeholder="Хто виконує"
        />
        <UserSelect
          id="checker"
          label="Відповідальний за перевірку"
          value={checkerId}
          onChange={setCheckerId}
          users={users}
          placeholder="Хто перевіряє"
        />
      </div>

      <StatusField value={status} onChange={setStatus} />

      <DeadlineField value={deadline} onChange={setDeadline} />

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex items-center justify-between gap-2 pt-1">
        <div>
          {isEdit && commitment ? (
            <DeleteCommitmentButton
              commitmentId={commitment.id}
              onDeleted={onClose}
            />
          ) : null}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Скасувати
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Збереження…" : "Зберегти"}
          </Button>
        </div>
      </div>
    </form>
  );
}
