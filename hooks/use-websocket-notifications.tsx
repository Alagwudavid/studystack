'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface WebSocketNotification {
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

interface UseWebSocketNotificationsReturn {
    notifications: WebSocketNotification[];
    unreadCount: number;
    markAsRead: (notificationId: number) => void;
    markAllAsRead: () => void;
    isConnected: boolean;
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
    reconnect: () => void;
}

// Generate a notification icon using canvas (optimized for performance)
const generateNotificationIcon = (): string => {
    // Cache the icon to prevent regeneration
    if (typeof window !== 'undefined' && (window as any).notificationIconCache) {
        return (window as any).notificationIconCache;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    if (!ctx) return '';

    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, 64, 64);
    gradient.addColorStop(0, '#3B82F6'); // Blue
    gradient.addColorStop(1, '#1D4ED8'); // Darker blue

    // Draw circle background
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, 2 * Math.PI);
    ctx.fill();

    // Draw bell icon
    ctx.fillStyle = '#3B82F6';

    // Position circle in bottom right
    const circleX = 50;
    const circleY = 50;
    const circleRadius = 10;

    // Draw blue circle without outline
    ctx.beginPath();
    ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw bell icon (keep original bell)
    ctx.fillStyle = 'white';

    // Bell body
    ctx.beginPath();
    ctx.moveTo(20, 25);
    ctx.quadraticCurveTo(20, 20, 25, 20);
    ctx.lineTo(39, 20);
    ctx.quadraticCurveTo(44, 20, 44, 25);
    ctx.lineTo(44, 35);
    ctx.quadraticCurveTo(44, 40, 39, 40);
    ctx.lineTo(25, 40);
    ctx.quadraticCurveTo(20, 40, 20, 35);
    ctx.closePath();
    ctx.fill();

    // Bell clapper
    ctx.beginPath();
    ctx.arc(32, 37, 2, 0, 2 * Math.PI);
    ctx.fill();

    const dataUrl = canvas.toDataURL();

    // Cache the icon for future use
    if (typeof window !== 'undefined') {
        (window as any).notificationIconCache = dataUrl;
    }

    return dataUrl;
};

