'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from '../hooks/use-session';
import { useAuth } from '../contexts/AuthContext';
import { SessionData } from '../lib/session-manager';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { SessionConfirmDialog, SessionSuccessDialog } from './SessionConfirmDialog';
import { deviceDetectionUtils } from '../lib/device-detection-utils';
import { geolocationUtils } from '../lib/geolocation-utils';
import {
    Monitor,
    Smartphone,
    Tablet,
    Globe,
    Clock,
    Activity,
    LogOut,
    Shield,
    Users,
    BarChart3,
    MapPin,
} from 'lucide-react';

interface SessionManagerProps {
    className?: string;
}

export function SessionManager({ className }: SessionManagerProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const {
        isOnline,
        activeSessions,
        sessionStatistics,
        currentSession,
        loading,
        error,
        fetchActiveSessions,
        fetchSessionStatistics,
        fetchCurrentSession,
        terminateSession,
        terminateOtherSessions,
        startTracking,
    } = useSession();

    const [showStatistics, setShowStatistics] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: 'single' | 'multiple';
        sessionId?: number;
        sessionInfo?: any;
    }>({
        open: false,
        type: 'single',
    });
    const [successDialog, setSuccessDialog] = useState<{
        open: boolean;
        terminatedCount: number;
    }>({
        open: false,
        terminatedCount: 0,
    });
    const [deviceInfo, setDeviceInfo] = useState<any>(null);
    const [locationInfo, setLocationInfo] = useState<any>(null);
    const [locationLoading, setLocationLoading] = useState(false);

    useEffect(() => {
        // Only start session tracking and fetch data if user is authenticated
        // Also wait for the AuthContext to finish initializing to avoid race conditions
        if (isAuthenticated && !isLoading) {
            // Start session tracking
            startTracking();

            // Fetch session data
            fetchActiveSessions();
            fetchCurrentSession();
            fetchSessionStatistics();

            // Get device and location info
            const devInfo = deviceDetectionUtils.getDeviceInfo();
            setDeviceInfo(devInfo);

            // Try to get location info (with user permission)
            requestLocationAccess();
        }
    }, [isAuthenticated, isLoading, fetchActiveSessions, fetchCurrentSession, fetchSessionStatistics, startTracking]);

    const requestLocationAccess = async () => {
        if (locationInfo) return; // Already have location

        setLocationLoading(true);
        try {
            const location = await geolocationUtils.getBestLocation();
            setLocationInfo(location);
        } catch (error) {
            console.warn('Location detection failed:', error);
        } finally {
            setLocationLoading(false);
        }
    };

    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType.toLowerCase()) {
            case 'mobile':
                return <Smartphone className="h-4 w-4" />;
            case 'tablet':
                return <Tablet className="h-4 w-4" />;
            default:
                return <Monitor className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online':
                return 'bg-green-500';
            case 'away':
                return 'bg-yellow-500';
            case 'offline':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const formatLastActivity = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        if (diffMinutes < 1) {
            return 'Just now';
        } else if (diffMinutes < 60) {
            return `${diffMinutes}m ago`;
        } else if (diffMinutes < 1440) {
            const hours = Math.floor(diffMinutes / 60);
            return `${hours}h ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    const getEnhancedDeviceName = (session: SessionData) => {
        if (session.is_current && deviceInfo) {
            return deviceDetectionUtils.getDeviceDescription(deviceInfo);
        }
        return session.device_name || `${session.device_type} Device`;
    };

    const getLocationDisplay = (session: SessionData) => {
        if (session.is_current && locationInfo) {
            if (locationInfo.city && locationInfo.region) {
                return `${locationInfo.city}, ${locationInfo.region}`;
            }
            if (locationInfo.address) {
                return locationInfo.address.split(',').slice(0, 2).join(',').trim();
            }
        }
        return session.ip_address;
    };

    const handleTerminateSession = async (sessionId: number) => {
        const session = activeSessions.find(s => s.id === sessionId);
        if (!session) return;

        setConfirmDialog({
            open: true,
            type: 'single',
            sessionId,
            sessionInfo: {
                deviceName: getEnhancedDeviceName(session),
                browser: session.browser,
                operatingSystem: session.operating_system,
                location: getLocationDisplay(session),
                lastActivity: formatLastActivity(session.last_activity_at),
            },
        });
    };

    const handleTerminateOtherSessions = async () => {
        const otherSessionsCount = activeSessions.filter(s => !s.is_current).length;
        if (otherSessionsCount === 0) return;

        setConfirmDialog({
            open: true,
            type: 'multiple',
        });
    };

    const handleConfirmTermination = async () => {
        if (confirmDialog.type === 'single' && confirmDialog.sessionId) {
            await terminateSession(confirmDialog.sessionId);
        } else if (confirmDialog.type === 'multiple') {
            const count = await terminateOtherSessions();
            setSuccessDialog({
                open: true,
                terminatedCount: count,
            });
        }
    };

    if (isLoading) {
        return (
            <div className={`p-4 ${className}`}>
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-2">
                        <div className="h-16 bg-gray-200 rounded"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated && !isLoading) {
        return (
            <div className={`p-4 ${className}`}>
                <Card>
                    <CardContent className="text-center py-8">
                        <Shield className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium text-gray-600 dark:text-gray-400">Authentication Required</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            Please log in to view and manage your sessions
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading && activeSessions.length === 0) {
        return (
            <div className={`p-4 ${className}`}>
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-2">
                        <div className="h-16 bg-gray-200 rounded"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Current Session with Map */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Current Session
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {currentSession ? (
                        <div className="space-y-4">
                            {/* Device Info */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getDeviceIcon(currentSession.device_type)}
                                    <div>
                                        <div className="font-medium flex items-center gap-2">
                                            {getEnhancedDeviceName(currentSession)}
                                            <Badge variant="secondary" className="text-xs">
                                                Current
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-gray-600 flex items-center gap-4">
                                            <span>{currentSession.browser} on {currentSession.operating_system}</span>
                                            <span className="flex items-center gap-1">
                                                <div className={`w-2 h-2 rounded-full ${getStatusColor(currentSession.status)}`}></div>
                                                <span className="capitalize">{currentSession.status}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {formatLastActivity(currentSession.last_activity_at)}
                                    </div>
                                </div>
                            </div>

                            {/* Location Map */}
                            {locationInfo && (locationInfo.latitude && locationInfo.longitude) ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <MapPin className="h-4 w-4 text-green-600" />
                                        Current Location
                                    </div>
                                    <div className="relative bg-muted rounded-lg overflow-hidden" style={{ height: '200px' }}>
                                        <iframe
                                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${locationInfo.longitude - 0.01},${locationInfo.latitude - 0.01},${locationInfo.longitude + 0.01},${locationInfo.latitude + 0.01}&layer=mapnik&marker=${locationInfo.latitude},${locationInfo.longitude}`}
                                            width="100%"
                                            height="200"
                                            style={{ border: 0 }}
                                            allowFullScreen={false}
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Current Session Location"
                                        />
                                    </div>
                                    <div className="text-sm text-gray-600 flex items-center justify-between">
                                        <span className="flex items-center gap-1">
                                            <Globe className="h-3 w-3" />
                                            {getLocationDisplay(currentSession)}
                                        </span>
                                        {locationInfo.accuracy && (
                                            <span className="text-xs text-gray-500">
                                                ±{Math.round(locationInfo.accuracy)}m accuracy
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Globe className="h-4 w-4 text-gray-500" />
                                            Location Information
                                        </div>
                                        {!locationLoading && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={requestLocationAccess}
                                                className="text-xs"
                                            >
                                                <MapPin className="h-3 w-3 mr-1" />
                                                Enable Location
                                            </Button>
                                        )}
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg text-center text-sm text-gray-600">
                                        {locationLoading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                                                Getting your location...
                                            </div>
                                        ) : (
                                            <>
                                                <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                                <p>Location not available</p>
                                                <p className="text-xs mt-1">IP: {currentSession.ip_address}</p>
                                                <p className="text-xs mt-1 text-blue-600">Click "Enable Location" to show on map</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(isOnline ? 'online' : 'offline')}`}></div>
                            <span className="font-medium">
                                {isOnline ? 'Online' : 'Offline'}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Session Statistics */}
            {sessionStatistics && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Session Statistics
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowStatistics(!showStatistics)}
                            >
                                {showStatistics ? 'Hide' : 'Show'} Details
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    {showStatistics && (
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {sessionStatistics.total_sessions}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Sessions</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {sessionStatistics.active_sessions}
                                    </div>
                                    <div className="text-sm text-gray-600">Active Sessions</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {formatDuration(sessionStatistics.total_session_time)}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Time</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {formatDuration(sessionStatistics.average_session_time || 0)}
                                    </div>
                                    <div className="text-sm text-gray-600">Average Session</div>
                                </div>
                            </div>
                        </CardContent>
                    )}
                </Card>
            )}

            {/* Other Active Sessions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Other Sessions ({activeSessions.filter(s => !s.is_current).length})
                        </div>
                        {activeSessions.filter(s => !s.is_current).length > 0 && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleTerminateOtherSessions}
                            >
                                <Shield className="h-4 w-4 mr-2" />
                                Terminate All Others
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        {activeSessions.filter(session => !session.is_current).map((session) => (
                            <div
                                key={session.id}
                                className={`p-4 border rounded-lg hover:bg-muted/50 transition-colors ${session.status === 'offline' ? 'opacity-50' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {getDeviceIcon(session.device_type)}
                                        <div>
                                            <div className="font-medium">
                                                {getEnhancedDeviceName(session)}
                                            </div>
                                            <div className="text-sm text-gray-600 flex items-center gap-4">
                                                <span>{session.browser} on {session.operating_system}</span>
                                                <span className="flex items-center gap-1">
                                                    <Globe className="h-3 w-3" />
                                                    {getLocationDisplay(session)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${getStatusColor(session.status)}`}></div>
                                                <span className="text-sm font-medium capitalize">{session.status}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatLastActivity(session.last_activity_at)}
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleTerminateSession(session.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <LogOut className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {activeSessions.filter(s => !s.is_current).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p className="font-medium">No other active sessions</p>
                                <p className="text-sm mt-1">You're only signed in on this device</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <SessionConfirmDialog
                open={confirmDialog.open}
                onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
                onConfirm={handleConfirmTermination}
                type={confirmDialog.type}
                sessionInfo={confirmDialog.sessionInfo}
                otherSessionsCount={activeSessions.filter(s => !s.is_current).length}
            />

            {/* Success Dialog */}
            <SessionSuccessDialog
                open={successDialog.open}
                onOpenChange={(open) => setSuccessDialog(prev => ({ ...prev, open }))}
                terminatedCount={successDialog.terminatedCount}
            />
        </div>
    );
}
