'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { sessionManager } from '@/lib/session-manager';
import { cookieUtils } from '@/lib/cookie-utils';
import { csrfManager } from '@/lib/csrf-utils';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    profile_image: string | null;
    bio: string | null;
    username?: string | null;
    date_of_birth?: string | null;
    location?: string | null;
    points: number;
    level: number;
    streak_count: number;
    last_activity_date: string | null;
    is_onboarded_status?: 'complete' | 'incomplete' | 'skipped';
    is_professional?: boolean;
    professional_category?: string | null;
    created_at: string;
    updated_at: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    requestCode: (email: string) => Promise<void>;
    verifyCode: (email: string, code: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
    setServerUser: (user: User, token?: string) => void;
    authenticatedAction: (action: () => Promise<any>) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [hasServerUser, setHasServerUser] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Initialize auth state only once on mount
        if (!isInitialized) {
            initializeAuth();
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const initializeAuth = async () => {
        try {
            // Sync authentication tokens to ensure client-side access
            await syncAuthToken();

            // Skip profile fetching if we're expecting server user data
            // This prevents race condition with setServerUser
            if (!hasServerUser) {
                // For HttpOnly cookie authentication, check if we have a user profile
                // The backend manages tokens entirely via HttpOnly cookies
                await fetchProfile();
            }
        } catch (error) {
            console.error('Error initializing auth:', error);

            // If we're on the onboarding page and auth fails, redirect to auth page
            // This prevents the user from being stuck on onboarding without authentication
            if (typeof window !== 'undefined' && window.location.pathname === '/onboarding') {
                console.warn('Authentication failed on onboarding page, redirecting to auth');
                router.push('/auth');
                return;
            }
        } finally {
            // Only set loading to false if we don't have server user data coming
            if (!hasServerUser) {
                setIsLoading(false);
            }
        }
    };

    const fetchProfile = async () => {
        try {
            // For HttpOnly cookie auth, the backend handles token validation automatically
            const response = await apiClient.getProfile();
            if (response.success) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            // Only clear auth on network/auth errors, not on component unmount
            if (isInitialized) {
                setUser(null);
                sessionManager.stopTracking();
                router.push('/auth');
            }
        }
    };

    const requestCode = async (email: string) => {
        try {
            const response = await apiClient.requestVerificationCode(email);
            if (!response.success) {
                throw new Error(response.message);
            }
        } catch (error) {
            throw error;
        }
    };

    const verifyCode = async (email: string, code: string) => {
        try {
            const response = await apiClient.verifyCode(email, code);
            if (response.success) {
                const { user: userData, token, redirect_to } = response.data;

                // Store the JWT token for authentication BEFORE setting user
                if (token) {
                    localStorage.setItem('auth_token', token);
                }

                // Set user data
                setUser(userData);

                // Wait a short moment to ensure token is properly stored and cookies are set
                await new Promise(resolve => setTimeout(resolve, 100));

                // Sync authentication tokens to ensure proper state
                await syncAuthToken();

                // Use redirect_to from response if available, otherwise default behavior
                const redirectPath = redirect_to || (userData.is_new_user && userData.username ? `/@${userData.username}` : '/home');
                router.push(redirectPath);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            throw error;
        }
    };

    /**
     * Execute an action with CSRF protection - use this for in-app clicks/actions
     */
    const authenticatedAction = async (action: () => Promise<any>) => {
        if (!user) {
            throw new Error('Authentication required');
        }

        try {
            // Ensure we have a valid auth token before proceeding
            await syncAuthToken();
            return await action();
        } catch (error: any) {
            // If we get an authorization error, try syncing tokens once
            if (error?.message?.includes('Authorization header missing')) {
                try {
                    await syncAuthToken();
                    // Retry the action once after syncing
                    return await action();
                } catch (retryError: any) {
                    // If still failing after sync, it's a real auth issue
                    if (retryError?.message?.includes('Session expired')) {
                        await logout();
                        throw new Error('Session expired. Please log in again.');
                    }
                    throw retryError;
                }
            }

            // Only force logout for explicit session expiry
            if (error?.message?.includes('Session expired')) {
                await logout();
                throw new Error('Session expired. Please log in again.');
            }
            // For other auth errors, just re-throw without forcing logout
            throw error;
        }
    };

    /**
     * Sync authentication tokens between httpOnly and client-accessible cookies
     * This ensures the client can access the token for API requests
     */
    const syncAuthToken = async () => {
        try {
            // Use Next.js API route instead of direct backend call
            const response = await fetch('/api/auth/sync-token', {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                console.warn('Failed to sync auth token:', response.statusText);
            }
        } catch (error) {
            console.warn('Token sync error:', error);
        }
    };

    const logout = async () => {
        try {
            // Stop session tracking and mark as offline first
            await sessionManager.goOffline();

            // Call backend logout API to destroy sessions and clear server-side tokens
            try {
                await apiClient.logout();
            } catch (error) {
                console.error('Backend logout error:', error);
                // Continue with frontend cleanup even if backend fails
            }

            // Clear all client-side authentication data
            setUser(null);
            localStorage.clear(); // Clear all localStorage to ensure no auth remnants

            // Clear client-side cookies
            document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
            document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
            document.cookie = 'csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

            // Clear CSRF token
            csrfManager.clearToken();

            // Force a hard refresh to ensure all state is cleared and redirect to auth
            // This ensures no cached data or lingering authentication state
            window.location.href = '/auth';

        } catch (error) {
            console.error('Logout error:', error);

            // Force cleanup and redirect even if errors occur
            setUser(null);
            localStorage.clear();
            document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
            document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
            document.cookie = 'csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
            csrfManager.clearToken();

            // Force redirect with hot refresh
            window.location.href = '/auth';
        }
    };

    const refreshProfile = async () => {
        // Only refresh if we already have user data
        if (user) {
            await fetchProfile();
        }
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...userData });
        }
    };

    const setServerUser = (serverUser: User, token?: string) => {
        setUser(serverUser);
        setHasServerUser(true);

        // If a token is provided from server-side authentication, store it
        if (token) {
            localStorage.setItem('auth_token', token);
        }

        // Set loading to false since we have server user data
        setIsLoading(false);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        requestCode,
        verifyCode,
        logout,
        refreshProfile,
        updateUser,
        setServerUser,
        authenticatedAction,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
