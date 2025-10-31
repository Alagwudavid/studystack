"use client";

import { useState, useEffect } from "react";

interface StaggeredAnimationOptions {
    items: any[];
    delayBetween?: number;
    initialDelay?: number;
}

export function useStaggeredAnimation({
    items,
    delayBetween = 100,
    initialDelay = 200
}: StaggeredAnimationOptions) {
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Reset when items change
        setVisibleItems(new Set());
        setIsLoading(true);

        // Create a shuffled array of indices for random appearance
        const shuffledIndices = [...Array(items.length).keys()]
            .sort(() => Math.random() - 0.5);

        // Start after initial delay
        const initialTimer = setTimeout(() => {
            setIsLoading(false);

            // Stagger the appearance of items
            shuffledIndices.forEach((index, arrayIndex) => {
                setTimeout(() => {
                    setVisibleItems(prev => new Set([...prev, index]));
                }, arrayIndex * delayBetween);
            });
        }, initialDelay);

        return () => {
            clearTimeout(initialTimer);
        };
    }, [items.length, delayBetween, initialDelay]);

    return {
        isLoading,
        visibleItems,
        isItemVisible: (index: number) => visibleItems.has(index),
    };
}