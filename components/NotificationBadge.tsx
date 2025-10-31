'use client';

import React from 'react';
import { useWebSocketContext } from '@/contexts/WebSocketContext';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationBadgeProps {
    className?: string;
}

export default function NotificationBadge({ className = '' }: NotificationBadgeProps) {
    const { isAuthenticated } = useAuth();
    const { unreadCount } = useWebSocketContext();

    // Don't render if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    // Don't render if no unread notifications
    if (unreadCount === 0) {
        return null;
    }

    return (
        <span className={`inline-flex items-center justify-center p-1 text-xs font-semibold leading-none text-white bg-blue-500 rounded-full ${className}`}>
            {unreadCount > 99 ? '99+' : unreadCount}
        </span>
    );
}