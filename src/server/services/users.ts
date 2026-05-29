import "server-only";

import { db } from "@/lib/db";
import type { PublicUser } from "@/types";

export function listUsers(): Promise<PublicUser[]> {
  return db.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}
