import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import LearnClient from "./LearnClient";

export default async function LearnPage() {
  // Server-side authentication check - redirects if not authenticated
  const { user } = await requireAuth();

  return (
    <ProtectedLayout user={user}>
      <LearnClient serverUser={user} />
    </ProtectedLayout>
  );
}
