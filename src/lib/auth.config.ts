import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js configuration shared by the middleware and the full config
 * in `auth.ts`. It contains no Node-only dependencies (bcrypt/Prisma live in
 * `auth.ts`). The `authorized` callback is the single place that decides route
 * access, so middleware protection stays consistent.
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  // Real providers are registered in auth.ts (they need Node APIs).
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const { pathname } = nextUrl;
      const isAuthRoute =
        pathname.startsWith("/login") || pathname.startsWith("/register");

      if (isAuthRoute) {
        // Already authenticated users never see login/register.
        if (isLoggedIn) {
          return Response.redirect(new URL("/calendar", nextUrl));
        }
        return true;
      }

      // Every other matched route requires an authenticated session.
      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
