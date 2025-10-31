import { requireAuth } from '@/lib/server-auth';
import NotificationsSettingsClient from './NotificationsSettingsClient';

export default async function NotificationsSettingsPage() {
    const { user } = await requireAuth();

    return (
        <NotificationsSettingsClient serverUser={user} />
    );
}