export function useWebSocketNotifications(): UseWebSocketNotificationsReturn {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<WebSocketNotification[]>([]);

    // Initialize unread count from localStorage (will be updated when user is available)
    const [unreadCount, setUnreadCount] = useState(0);

    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
    const [hasError, setHasError] = useState(false);

    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const maxReconnectAttempts = 3;
    const reconnectDelay = 5000; // 5 seconds
    const isDev = process.env.NODE_ENV === 'development';
    const isClientSide = typeof window !== 'undefined';

    // Function to update unread count and sync with localStorage
    const updateUnreadCount = (newCount: number) => {
        setUnreadCount(newCount);
        if (typeof window !== 'undefined' && user) {
            localStorage.setItem(`notification_unread_count_${user.id}`, newCount.toString());
        }
    };

    // Effect to load notification count from localStorage when user changes
    useEffect(() => {
        if (isClientSide && isAuthenticated && user) {
            const saved = localStorage.getItem(`notification_unread_count_${user.id}`);
            if (saved) {
                const savedCount = parseInt(saved, 10) || 0;
                setUnreadCount(savedCount);
            }
        } else if (!isAuthenticated) {
            setUnreadCount(0);
            // Clean up localStorage when user logs out
            if (isClientSide) {
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('notification_unread_count_')) {
                        localStorage.removeItem(key);
                    }
                });
            }
        }
    }, [isAuthenticated, user, isClientSide]);

    const connect = useCallback(async () => {
        if (!isClientSide || !isAuthenticated || !user || hasError) {
            setConnectionStatus('disconnected');
            return;
        }

        // Get token from multiple sources with comprehensive fallback
        const getAuthToken = () => {
            if (typeof window === 'undefined') return null;

            // Check localStorage first
            let token = localStorage.getItem('auth_token');
            if (token) return token;

            // Check sessionStorage
            token = sessionStorage.getItem('auth_token');
            if (token) return token;

            // Check cookies
            const getCookie = (name: string) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) {
                    const cookieValue = parts.pop()?.split(';').shift();
                    return cookieValue || null;
                }
                return null;
            };

            // Check for client_auth_token first (your app's main token)
            token = getCookie('client_auth_token');
            if (token) return token;

            // Check other cookie locations
            token = getCookie('auth_token') || getCookie('token') || null;
            if (token) return token;

            // Check if user object has token
            if (user && (user as any).token) {
                return (user as any).token;
            }

            // Check for NextAuth session token
            token = getCookie('next-auth.session-token') || getCookie('__Secure-next-auth.session-token') || null;
            if (token) return token;

            return null;
        };

        const token = getAuthToken();
        if (!token) {
            if (isDev) console.warn('⚠️ No auth token found for WebSocket connection');
            setConnectionStatus('disconnected');
            setHasError(true);
            return;
        }

        try {
            // Close existing connection properly
            if (socketRef.current) {
                socketRef.current.onclose = null;
                socketRef.current.onerror = null;
                socketRef.current.close(1000, 'Reconnecting');
                socketRef.current = null;
            }

            setConnectionStatus('connecting');
            setHasError(false);

            // Use WebSocket protocol based on current page protocol
            const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            // Use environment variable or fallback to localhost
            const wsHost = process.env.NEXT_PUBLIC_WS_HOST || 'localhost:8081';

            // Properly encode the token for URL
            const encodedToken = encodeURIComponent(token);
            const wsUrl = `${wsProtocol}//${wsHost}/notifications?token=${encodedToken}&user_id=${user.id}`;

            // Log connection attempt
            if (isDev) {
                console.log('🔌 Connecting to WebSocket:', `${wsProtocol}//${wsHost}/notifications`);
            }

            const ws = new WebSocket(wsUrl);
            socketRef.current = ws;

            // Set connection timeout
            const connectionTimeout = setTimeout(() => {
                if (ws.readyState === WebSocket.CONNECTING) {
                    ws.close();
                    setConnectionStatus('error');
                    setHasError(true);
                }
            }, 10000);

            ws.onopen = () => {
                clearTimeout(connectionTimeout);
                if (isDev) {
                    console.log('✅ WebSocket connected');
                } else {
                    console.log('🔌 WebSocket connection established for user:', user.id);
                }
                setConnectionStatus('connected');
                setHasError(false);
                reconnectAttemptsRef.current = 0;

                // When reconnecting, the server will send initial_data which will sync the count
                // This ensures localStorage and server are in sync after any disconnection
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    switch (data.type) {
                        case 'initial_data':
                            setNotifications(data.notifications || []);
                            updateUnreadCount(data.unread_count || 0);
                            break;

                        case 'new_notification':
                            setNotifications(prev => [data.notification, ...prev]);
                            setUnreadCount(prev => {
                                const newCount = prev + 1;
                                if (typeof window !== 'undefined' && user) {
                                    localStorage.setItem(`notification_unread_count_${user.id}`, newCount.toString());
                                }
                                return newCount;
                            });

                            // Show browser notification if permission granted (throttled)
                            if (Notification.permission === 'granted') {
                                // Use requestIdleCallback to defer notification creation
                                if (window.requestIdleCallback) {
                                    window.requestIdleCallback(() => {
                                        new Notification(data.notification.title, {
                                            body: data.notification.message,
                                            icon: generateNotificationIcon()
                                        });
                                    });
                                } else {
                                    // Fallback for browsers without requestIdleCallback
                                    setTimeout(() => {
                                        new Notification(data.notification.title, {
                                            body: data.notification.message,
                                            icon: generateNotificationIcon()
                                        });
                                    }, 0);
                                }
                            }
                            break;

                        case 'notification_read':
                            setNotifications(prev =>
                                prev.map(n => n.id === data.notificationId
                                    ? { ...n, status: 'read', read_at: data.read_at }
                                    : n
                                )
                            );
                            setUnreadCount(prev => {
                                const newCount = Math.max(0, prev - 1);
                                if (typeof window !== 'undefined' && user) {
                                    localStorage.setItem(`notification_unread_count_${user.id}`, newCount.toString());
                                }
                                return newCount;
                            });
                            break;

                        case 'notifications_bulk_read':
                            setNotifications(prev =>
                                prev.map(n => ({ ...n, status: 'read', read_at: data.read_at }))
                            );
                            updateUnreadCount(0);
                            break;

                        case 'error':
                            if (isDev) console.error('❌ WebSocket error:', data.message);
                            break;

                        default:
                            if (isDev) console.log('❓ Unknown WebSocket message type:', data.type);
                    }
                } catch (error) {
                    if (isDev) console.error('❌ Error parsing WebSocket message:', error);
                }
            };

            ws.onclose = (event) => {
                clearTimeout(connectionTimeout);
                if (isDev) {
                    console.log('🔌 WebSocket disconnected:', event.code, event.reason);
                } else {
                    console.log('🔌 WebSocket disconnected for user:', user.id, 'Code:', event.code);
                }
                setConnectionStatus('disconnected');
                socketRef.current = null;

                // Only attempt to reconnect if:
                // 1. Not a manual close (code 1000)
                // 2. User is still authenticated
                // 3. Haven't exceeded max attempts
                // 4. No permanent error state
                if (event.code !== 1000 &&
                    isAuthenticated &&
                    reconnectAttemptsRef.current < maxReconnectAttempts &&
                    !hasError) {

                    reconnectAttemptsRef.current++;
                    if (isDev) console.log(`🔄 Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);

                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, reconnectDelay * Math.min(reconnectAttemptsRef.current, 3));
                } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
                    setHasError(true);
                    if (isDev) console.warn('⚠️ Max reconnection attempts reached');
                }
            };

            ws.onerror = (error) => {
                clearTimeout(connectionTimeout);
                if (isDev) {
                    console.error('❌ WebSocket error:', error);
                } else {
                    console.error('❌ WebSocket error for user:', user.id);
                }
                setConnectionStatus('error');
                setHasError(true);
            };

        } catch (error) {
            if (isDev) console.error('❌ Error creating WebSocket connection:', error);
            setConnectionStatus('error');
            setHasError(true);
        }
    }, [isAuthenticated, user, isDev, hasError, isClientSide]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (socketRef.current) {
            socketRef.current.close(1000, 'Manual disconnect');
            socketRef.current = null;
        }

        setConnectionStatus('disconnected');
        reconnectAttemptsRef.current = 0;
    }, []);

    const markAsRead = useCallback((notificationId: number) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            if (isDev) console.log('📤 Sending mark_read for notification:', notificationId);
            socketRef.current.send(JSON.stringify({
                type: 'mark_read',
                notificationId
            }));
        } else {
            if (isDev) console.warn('⚠️ WebSocket not connected, cannot mark notification as read');
        }
    }, [isDev]);

    const markAllAsRead = useCallback(() => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            if (isDev) console.log('📤 Sending mark_all_read');
            socketRef.current.send(JSON.stringify({
                type: 'mark_all_read'
            }));
        } else {
            if (isDev) console.warn('⚠️ WebSocket not connected, cannot mark all notifications as read');
        }
    }, [isDev]);

    const reconnect = useCallback(() => {
        disconnect();
        reconnectAttemptsRef.current = 0;
        setTimeout(connect, 1000);
    }, [connect, disconnect]);

    // Effect to handle connection
    useEffect(() => {
        if (!isClientSide) return;

        if (isAuthenticated && user && !hasError) {
            // Add delay to prevent rapid reconnections
            const connectTimer = setTimeout(() => {
                connect();
            }, isDev ? 1000 : 500);

            return () => {
                clearTimeout(connectTimer);
                disconnect();
            };
        } else {
            disconnect();
        }
    }, [isAuthenticated, user, connect, disconnect, hasError, isClientSide]);

    // Effect to load/clear notification count based on authentication
    useEffect(() => {
        if (!isClientSide) return;

        if (isAuthenticated && user) {
            // Load saved count for this user (you might want to make this user-specific)
            const saved = localStorage.getItem(`notification_unread_count_${user.id}`);
            if (saved) {
                const savedCount = parseInt(saved, 10) || 0;
                setUnreadCount(savedCount);
            }
        } else {
            // Clear count when not authenticated
            updateUnreadCount(0);
        }
    }, [isAuthenticated, user, isClientSide]);    // Request notification permission on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    if (isDev) console.log('🔔 Notification permission:', permission);
                });
            }
        }
    }, []);

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        isConnected: connectionStatus === 'connected',
        connectionStatus,
        reconnect
    };
}
