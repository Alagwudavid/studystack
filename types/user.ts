export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    profile_image: string | null;
    banner_url?: string | null;
    banner_image?: string | null;
    bio: string | null;
    username?: string | null;
    date_of_birth?: string | null;
    location?: string | null;
    website?: string | null;
    points: number;
    level: number;
    streak_count: number;
    last_activity_date: string | null;
    profile_completion_status?: 'completed' | 'incomplete' | 'hidden';
    followers_count: string | number;
    is_following?: boolean;
    is_onboarded_status?: 'complete' | 'incomplete' | 'skipped';
    is_professional?: boolean;
    professional_category?: string | null;
    created_at: string;
    updated_at: string;
}
