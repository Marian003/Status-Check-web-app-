import { auth } from "@/lib/auth";
import { listCommitments } from "@/server/services/commitments";
import { listProjects } from "@/server/services/projects";
import { listUsers } from "@/server/services/users";
import { CalendarView } from "@/components/calendar/CalendarView";

// Shared calendar — every authenticated user sees the same commitments.
export default async function CalendarPage() {
  const session = await auth();
  const currentUserId = session?.user?.id ?? "";

  const [commitments, projects, users] = await Promise.all([
    listCommitments(),
    listProjects(),
    listUsers(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <CalendarView
        commitments={commitments}
        projects={projects}
        users={users}
        currentUserId={currentUserId}
      />
    </div>
  );
}
