import { redirect } from "next/navigation";

// The calendar is the main screen; auth is enforced by middleware.
export default function Home() {
  redirect("/calendar");
}
