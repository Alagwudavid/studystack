import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import CommunityClient from "./CommunityClient";

export default async function CommunityPage() {
  const { user } = await requireAuth();
  return (
    <ProtectedLayout user={user}>
      <CommunityClient />
    </ProtectedLayout>
  );
}
