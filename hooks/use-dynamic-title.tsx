'use client';

import { useEffect, useState } from 'react';
import { useWebSocketContext } from '@/contexts/WebSocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDynamicFavicon } from './use-dynamic-favicon';

interface UseDynamicTitleOptions {
    baseTitle?: string;
    prefix?: string;
    suffix?: string;
    separator?: string;
}

export function useDynamicTitle(options: UseDynamicTitleOptions = {}) {
    const {
        baseTitle = 'For you | Home - Bitroot',
        prefix = '',
        suffix = '',
        separator = ' • '
    } = options;

    const { isAuthenticated } = useAuth();
    const [fallbackUnreadCount, setFallbackUnreadCount] = useState(0);
    const [hasWebSocketError, setHasWebSocketError] = useState(false);

    // Use the WebSocket context instead of directly calling the hook
    const websocketData = useWebSocketContext();

    // Handle WebSocket errors gracefully
    useEffect(() => {
        if (!isAuthenticated) {
            setHasWebSocketError(false);
            setFallbackUnreadCount(0);
        }
    }, [isAuthenticated]);

    const unreadCount = isAuthenticated && !hasWebSocketError ? websocketData.unreadCount : fallbackUnreadCount;

    // Use dynamic favicon hook
    const { resetFavicon } = useDynamicFavicon(unreadCount);

    useEffect(() => {
        let title = baseTitle;

        if (isAuthenticated && unreadCount > 0) {
            title = `(${unreadCount}) ${baseTitle}`;
        } else if (prefix || suffix) {
            title = `${prefix}${baseTitle}${suffix}`;
        }

        document.title = title;

        // Cleanup function to restore original title and favicon when component unmounts
        return () => {
            document.title = baseTitle;
            resetFavicon();
        };
    }, [unreadCount, baseTitle, prefix, suffix, isAuthenticated, resetFavicon]);

    return { unreadCount };
}
