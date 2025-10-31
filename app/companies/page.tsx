import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import { OnboardingGuard } from '@/components/OnboardingGuard';
import CompaniesClient from "./CompaniesClient";

export default async function CompaniesPage() {
  // Require authentication - will redirect to login if not authenticated
  const { user } = await requireAuth();

  return (
    <ProtectedLayout user={user}>
      <OnboardingGuard>
        <CompaniesClient serverUser={user} />
      </OnboardingGuard>
    </ProtectedLayout>
  );
}