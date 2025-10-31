'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cookieUtils } from '@/lib/cookie-utils';

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    silentAuth?: boolean; // New prop to control silent authentication
}

export function AuthGuard({ children, fallback, silentAuth = true }: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [showAuthGuard, setShowAuthGuard] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Only show auth guard if silentAuth is disabled or cookie allows it
            const shouldShow = !silentAuth || cookieUtils.shouldShowAuthGuard();
            setShowAuthGuard(shouldShow);

            // If showing auth guard, mark it as shown for next 30 minutes
            if (shouldShow) {
                cookieUtils.markAuthGuardShown();
            }
        }
    }, [silentAuth]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated && !shouldRedirect) {
            setShouldRedirect(true);
            setIsRedirecting(true);

            // For silent auth, redirect immediately without delay
            const delay = silentAuth ? 0 : 500;

            const timer = setTimeout(() => {
                router.push('/auth');
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, isLoading, router, shouldRedirect, silentAuth]);

    // Show loading while auth is being checked (only if auth guard should be shown)
    if (isLoading && showAuthGuard) {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Show redirecting message when logging out or not authenticated (only if not silent)
    if (!silentAuth && (isRedirecting || (shouldRedirect && !isAuthenticated))) {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    // If auth is loading but we shouldn't show guard (silent mode), render children immediately
    // This allows the background auth check to happen silently
    if (isLoading && (!showAuthGuard || silentAuth)) {
        return <>{children}</>;
    }

    // If authenticated, show children
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // For silent auth mode, show children even during redirect setup
    if (silentAuth) {
        return <>{children}</>;
    }

    // Default fallback - show children briefly while redirect is being set up
    return <>{children}</>;
}
