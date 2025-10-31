import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface User {
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
    followers_count: string | number;
    profile_completion_status?: 'completed' | 'incomplete' | 'hidden';
    is_onboarded_status?: 'complete' | 'incomplete' | 'skipped';
    is_professional?: boolean;
    professional_category?: string | null;
    last_activity_date: string | null;
    created_at: string;
    updated_at: string;
}

interface AuthValidationResult {
    success: boolean;
    user?: User;
    token?: string;
    message?: string;
}

// Simple cache for server-side auth results to reduce backend calls
const authCache = new Map<string, { result: AuthValidationResult; timestamp: number }>();
const CACHE_DURATION = 10000; // 10 seconds cache for server-side calls

function getCachedAuthResult(token: string): AuthValidationResult | null {
    const cached = authCache.get(token);
    if (!cached) return null;

    // Check if cache entry is still valid
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
        authCache.delete(token);
        return null;
    }

    return cached.result;
}

function setCachedAuthResult(token: string, result: AuthValidationResult): void {
    authCache.set(token, { result, timestamp: Date.now() });

    // Clean up old cache entries (keep cache size reasonable)
    if (authCache.size > 50) {
        const oldestEntries = Array.from(authCache.entries())
            .sort(([, a], [, b]) => a.timestamp - b.timestamp)
            .slice(0, 25);

        oldestEntries.forEach(([key]) => authCache.delete(key));
    }
}

/**
 * Validates authentication token on the server side
 */
async function validateAuthToken(token: string): Promise<AuthValidationResult> {
    try {
        // First, do basic JWT format validation
        if (!token || !token.includes('.') || token.split('.').length !== 3) {
            return { success: false, message: 'Invalid token format' };
        }

        // Check cache first to avoid redundant backend calls
        const cachedResult = getCachedAuthResult(token);
        if (cachedResult) {
            console.log('🚀 Server-side: Using cached auth validation result');
            return cachedResult;
        }

        // Make API call to backend to validate token and get user data
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

        const response = await fetch(`${backendUrl}/auth/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Protection': '1',
            },
        });

        let result: AuthValidationResult;

        if (!response.ok) {
            console.warn('Backend JWT validation failed with status:', response.status);
            result = { success: false, message: 'Token validation failed' };
        } else {
            const data = await response.json();

            if (data.success && data.data) {
                console.log('✅ Backend JWT validation successful');
                result = {
                    success: true,
                    user: data.data,
                    token,
                };
            } else {
                result = { success: false, message: data.message || 'Token validation failed' };
            }
        }

        // Cache the result
        setCachedAuthResult(token, result);
        return result;
    } catch (error) {
        console.error('Server auth validation error:', error);
        const result = { success: false, message: 'Authentication service unavailable' };
        setCachedAuthResult(token, result);
        return result;
    }
}

/**
 * Gets authentication token from cookies
 */
async function getAuthTokenFromCookies(): Promise<string | null> {
    try {
        const cookieStore = await cookies();

        // Get from HTTP-only cookie (server-managed authentication)
        const httpOnlyToken = cookieStore.get('auth_token');
        if (httpOnlyToken?.value) {
            return httpOnlyToken.value;
        }

        return null;
    } catch (error) {
        console.error('Error reading auth token from cookies:', error);
        return null;
    }
}

/**
 * Server-side authentication check that redirects immediately if not authenticated
 */
export async function requireAuth(): Promise<{ user: User; token: string }> {
    const token = await getAuthTokenFromCookies();

    if (!token) {
        redirect('/auth');
    }

    const authResult = await validateAuthToken(token);

    if (!authResult.success || !authResult.user) {
        redirect('/auth');
    }

    return {
        user: authResult.user,
        token,
    };
}

/**
 * Server-side authentication check without redirect (for optional auth)
 */
export async function getServerAuth(): Promise<{ user: User; token: string } | null> {
    const token = await getAuthTokenFromCookies();

    if (!token) {
        return null;
    }

    const authResult = await validateAuthToken(token);

    if (!authResult.success || !authResult.user) {
        return null;
    }

    return {
        user: authResult.user,
        token,
    };
}

/**
 * Redirects authenticated users away from auth pages immediately
 */
export async function redirectIfAuthenticated(redirectTo: string = '/home'): Promise<void> {
    const auth = await getServerAuth();

    if (auth) {
        redirect(redirectTo);
    }
}