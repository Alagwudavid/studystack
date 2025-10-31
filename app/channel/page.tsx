import { requireAuth } from "@/lib/server-auth";
import { ProtectedLayout } from "@/components/layouts/ProtectedLayout";
import ChannelsClient from "./ChannelsClient";

export default async function ChannelsPage() {
  // Require authentication - will redirect to login if not authenticated
  const { user } = await requireAuth();

  return (
    <ProtectedLayout user={user}>
      <ChannelsClient serverUser={user} />
    </ProtectedLayout>
  );
}
