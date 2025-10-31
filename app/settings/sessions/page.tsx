import { requireAuth } from '@/lib/server-auth';
import SessionsSettingsClient from './SessionsSettingsClient';

export default async function SessionsSettingsPage() {
    const { user } = await requireAuth();

    return (
        <SessionsSettingsClient serverUser={user} />
    );
}
