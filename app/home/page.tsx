import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import { OnboardingGuard } from '@/components/OnboardingGuard';
import HomeClient from "./HomeClient";

export default async function HomePage() {
  // Require authentication - will redirect to login if not authenticated
  const { user } = await requireAuth();

  return (
    <ProtectedLayout user={user}>
      <OnboardingGuard>
        <HomeClient serverUser={user} />
      </OnboardingGuard>
    </ProtectedLayout>
  );
}