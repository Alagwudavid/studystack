import { useState, useEffect, useCallback } from 'react';
import { sessionManager, SessionData, SessionStatistics } from '../lib/session-manager';

export function useSession() {
    const [isOnline, setIsOnline] = useState(false);
    const [activeSessions, setActiveSessions] = useState<SessionData[]>([]);
    const [sessionStatistics, setSessionStatistics] = useState<SessionStatistics | null>(null);
    const [currentSession, setCurrentSession] = useState<SessionData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Start session tracking
    const startTracking = useCallback(() => {
        sessionManager.startTracking();
        setIsOnline(true);
    }, []);

    // Stop session tracking
    const stopTracking = useCallback(() => {
        sessionManager.stopTracking();
        setIsOnline(false);
    }, []);

    // Fetch active sessions
    const fetchActiveSessions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const sessions = await sessionManager.getActiveSessions();
            setActiveSessions(sessions);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch active sessions');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch session statistics
    const fetchSessionStatistics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const stats = await sessionManager.getSessionStatistics();
            setSessionStatistics(stats);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch session statistics');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch current session
    const fetchCurrentSession = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const session = await sessionManager.getCurrentSession();
            setCurrentSession(session);
        } catch (err) {
            // Only set error if it's not a "no session found" error
            if (err instanceof Error && !err.message.includes('No active session found')) {
                setError(err.message);
            }
            setCurrentSession(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Terminate a session
    const terminateSession = useCallback(async (sessionId: number) => {
        setError(null);
        try {
            await sessionManager.terminateSession(sessionId);
            // Refresh sessions list
            await fetchActiveSessions();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to terminate session');
        }
    }, [fetchActiveSessions]);

    // Terminate all other sessions
    const terminateOtherSessions = useCallback(async () => {
        setError(null);
        try {
            const terminatedCount = await sessionManager.terminateOtherSessions();
            // Refresh sessions list
            await fetchActiveSessions();
            return terminatedCount;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to terminate other sessions');
            return 0;
        }
    }, [fetchActiveSessions]);

    // Go online
    const goOnline = useCallback(async () => {
        setError(null);
        try {
            await sessionManager.goOnline();
            setIsOnline(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to go online');
        }
    }, []);

    // Go away
    const goAway = useCallback(async () => {
        setError(null);
        try {
            await sessionManager.goAway();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to go away');
        }
    }, []);

    // Go offline
    const goOffline = useCallback(async () => {
        setError(null);
        try {
            await sessionManager.goOffline();
            setIsOnline(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to go offline');
        }
    }, []);

    // Initialize session tracking on mount
    useEffect(() => {
        // Session tracking will be started by AuthContext when user is authenticated
        // This hook just provides the interface to interact with sessions

        // Cleanup on unmount
        return () => {
            stopTracking();
        };
    }, [stopTracking]);

    return {
        // State
        isOnline,
        activeSessions,
        sessionStatistics,
        currentSession,
        loading,
        error,

        // Actions
        startTracking,
        stopTracking,
        fetchActiveSessions,
        fetchSessionStatistics,
        fetchCurrentSession,
        terminateSession,
        terminateOtherSessions,
        goOnline,
        goAway,
        goOffline,

        // Utility
        sessionManager,
    };
}
