'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useWebSocketNotifications } from '@/hooks/use-websocket-notifications';
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

interface WebSocketContextType {
    notifications: WebSocketNotification[];
    unreadCount: number;
    markAsRead: (notificationId: number) => void;
    markAllAsRead: () => void;
    isConnected: boolean;
    connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
    reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
    children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
    const { isAuthenticated } = useAuth();

    // Always call the hook but conditionally connect based on authentication
    const websocketData = useWebSocketNotifications();

    return (
        <WebSocketContext.Provider value={websocketData}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocketContext(): WebSocketContextType {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocketContext must be used within a WebSocketProvider');
    }
    return context;
}