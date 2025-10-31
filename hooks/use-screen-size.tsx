"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

// Breakpoint definitions
const BREAKPOINTS = {
    mobile: 768,    // below 768px = mobile
    tablet: 1024,   // 768px - 1023px = tablet  
    desktop: 1024,  // 1024px+ = desktop
    xl: 1280,       // 1280px+ = xl (for expanded sidebar)
    xxl: 1536,      // 1536px+ = xxl (for full sidebar)
} as const;

export interface ScreenSize {
    width: number;
    height: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isXl: boolean;
    isXxl: boolean;
    // Responsive states for sidebar logic
    showTopNav: boolean;           // Below md: show topnav
    showFloatingSidebar: boolean;  // Above md: show floating sidebar
    sidebarHasText: boolean;       // Above xl: sidebar with text
    sidebarIsCollapsed: boolean;   // Below xl: collapsed sidebar
    // sidebarWidth: object;          // Dynamic sidebar width class
    sidebarWidth: { width: string } | false;          // Dynamic sidebar width class
}

export function useScreenSize(): ScreenSize {
    // Always start with a consistent default to prevent hydration mismatch
    const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
    const [isHydrated, setIsHydrated] = useState(false);

    const calculateScreenSize = useCallback((width: number, height: number): ScreenSize => {
        const isMobile = width < BREAKPOINTS.mobile;
        const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.desktop;
        const isDesktop = width >= BREAKPOINTS.desktop;
        const isXl = width >= BREAKPOINTS.xl;
        const isXxl = width >= BREAKPOINTS.xxl;

        // Sidebar logic
        const sidebarIsCollapsed = width < BREAKPOINTS.xl;
        const sidebarHasText = width >= BREAKPOINTS.xl;
        // const sidebarWidth = width < BREAKPOINTS.xl ? { width: "4rem" } :
        //     width < BREAKPOINTS.xxl ? { width: "15rem" } : { width: "18rem" };
        const sidebarWidth = width < BREAKPOINTS.xl ? { width: "4rem" } :
            width < BREAKPOINTS.xxl && { width: "15rem" };

        return {
            width,
            height,
            isMobile,
            isTablet,
            isDesktop,
            isXl,
            isXxl,
            showTopNav: isMobile,
            showFloatingSidebar: !isMobile,
            sidebarHasText,
            sidebarIsCollapsed,
            sidebarWidth,
        };
    }, []);

    const screenSize = useMemo(() => {
        // If not hydrated yet, use server-safe defaults (desktop layout)
        if (!isHydrated) {
            return calculateScreenSize(1200, 800);
        }
        return calculateScreenSize(dimensions.width, dimensions.height);
    }, [dimensions.width, dimensions.height, calculateScreenSize, isHydrated]);

    useEffect(() => {
        // Set isHydrated to true and get real dimensions after hydration
        setIsHydrated(true);
        const width = window.innerWidth;
        const height = window.innerHeight;
        setDimensions({ width, height });
    }, []);

    useEffect(() => {
        if (!isHydrated) return;

        let timeoutId: NodeJS.Timeout;

        const handleResize = () => {
            // Throttle resize events to prevent excessive re-renders
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const width = window.innerWidth;
                const height = window.innerHeight;
                setDimensions({ width, height });
            }, 150); // 150ms throttle
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, [isHydrated]);

    return screenSize;
}

// Utility hook for just mobile detection (for backward compatibility)
export function useIsMobile() {
    const { isMobile } = useScreenSize();
    return isMobile;
}

// Utility hook for just tablet detection (for backward compatibility)
export function useIsTablet() {
    const { isTablet } = useScreenSize();
    return isTablet;
}

// Utility hook for just desktop detection
export function useIsDesktop() {
    const { isDesktop } = useScreenSize();
    return isDesktop;
}

// Utility hook for just xl detection
export function useIsXl() {
    const { isXl } = useScreenSize();
    return isXl;
}

// Utility hook for just xxl detection
export function useIsXxl() {
    const { isXxl } = useScreenSize();
    return isXxl;
}

// Utility hook for sidebar responsive states
export function useSidebarResponsive() {
    const { sidebarHasText, sidebarIsCollapsed, sidebarWidth } = useScreenSize();
    return { sidebarHasText, sidebarIsCollapsed, sidebarWidth };
}