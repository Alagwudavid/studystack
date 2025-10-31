import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayoutClient } from '@/components/layouts/ProtectedLayoutClient';

interface ServerProtectedLayoutProps {
    children: React.ReactNode;
}

/**
 * Server-side protected layout that enforces authentication before rendering
 */
export async function ServerProtectedLayout({ children }: ServerProtectedLayoutProps) {
    // This will redirect to /login if not authenticated
    const { user, token } = await requireAuth();

    return (
        <ProtectedLayoutClient user={user} token={token}>
            {children}
        </ProtectedLayoutClient>
    );
}
