"use client";

import React, { createContext, useContext, ReactNode, useState } from 'react';
import type { User } from "@/types/user";

interface LayoutContextType {
    user: User | null;
    isAuthenticated: boolean;
    isDropdownSidebarOpen: boolean;
    setDropdownSidebarOpen: (open: boolean) => void;
    toggleDropdownSidebar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

interface LayoutProviderProps {
    children: ReactNode;
    user?: User | null;
}

export function LayoutProvider({ children, user = null }: LayoutProviderProps) {
    const [isDropdownSidebarOpen, setIsDropdownSidebarOpen] = useState(false);

    const setDropdownSidebarOpenState = (open: boolean) => {
        setIsDropdownSidebarOpen(open);
    };

    const toggleDropdownSidebar = () => {
        setIsDropdownSidebarOpen(!isDropdownSidebarOpen);
    };

    const contextValue: LayoutContextType = {
        user,
        isAuthenticated: !!user,
        isDropdownSidebarOpen,
        setDropdownSidebarOpen: setDropdownSidebarOpenState,
        toggleDropdownSidebar,
    };

    return (
        <LayoutContext.Provider value={contextValue}>
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayoutContext() {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error('useLayoutContext must be used within a LayoutProvider');
    }
    return context;
}
