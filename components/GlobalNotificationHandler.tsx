'use client';

import React, { useEffect, useRef } from 'react';
import { Bell, Shield, Users, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWebSocketContext } from '@/contexts/WebSocketContext';
import { toast } from 'sonner';

interface NotificationData {
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

export default function GlobalNotificationHandler() {
    const { isAuthenticated } = useAuth();
    const { notifications, markAsRead } = useWebSocketContext();

    const prevNotificationsRef = useRef<NotificationData[]>([]);
    const hasInitializedRef = useRef(false);

    // Track new notifications and show toast
    useEffect(() => {
        if (!isAuthenticated || !hasInitializedRef.current) {
            // Don't show toasts on initial load or when not authenticated
            // Set previous notifications to current to prevent showing old ones as new
            prevNotificationsRef.current = notifications;
            hasInitializedRef.current = true;
            return;
        }

        // Only show toasts for notifications that are truly new (not just from reconnection)
        const prevNotifications = prevNotificationsRef.current;
        const newNotifications = notifications.filter((notification: NotificationData) => {
            const isNew = !prevNotifications.some(prev => prev.id === notification.id);
            // Additional check: only show notifications created in the last 5 minutes as toasts
            // This prevents old unread notifications from showing as toasts when reconnecting
            const createdAt = new Date(notification.created_at);
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            const isRecent = createdAt > fiveMinutesAgo;

            return isNew && isRecent;
        });

        // Show toast for each truly new notification
        newNotifications.forEach((notification: NotificationData) => {
            const icon = getNotificationIcon(notification.type);

            toast(notification.title, {
                description: notification.message,
                icon: icon,
                duration: 5000,
                action: {
                    label: 'View',
                    onClick: () => {
                        // Mark as read when user clicks view
                        if (notification.status !== 'read') {
                            markAsRead(notification.id);
                        }
                    }
                },
                // Add custom styling based on notification type
                className: notification.type === 'security_alert' ? 'border-red-500' :
                    notification.type === 'welcome' ? 'border-green-500' :
                        'border-blue-500'
            });
        });

        prevNotificationsRef.current = notifications;
    }, [notifications, isAuthenticated, markAsRead]);

    // Get notification icon based on type
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'login_alert':
                return <Shield className="w-4 h-4 text-orange-500" />;
            case 'welcome':
                return <Users className="w-4 h-4 text-green-500" />;
            case 'security_alert':
                return <AlertTriangle className="w-4 h-4 text-red-500" />;
            default:
                return <Bell className="w-4 h-4 text-blue-500" />;
        }
    };

    // This component doesn't render anything visible - it only handles notifications
    return null;
}