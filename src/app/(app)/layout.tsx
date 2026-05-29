import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { AppHeader } from "@/components/layout/AppHeader";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Middleware already guards these routes; this is a defensive fallback and
  // also gives server components access to the session.
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userName = session.user.name ?? session.user.email ?? "Користувач";

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader userName={userName} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
