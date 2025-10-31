import { redirect } from "next/navigation";

export default function Page() {
  // Redirect to coming-soon page for guests
  redirect("/home");
}
