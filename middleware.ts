import NextAuth from "next-auth";

import { authConfig } from "@/lib/auth.config";

// Protect every page route via the `authorized` callback in authConfig.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  // Skip Next internals, the auth API, and files with an extension.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
