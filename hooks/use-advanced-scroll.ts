'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface ScrollState {
    scrollDirection: 'up' | 'down' | 'idle';
    scrollY: number;
    isAtTop: boolean;
    isNearTop: boolean;
    showOnScrollUp: boolean;
    showOnScrollDown: boolean;
    isScrolling: boolean;
}

interface UseAdvancedScrollOptions {
    threshold?: number;
    nearTopThreshold?: number;
    debounceMs?: number;
    enableDirectionChange?: boolean;
    enablePositionTracking?: boolean;
    scrollContainer?: HTMLElement | null; // Add custom scroll container option
}

const useAdvancedScroll = (options: UseAdvancedScrollOptions = {}) => {
    const {
        threshold = 10,
        nearTopThreshold = 100,
        debounceMs = 150,
        enableDirectionChange = true,
        enablePositionTracking = true,
        scrollContainer,
    } = options;

    const [scrollState, setScrollState] = useState<ScrollState>({
        scrollDirection: 'idle',
        scrollY: 0,
        isAtTop: true,
        isNearTop: true,
        showOnScrollUp: false,
        showOnScrollDown: false,
        isScrolling: false,
    });

    const prevScrollY = useRef(0);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
    const ticking = useRef(false);

    const getScrollY = useCallback(() => {
        if (scrollContainer) {
            return scrollContainer.scrollTop;
        }
        return window.scrollY;
    }, [scrollContainer]);

    const updateScrollState = useCallback(() => {
        const currentScrollY = getScrollY();
        const scrollDifference = currentScrollY - prevScrollY.current;

        const isAtTop = currentScrollY <= 5;
        const isNearTop = currentScrollY <= nearTopThreshold;

        let newDirection: 'up' | 'down' | 'idle' = 'idle';

        if (enableDirectionChange && Math.abs(scrollDifference) >= threshold) {
            if (scrollDifference > 0) {
                newDirection = 'down';
            } else if (scrollDifference < 0) {
                newDirection = 'up';
            }
        }

        const showOnScrollUp = newDirection === 'up' && !isAtTop;
        const showOnScrollDown = newDirection === 'down' && !isNearTop;

        setScrollState(prev => ({
            ...prev,
            scrollDirection: newDirection,
            scrollY: enablePositionTracking ? currentScrollY : prev.scrollY,
            isAtTop,
            isNearTop,
            showOnScrollUp,
            showOnScrollDown,
            isScrolling: true,
        }));

        prevScrollY.current = currentScrollY;
        ticking.current = false;

        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }

        scrollTimeout.current = setTimeout(() => {
            setScrollState(prev => ({
                ...prev,
                isScrolling: false,
                scrollDirection: 'idle',
            }));
        }, debounceMs);
    }, [threshold, nearTopThreshold, debounceMs, enableDirectionChange, enablePositionTracking, getScrollY]);

    const handleScroll = useCallback(() => {
        if (!ticking.current) {
            requestAnimationFrame(updateScrollState);
            ticking.current = true;
        }
    }, [updateScrollState]);

    useEffect(() => {
        const targetElement = scrollContainer || window;

        // Initialize scroll position
        const initialScrollY = getScrollY();
        prevScrollY.current = initialScrollY;
        const initialIsAtTop = initialScrollY <= 5;
        const initialIsNearTop = initialScrollY <= nearTopThreshold;

        setScrollState(prev => ({
            ...prev,
            scrollY: enablePositionTracking ? initialScrollY : prev.scrollY,
            isAtTop: initialIsAtTop,
            isNearTop: initialIsNearTop,
        }));

        targetElement.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            targetElement.removeEventListener('scroll', handleScroll);
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
        };
    }, [handleScroll, nearTopThreshold, enablePositionTracking, scrollContainer, getScrollY]);

    const scrollToTop = useCallback((smooth = true) => {
        if (scrollContainer) {
            scrollContainer.scrollTo({
                top: 0,
                behavior: smooth ? 'smooth' : 'auto',
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: smooth ? 'smooth' : 'auto',
            });
        }
    }, [scrollContainer]);

    const scrollToPosition = useCallback((position: number, smooth = true) => {
        if (scrollContainer) {
            scrollContainer.scrollTo({
                top: position,
                behavior: smooth ? 'smooth' : 'auto',
            });
        } else {
            window.scrollTo({
                top: position,
                behavior: smooth ? 'smooth' : 'auto',
            });
        }
    }, [scrollContainer]);

    return {
        ...scrollState,
        scrollToTop,
        scrollToPosition,
    };
};

export default useAdvancedScroll;