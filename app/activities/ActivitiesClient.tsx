'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Shield, Users, AlertTriangle, CheckCheck, Clock, ChevronDown, Filter, Settings } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import { useDynamicTitle } from '@/hooks/use-dynamic-title';
import { useIsTablet } from "@/components/ui/use-tablet";
import { RightSidebar } from "@/components/aside/right-sidebar";
import Link from 'next/link';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    profile_image: string | null;
    bio: string | null;
    points: number;
    level: number;
    streak_count: number;
    last_activity_date: string | null;
    created_at: string;
    updated_at: string;
}

interface ActivityData {
    id: number;
    type: string;
    title: string;
    message: string;
    data?: any;
    status: 'pending' | 'sent' | 'failed' | 'read';
    sent_at?: string;
    read_at?: string;
    created_at: string;
}

interface ActivitiesClientProps {
    serverUser?: User;
}

export default function ActivitiesClient({ serverUser }: ActivitiesClientProps) {
    const [activities, setActivities] = useState<ActivityData[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread' | 'login_alert' | 'welcome'>('unread');
    const [limit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const { setServerUser, isAuthenticated, authenticatedAction } = useAuth();
    const isDev = process.env.NODE_ENV === 'development';
    const isTablet = useIsTablet();

    // Use dynamic title for activities page with unread count
    const { unreadCount } = useDynamicTitle({
        baseTitle: 'Activities - BitRoot'
    });

    // Set server user in auth context if provided
    useEffect(() => {
        if (serverUser) {
            setServerUser(serverUser);
        }
    }, [serverUser, setServerUser]);

    // Fetch activities (notifications)
    const fetchActivities = async (reset = false) => {
        try {
            await authenticatedAction(async () => {
                setLoading(true);
                const currentOffset = reset ? 0 : offset;
                const response = await apiClient.getNotifications(limit, currentOffset);

                if (response.success) {
                    const newActivities = response.data.notifications;

                    if (reset) {
                        setActivities(newActivities);
                    } else {
                        setActivities(prev => [...prev, ...newActivities]);
                    }

                    setHasMore(newActivities.length === limit);
                    setOffset(currentOffset + newActivities.length);
                }
            });
        } catch (error) {
            if (isDev) console.error('Failed to fetch activities:', error);
            // Don't show mock activities - let it fail gracefully
            setActivities([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    // Mark activity as read
    const markAsRead = async (activityId: number) => {
        try {
            await authenticatedAction(async () => {
                await apiClient.markNotificationAsRead(activityId);
                setActivities(prev =>
                    prev.map(activity =>
                        activity.id === activityId
                            ? { ...activity, status: 'read', read_at: new Date().toISOString() }
                            : activity
                    )
                );
            });
        } catch (error) {
            if (isDev) console.error('Failed to mark activity as read:', error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await authenticatedAction(async () => {
                await apiClient.markAllNotificationsAsRead();
                setActivities(prev =>
                    prev.map(activity => ({
                        ...activity,
                        status: 'read',
                        read_at: new Date().toISOString()
                    }))
                );
            });
        } catch (error) {
            if (isDev) console.error('Failed to mark all activities as read:', error);
        }
    };

    // Get activity icon and color based on type
    const getActivityConfig = (type: string) => {
        switch (type) {
            case 'login_alert':
                return {
                    icon: Shield,
                    color: 'text-orange-500',
                    label: 'Security Alert'
                };
            case 'welcome':
                return {
                    icon: Users,
                    color: 'text-green-500',
                    label: 'Welcome'
                };
            case 'security_alert':
                return {
                    icon: AlertTriangle,
                    color: 'text-red-500',
                    label: 'Security'
                };
            default:
                return {
                    icon: Bell,
                    color: 'text-blue-500',
                    label: 'General'
                };
        }
    };

    // Format time
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const currentYear = now.getFullYear();
        const createdYear = date.getFullYear();

        const day = date.getDate();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[date.getMonth()];

        if (currentYear === createdYear) {
            return `${day}, ${month}`;
        } else {
            const yearShort = createdYear.toString().slice(-2);
            return `${day}, ${month} '${yearShort}`;
        }
    };

    // Filter activities and ensure unique IDs
    const filteredActivities = activities
        .filter((activity, index, self) =>
            // Remove duplicates based on ID
            index === self.findIndex(n => n.id === activity.id)
        )
        .filter(activity => {
            if (filter === 'all') return true;
            if (filter === 'unread') return activity.status !== 'read';
            return activity.type === filter;
        });

    // Load more activities
    const loadMore = () => {
        if (!loading && hasMore) {
            fetchActivities(false);
        }
    };

    useEffect(() => {
        if (isDev) {
            console.log('🔍 ActivitiesClient useEffect triggered', {
                isAuthenticated,
                hasServerUser: !!serverUser,
                serverUserName: serverUser?.name
            });
        }

        // Only fetch activities if serverUser is available
        if (serverUser) {
            if (isDev) console.log('✅ Server user available, starting fetch timer...');
            // Add a small delay to ensure token is available in localStorage
            const timer = setTimeout(() => {
                fetchActivities(true);
            }, 100);

            return () => clearTimeout(timer);
        } else {
            if (isDev) console.log('❌ No server user, setting loading to false');
            setLoading(false);
            setActivities([]);
            setHasMore(false);
        }
    }, [serverUser]);

    // Fallback: If still loading after 5 seconds, stop loading
    useEffect(() => {
        const fallbackTimer = setTimeout(() => {
            if (loading) {
                if (isDev) console.log('⚠️ Fallback: Still loading after 5 seconds, stopping...');
                setLoading(false);
            }
        }, 5000);

        return () => clearTimeout(fallbackTimer);
    }, [loading]);

    const localUnreadCount = activities.filter(n => n.status !== 'read').length;

    // Skeleton loader component
    const ActivitySkeleton = () => (
        <div className="bg-card rounded-lg shadow-sm border border-border p-4">
            <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                        <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                        <div className="h-3 bg-muted rounded animate-pulse w-16"></div>
                    </div>
                    <div className="h-3 bg-muted rounded animate-pulse w-full"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen">
            <div className='flex'>
                <div className="max-w-7xl flex-1 px-4 py-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">Recent Activities</h1>
                                    <p className="text-muted-foreground">
                                        {localUnreadCount > 0 ? `${localUnreadCount} unread activities` : 'All caught up!'}
                                    </p>
                                </div>
                            </div>
                            <div className='space-x-3 flex items-center'>
                                {localUnreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="p-2 bg-muted text-sm text-primary-foreground rounded-lg hover:bg-muted/90 transition-colors flex items-center gap-0.5"
                                    >
                                        <CheckCheck className="size-4 text-foreground" />
                                        Mark All Read
                                    </button>
                                )}
                                <Link href="/settings/notifications" className="text-sm text-muted-foreground hover:underline">
                                    <Settings className="size-6 inline-block" />
                                </Link>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground mr-2">Filter:</span>
                            {[
                                { key: 'all', label: 'All' },
                                { key: 'unread', label: 'Unread' },
                                { key: 'login_alert', label: 'Login Alerts' },
                                { key: 'welcome', label: 'Welcome' },
                            ].map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key as any)}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${filter === key
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-primary-foreground hover:bg-muted/90 transition-colors'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Activities List */}
                    <div className="max-w-4xl mx-auto space-y-2">
                        {loading && activities.length === 0 ? (
                            // Initial loading skeletons
                            <>
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <ActivitySkeleton key={index} />
                                ))}
                            </>
                        ) : filteredActivities.length === 0 ? (
                            <div className="bg-card rounded-lg shadow-sm border border-border p-8 text-center">
                                <Bell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-foreground mb-2">No activities found</h3>
                                <p className="text-muted-foreground">
                                    {filter === 'all'
                                        ? "You don't have any activities yet."
                                        : `No ${filter.replace('_', ' ')} activities found.`
                                    }
                                </p>
                            </div>
                        ) : (
                            <>
                                {filteredActivities.map((activity) => {
                                    const config = getActivityConfig(activity.type);
                                    const IconComponent = config.icon;

                                    return (
                                        <div
                                            key={activity.id}
                                            className={`bg-card rounded-lg shadow-sm border transition-all hover:shadow-md ${activity.status !== 'read'
                                                ? 'border-primary/30 bg-primary/5'
                                                : 'border-border'
                                                }`}
                                        >
                                            <div className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-3 rounded-lg bg-muted flex-shrink-0`}>
                                                        <IconComponent className={`w-5 h-5 ${config.color}`} />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="text-lg font-medium text-foreground">
                                                                    {activity.title}
                                                                </h3>
                                                                <span className={`px-2 py-1 text-xs rounded-full bg-muted ${config.color}`}>
                                                                    {config.label}
                                                                </span>
                                                                {activity.status !== 'read' && (
                                                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm text-muted-foreground">
                                                                    {formatTime(activity.created_at)}
                                                                </span>
                                                                {activity.status === 'read' && (
                                                                    <CheckCheck className="w-4 h-4 text-green-500" />
                                                                )}
                                                            </div>
                                                        </div>

                                                        <p className={`text-xs leading-relaxed ${activity.status !== 'read' ? 'text-foreground/80' : 'text-muted-foreground/70'}`}>
                                                            {activity.message}
                                                        </p>

                                                        {/* Minimal session details for login alerts */}
                                                        {activity.type === 'login_alert' && activity.data && (
                                                            <div className="mt-2">
                                                                <p className="text-xs text-muted-foreground">
                                                                    {activity.data.device_info?.device_type || 'Unknown device'} • {activity.data.device_info?.browser || 'Unknown browser'}
                                                                    {activity.data.location && ` • ${activity.data.location}`}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {activity.status !== 'read' && (
                                                            <div className="mt-2">
                                                                <button
                                                                    onClick={() => markAsRead(activity.id)}
                                                                    className="text-xs text-primary hover:text-primary/80 font-medium"
                                                                >
                                                                    Mark as read
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Loading skeletons for pagination */}
                                {loading && activities.length > 0 && (
                                    <>
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <ActivitySkeleton key={`skeleton-${index}`} />
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Load More / All Caught Up */}
                    {!loading && filteredActivities.length > 0 && (
                        <div className="text-center mt-8">
                            {hasMore ? (
                                <button
                                    onClick={loadMore}
                                    className="px-6 py-3 bg-card border border-border rounded-lg text-foreground hover:bg-secondary transition-colors"
                                >
                                    <ChevronDown className="w-4 h-4 inline mr-2" />
                                    Load More
                                </button>
                            ) : (
                                <div className="py-8">
                                    <CheckCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                    <p className="text-muted-foreground font-medium">You're all caught up!</p>
                                    <p className="text-sm text-muted-foreground/80 mt-1">No more activities to load</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}