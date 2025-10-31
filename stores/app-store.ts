'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Non-sensitive user preferences and UI state for Zustand
interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    notificationSound: boolean;
    compactView: boolean;
}

interface UIState {
    sidebarCollapsed: boolean;
    activeTab: string;
    lastVisitedPage: string;
    searchHistory: string[];
    recentlyViewed: string[];
}

interface AppState {
    // User preferences (non-sensitive only)
    preferences: UserPreferences;

    // UI state
    ui: UIState;

    // Online status
    isOnline: boolean;

    // Actions
    setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
    setUIState: <K extends keyof UIState>(key: K, value: UIState[K]) => void;
    setOnlineStatus: (status: boolean) => void;
    addToSearchHistory: (query: string) => void;
    addToRecentlyViewed: (item: string) => void;
    clearSearchHistory: () => void;
    clearRecentlyViewed: () => void;
    reset: () => void;
}

const defaultPreferences: UserPreferences = {
    theme: 'system',
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notificationSound: true,
    compactView: false,
};

const defaultUI: UIState = {
    sidebarCollapsed: false,
    activeTab: 'home',
    lastVisitedPage: '/home',
    searchHistory: [],
    recentlyViewed: [],
};

// Zustand store for ephemeral app state only (no authentication data)
export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            preferences: defaultPreferences,
            ui: defaultUI,
            isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,

            setPreference: (key, value) =>
                set((state) => ({
                    preferences: { ...state.preferences, [key]: value },
                })),

            setUIState: (key, value) =>
                set((state) => ({
                    ui: { ...state.ui, [key]: value },
                })),

            setOnlineStatus: (status) => set({ isOnline: status }),

            addToSearchHistory: (query) =>
                set((state) => {
                    const history = state.ui.searchHistory;
                    const newHistory = [query, ...history.filter(item => item !== query)].slice(0, 10);
                    return {
                        ui: { ...state.ui, searchHistory: newHistory },
                    };
                }),

            addToRecentlyViewed: (item) =>
                set((state) => {
                    const viewed = state.ui.recentlyViewed;
                    const newViewed = [item, ...viewed.filter(i => i !== item)].slice(0, 20);
                    return {
                        ui: { ...state.ui, recentlyViewed: newViewed },
                    };
                }),

            clearSearchHistory: () =>
                set((state) => ({
                    ui: { ...state.ui, searchHistory: [] },
                })),

            clearRecentlyViewed: () =>
                set((state) => ({
                    ui: { ...state.ui, recentlyViewed: [] },
                })),

            reset: () =>
                set({
                    preferences: defaultPreferences,
                    ui: defaultUI,
                    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
                }),
        }),
        {
            name: 'bitroot-app-state',
            // Only persist preferences and some UI state, not sensitive data
            partialize: (state) => ({
                preferences: state.preferences,
                ui: {
                    sidebarCollapsed: state.ui.sidebarCollapsed,
                    compactView: state.preferences.compactView,
                    // Don't persist search history or recently viewed for privacy
                },
            }),
        }
    )
);

// Hook for theme preference specifically
export const useTheme = () => {
    const theme = useAppStore((state) => state.preferences.theme);
    const setTheme = useAppStore((state) => state.setPreference);

    return {
        theme,
        setTheme: (newTheme: UserPreferences['theme']) => setTheme('theme', newTheme),
    };
};

// Hook for sidebar state
export const useSidebar = () => {
    const collapsed = useAppStore((state) => state.ui.sidebarCollapsed);
    const setCollapsed = useAppStore((state) => state.setUIState);

    return {
        collapsed,
        toggle: () => setCollapsed('sidebarCollapsed', !collapsed),
        setCollapsed: (value: boolean) => setCollapsed('sidebarCollapsed', value),
    };
};

// Hook for online status
export const useOnlineStatus = () => {
    const isOnline = useAppStore((state) => state.isOnline);
    const setOnlineStatus = useAppStore((state) => state.setOnlineStatus);

    return { isOnline, setOnlineStatus };
};