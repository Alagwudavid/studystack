import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import ActivitiesClient from "./ActivitiesClient";

export default async function ActivitiesPage() {
    // Require authentication - will redirect to login if not authenticated
    const { user } = await requireAuth();

    return (
        <ProtectedLayout user={user}>
            <ActivitiesClient serverUser={user} />
        </ProtectedLayout>
    );
}