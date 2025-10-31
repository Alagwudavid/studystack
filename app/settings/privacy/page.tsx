import { requireAuth } from '@/lib/server-auth';
import PrivacySettingsClient from './PrivacySettingsClient';

export default async function PrivacySettingsPage() {
    const { user } = await requireAuth();

    return (
        <PrivacySettingsClient serverUser={user} />
    );
}
