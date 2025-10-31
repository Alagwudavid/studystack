import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import ClassroomClient from "./ClassroomClient";
import { requireAuth } from '@/lib/server-auth';

export default async function CommunityPage() {
  const { user } = await requireAuth();
  return (
    <ProtectedLayout user={user}>
      <ClassroomClient />
    </ProtectedLayout>
  );
}
