import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import LearningSettingsClient from './LearningSettingsClient';

export default async function LearningSettingsPage() {
    const { user } = await requireAuth();

    return (
        <LearningSettingsClient serverUser={user} />
    );
}
