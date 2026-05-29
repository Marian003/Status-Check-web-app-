import type { DefaultSession } from "next-auth";

// Expose the user id on the session (we use it as the commitment author).
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
