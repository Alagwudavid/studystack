import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import { OnboardingGuard } from '@/components/OnboardingGuard';
import ProfileHeader from "./ProfileHeader";
import { notFound } from 'next/navigation';
import type { User } from '@/types/user';

interface UserProfileLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        username: string;
    }>;
}

type UserData = {
    id: number;
    username: string;
    name: string;
    bio?: string;
    avatar_url?: string;
    profile_image?: string;
    banner_image?: string;
    banner_url?: string;
    location?: string;
    website?: string;
    is_professional?: boolean;
    professional_category?: string;
    points?: number;
    level?: number;
    streak_count?: number;
    created_at?: string;
    followers_count?: string | number;
    is_following?: boolean;
    profile_completion_status?: string;
    is_onboarded_status?: string;
    email_verified_at?: string;
    last_activity_date?: string;
    updated_at?: string;
    date_of_birth?: string;
};

// Map API response to User interface
function mapUserDataToUser(userData: UserData): User {
    return {
        id: userData.id,
        name: userData.name,
        email: '', // Not provided by public API
        email_verified_at: userData.email_verified_at || null,
        profile_image: userData.profile_image || userData.avatar_url || null,
        banner_url: userData.banner_url || userData.banner_image || null,
        bio: userData.bio || null,
        username: userData.username || null,
        date_of_birth: userData.date_of_birth || null,
        location: userData.location || null,
        website: userData.website || null,
        points: userData.points || 0,
        level: userData.level || 1,
        streak_count: userData.streak_count || 0,
        last_activity_date: userData.last_activity_date || null,
        is_professional: userData.is_professional || false,
        followers_count: userData.followers_count || 0,
        is_following: userData.is_following || false,
        professional_category: userData.professional_category || null,
        profile_completion_status: (userData.profile_completion_status as any) || 'incomplete',
        is_onboarded_status: (userData.is_onboarded_status as any) || 'incomplete',
        created_at: userData.created_at || new Date().toISOString(),
        updated_at: userData.updated_at || new Date().toISOString(),
    };
}

export default async function UserProfileLayout({
    children,
    params
}: UserProfileLayoutProps) {
    const { username } = await params;

    if (!username || typeof username !== 'string') {
        notFound();
    }

    let currentUser = null;
    let authToken = null;
    try {
        const authResult = await requireAuth();
        currentUser = authResult.user;
        authToken = authResult.token;
    } catch {
        // User is not authenticated
    }

    // Always fetch profile data from API for consistency
    let profileUser: UserData;
    try {
        // For server-side fetch, we need absolute URL
        const baseUrl = process.env.NODE_ENV === 'production'
            ? process.env.NEXTAUTH_URL || 'https://your-domain.com'
            : 'http://localhost:3000';

        const apiUrl = `${baseUrl}/api/users/${encodeURIComponent(username)}`;

        // Prepare headers with auth token if available
        const headers: Record<string, string> = {
            'Accept': 'application/json',
        };

        // Add auth token if current user is authenticated
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        console.log(`Fetching user data for username: ${username} from ${apiUrl}`);

        const res = await fetch(apiUrl, {
            cache: 'no-store',
            headers,
        });

        console.log(`API response status for ${username}:`, res.status);

        if (res.status === 404) {
            console.log(`User ${username} not found`);
            notFound();
        }

        if (!res.ok) {
            console.error(`Failed to fetch user ${username}:`, res.status, res.statusText);
            notFound();
        }

        profileUser = await res.json();

        if (!profileUser || !profileUser.username) {
            console.error(`Invalid user data for ${username}:`, profileUser);
            notFound();
        }

        console.log(`Successfully loaded profile for ${username}`);
    } catch (error) {
        console.error('UserProfileLayout - Error:', error);
        notFound();
    }

    const isOwnProfile = currentUser?.username === username;

    if (isOwnProfile && currentUser) {
        return (
            <ProtectedLayout user={currentUser}>
                <OnboardingGuard>
                    <div className="w-full">
                        <ProfileHeader
                            user={mapUserDataToUser(profileUser)}
                            username={username}
                        />
                        {children}
                    </div>
                </OnboardingGuard>
            </ProtectedLayout>
        );
    }

    return (
        <ProtectedLayout user={currentUser}>
            <div className="w-full min-h-screen bg-background">
                <ProfileHeader
                    user={mapUserDataToUser(profileUser)}
                    username={username}
                />
                {children}
            </div>
        </ProtectedLayout>
    );
}
