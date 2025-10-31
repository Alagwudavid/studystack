import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import DiscoverClient from "./DiscoverClient";

export default async function ExplorePage() {
  // Require authentication - will redirect to login if not authenticated
  const { user } = await requireAuth();

  return (
    <ProtectedLayout user={user}>
      <DiscoverClient serverUser={user} />
    </ProtectedLayout>
  );
}