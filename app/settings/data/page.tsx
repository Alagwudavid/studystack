import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import DataSettingsClient from './DataSettingsClient';

export default async function DataSettingsPage() {
    const { user } = await requireAuth();

    return (
        <DataSettingsClient serverUser={user} />
    );
}
