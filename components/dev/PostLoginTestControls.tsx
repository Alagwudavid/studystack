'use client';

import { Button } from "@/components/ui/button";
import { cookieUtils, COOKIE_KEYS } from "@/lib/cookie-utils";
import { useState } from "react";

export function PostLoginTestControls() {
    const [postLoginStatus, setPostLoginStatus] = useState<string>('');
    const [authGuardStatus, setAuthGuardStatus] = useState<string>('');

    const checkPostLoginStatus = () => {
        if (typeof window !== 'undefined') {
            const shouldShow = cookieUtils.shouldShowPostLoginLoading();
            setPostLoginStatus(shouldShow ? 'Will show post-login loading' : 'Will skip post-login loading');
        }
    };

    const checkAuthGuardStatus = () => {
        if (typeof window !== 'undefined') {
            const shouldShow = cookieUtils.shouldShowAuthGuard();
            setAuthGuardStatus(shouldShow ? 'Will show auth guard' : 'Will skip auth guard (silent background)');
        }
    };

    const resetPostLoginCookie = () => {
        if (typeof window !== 'undefined') {
            cookieUtils.clearPostLoginLoadingFlag();
            setPostLoginStatus('Post-login cookie cleared - will show loading on next login');
        }
    };

    const resetAuthGuardCookie = () => {
        if (typeof window !== 'undefined') {
            cookieUtils.clearAuthGuardFlag();
            setAuthGuardStatus('Auth guard cookie cleared - will show guard on next check');
        }
    };

    const skipPostLoginLoading = () => {
        if (typeof window !== 'undefined') {
            cookieUtils.markPostLoginLoadingShown();
            setPostLoginStatus('Post-login cookie set - will skip loading for 1 hour');
        }
    };

    const skipAuthGuard = () => {
        if (typeof window !== 'undefined') {
            cookieUtils.markAuthGuardShown();
            setAuthGuardStatus('Auth guard cookie set - will skip guard for 30 minutes');
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
            <h3 className="font-semibold text-sm">Authentication Flow Test Controls</h3>

            {/* Post-Login Controls */}
            <div className="space-y-2">
                <h4 className="font-medium text-xs text-muted-foreground">Post-Login Loading (1 hour)</h4>
                <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={checkPostLoginStatus}>
                        Check Status
                    </Button>
                    <Button size="sm" variant="outline" onClick={resetPostLoginCookie}>
                        Reset (Show Loading)
                    </Button>
                    <Button size="sm" variant="outline" onClick={skipPostLoginLoading}>
                        Skip Loading
                    </Button>
                </div>
                {postLoginStatus && (
                    <p className="text-xs text-muted-foreground">{postLoginStatus}</p>
                )}
            </div>

            {/* Auth Guard Controls */}
            <div className="space-y-2">
                <h4 className="font-medium text-xs text-muted-foreground">Auth Guard Loading (30 minutes)</h4>
                <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={checkAuthGuardStatus}>
                        Check Status
                    </Button>
                    <Button size="sm" variant="outline" onClick={resetAuthGuardCookie}>
                        Reset (Show Guard)
                    </Button>
                    <Button size="sm" variant="outline" onClick={skipAuthGuard}>
                        Skip Guard
                    </Button>
                </div>
                {authGuardStatus && (
                    <p className="text-xs text-muted-foreground">{authGuardStatus}</p>
                )}
            </div>
        </div>
    );
}
