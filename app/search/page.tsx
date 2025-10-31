import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import SearchClient from "./SearchClient";

export default async function SearchPage() {
  const { user } = await requireAuth();
  return (
    <ProtectedLayout user={user}>
      <SearchClient />
    </ProtectedLayout>
  );
}
