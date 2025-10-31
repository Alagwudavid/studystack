import { apiClient } from './api-client';

export interface SessionData {
    id: number;
    device_type: string;
    device_name?: string;
    browser: string;
    operating_system: string;
    ip_address: string;
    status: 'online' | 'offline' | 'away';
    last_activity_at: string;
    logged_in_at: string;
    is_current: boolean;
}

export interface SessionStatistics {
    total_sessions: number;
    active_sessions: number;
    online_sessions: number;
    total_session_time: number;
    average_session_time: number;
    last_activity: string;
}

class SessionManager {
    private heartbeatInterval: NodeJS.Timeout | null = null;
    private activityTimeout: NodeJS.Timeout | null = null;
    private isOnline: boolean = false;
    private visibilityChangeHandler: (() => void) | null = null;
    private beforeUnloadHandler: (() => void) | null = null;

    /**
     * Start session tracking
     */
    async startTracking(): Promise<void> {
        if (typeof window === 'undefined') return;

        // Try to verify we have an active session before starting tracking
        // Authentication is handled via HttpOnly cookies, so we check by making a request
        try {
            await apiClient.getCurrentSession();
            console.debug('Active session found, starting tracking');
        } catch (error) {
            if (error instanceof Error &&
                (error.message.includes('No active session found') ||
                    error.message.includes('Authentication required'))) {
                console.debug('No active session found, skipping session tracking');
                return;
            }
            // For other errors, continue with tracking
            console.debug('Session check failed, but continuing with tracking:', error);
        }

        this.isOnline = true;
        this.startHeartbeat();
        this.setupActivityTracking();
        this.setupVisibilityTracking();
        this.setupBeforeUnloadTracking();
    }

    /**
     * Stop session tracking
     */
    stopTracking(): void {
        this.isOnline = false;
        this.stopHeartbeat();
        this.clearActivityTimeout();
        this.removeEventListeners();
    }

    /**
     * Start heartbeat to keep session alive
     */
    private startHeartbeat(): void {
        if (this.heartbeatInterval) return;

        // Send heartbeat every 30 seconds
        this.heartbeatInterval = setInterval(async () => {
            if (this.isOnline) {
                try {
                    await apiClient.heartbeat();
                } catch (error) {
                    // If authentication fails or no session found, stop tracking
                    if (error instanceof Error &&
                        (error.message.includes('Authentication required') ||
                            error.message.includes('No active session found'))) {
                        console.debug('Session heartbeat failed, stopping tracking:', error.message);
                        this.stopTracking();
                        return;
                    }
                    console.error('Heartbeat failed:', error);
                }
            }
        }, 30000);
    }

    /**
     * Stop heartbeat
     */
    private stopHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    /**
     * Setup activity tracking to detect user inactivity
     */
    private setupActivityTracking(): void {
        if (typeof window === 'undefined') return;

        const resetActivityTimeout = () => {
            this.clearActivityTimeout();

            // Mark user as away after 5 minutes of inactivity
            this.activityTimeout = setTimeout(async () => {
                if (this.isOnline) {
                    try {
                        await apiClient.updateSessionStatus('away');
                    } catch (error) {
                        // If authentication fails or no session found, stop tracking
                        if (error instanceof Error &&
                            (error.message.includes('Authentication required') ||
                                error.message.includes('No active session found'))) {
                            console.debug('Session status update failed, stopping tracking:', error.message);
                            this.stopTracking();
                            return;
                        }
                        console.error('Failed to update session status to away:', error);
                    }
                }
            }, 5 * 60 * 1000); // 5 minutes
        };

        // Track user activity
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        activityEvents.forEach(event => {
            document.addEventListener(event, resetActivityTimeout, { passive: true });
        });

        // Initial timeout
        resetActivityTimeout();
    }

    /**
     * Clear activity timeout
     */
    private clearActivityTimeout(): void {
        if (this.activityTimeout) {
            clearTimeout(this.activityTimeout);
            this.activityTimeout = null;
        }
    }

