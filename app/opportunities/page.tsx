import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import { OnboardingGuard } from '@/components/OnboardingGuard';
import OpportuntiesClient from "./OpportuntiesClient";

export default async function CompaniesPage() {
  // Require authentication - will redirect to login if not authenticated
  const { user } = await requireAuth();

  return (
    <ProtectedLayout user={user}>
      <OnboardingGuard>
        <OpportuntiesClient serverUser={user} />
      </OnboardingGuard>
    </ProtectedLayout>
  );
}