import Link from "next/link";
import { CalendarDaysIcon } from "lucide-react";

import { SignOutButton } from "@/components/layout/SignOutButton";

export function AppHeader({ userName }: { userName: string }) {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/calendar"
          className="flex items-center gap-2 font-semibold"
        >
          <CalendarDaysIcon className="size-5 text-primary" />
          Status Check
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-muted-foreground sm:inline">
            {userName}
          </span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