    /**
     * Setup visibility change tracking
     */
    private setupVisibilityTracking(): void {
        if (typeof window === 'undefined') return;

        this.visibilityChangeHandler = async () => {
            if (document.hidden) {
                // Tab/window is hidden
                try {
                    await apiClient.updateSessionStatus('away');
                } catch (error) {
                    // If authentication fails or no session found, stop tracking
                    if (error instanceof Error &&
                        (error.message.includes('Authentication required') ||
                            error.message.includes('No active session found'))) {
                        console.debug('Session status update failed, stopping tracking:', error.message);
                        this.stopTracking();
                        return;
                    }
                    console.debug('Session status update failed (going away):', error);
                }
            } else {
                // Tab/window is visible again
                try {
                    await apiClient.updateSessionStatus('online');
                    // Also send a heartbeat to ensure session is active
                    await apiClient.heartbeat();
                } catch (error) {
                    // If authentication fails or no session found, stop tracking
                    if (error instanceof Error &&
                        (error.message.includes('Authentication required') ||
                            error.message.includes('No active session found'))) {
                        console.debug('Session status update failed, stopping tracking:', error.message);
                        this.stopTracking();
                        return;
                    }
                    console.debug('Session status update failed (going online):', error);
                }
            }
        };

        document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    }

    /**
     * Setup before unload tracking
     */
    private setupBeforeUnloadTracking(): void {
        if (typeof window === 'undefined') return;

        this.beforeUnloadHandler = () => {
            // Use navigator.sendBeacon for reliable offline notification
            if (navigator.sendBeacon && this.isOnline) {
                const blob = new Blob([JSON.stringify({})], { type: 'application/json' });
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
                navigator.sendBeacon(`${apiUrl}/sessions/offline`, blob);
            }
        };

        window.addEventListener('beforeunload', this.beforeUnloadHandler);
        window.addEventListener('unload', this.beforeUnloadHandler);
    }

    /**
     * Remove event listeners
     */
    private removeEventListeners(): void {
        if (typeof window === 'undefined') return;

        if (this.visibilityChangeHandler) {
            document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
            this.visibilityChangeHandler = null;
        }

        if (this.beforeUnloadHandler) {
            window.removeEventListener('beforeunload', this.beforeUnloadHandler);
            window.removeEventListener('unload', this.beforeUnloadHandler);
            this.beforeUnloadHandler = null;
        }
    }

    /**
     * Get all active sessions
     */
    async getActiveSessions(): Promise<SessionData[]> {
        try {
            const response = await apiClient.getActiveSessions();
            return response.data.sessions;
        } catch (error) {
            console.error('Failed to fetch active sessions:', error);
            throw error;
        }
    }

    /**
     * Get session statistics
     */
    async getSessionStatistics(): Promise<SessionStatistics> {
        try {
            const response = await apiClient.getSessionStatistics();
            return response.data;
        } catch (error) {
            console.error('Failed to fetch session statistics:', error);
            throw error;
        }
    }

    /**
     * Get current session
     */
    async getCurrentSession(): Promise<SessionData> {
        try {
            const response = await apiClient.getCurrentSession();
            return response.data;
        } catch (error) {
            console.error('Failed to fetch current session:', error);
            throw error;
        }
    }

    /**
     * Terminate a specific session
     */
    async terminateSession(sessionId: number): Promise<void> {
        try {
            await apiClient.terminateSession(sessionId.toString());
        } catch (error) {
            console.error('Failed to terminate session:', error);
            throw error;
        }
    }

    /**
     * Terminate all other sessions except current
     */
    async terminateOtherSessions(): Promise<number> {
        try {
            const response = await apiClient.terminateOtherSessions();
            return response.terminated_count;
        } catch (error) {
            console.error('Failed to terminate other sessions:', error);
            throw error;
        }
    }

    /**
     * Mark user as online
     */
    async goOnline(): Promise<void> {
        this.isOnline = true;
        try {
            await apiClient.updateSessionStatus('online');
        } catch (error) {
            console.error('Failed to update session status to online:', error);
            throw error;
        }
    }

    /**
     * Mark user as away
     */
    async goAway(): Promise<void> {
        try {
            await apiClient.updateSessionStatus('away');
        } catch (error) {
            console.error('Failed to update session status to away:', error);
            throw error;
        }
    }

    /**
     * Mark user as offline and stop tracking
     */
    async goOffline(): Promise<void> {
        this.isOnline = false;
        this.stopTracking();

        try {
            await apiClient.goOffline();
        } catch (error) {
            console.error('Failed to mark session as offline:', error);
            // Don't throw error as user might be logging out
        }
    }

    /**
     * Check if user is currently online
     */
    getOnlineStatus(): boolean {
        return this.isOnline;
    }
}

export const sessionManager = new SessionManager();
