"use client";

import { signOutAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="outline" size="sm">
        Вийти
      </Button>
    </form>
  );
}
