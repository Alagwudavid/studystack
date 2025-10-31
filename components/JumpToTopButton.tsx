'use client';

import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import useAdvancedScroll from "@/hooks/use-advanced-scroll";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface JumpToTopButtonProps {
    className?: string;
    showThreshold?: number;
    hideNearTop?: boolean;
    scrollContainer?: HTMLElement | null; // Accept scroll container from parent
    childScrollSelector?: string; // Selector to find child scroll containers
    hideIfChildExists?: boolean; // Hide this button if child scroll containers exist
}

const JumpToTopButton = ({
    className,
    showThreshold = 100,
    hideNearTop = false,
    scrollContainer, // Main container from protected layout
    childScrollSelector = '[data-scroll-container="true"], main[class*="overflow-y-auto"], .overflow-y-auto', // Selectors for child containers
    hideIfChildExists = false // Hide this button if child scroll containers exist
}: JumpToTopButtonProps) => {
    const scrollContainerRef = useRef<HTMLElement | null>(null);
    const [hasChildContainer, setHasChildContainer] = useState(false);
    const [isRelativePositioning, setIsRelativePositioning] = useState(false);

    useEffect(() => {
        // Priority 1: Look for child scroll containers within the main container
        let targetContainer: HTMLElement | null = null;
        let foundChildContainer = false;

        if (scrollContainer) {
            // Search for child scroll containers within the provided main container
            const childContainer = scrollContainer.querySelector(childScrollSelector) as HTMLElement;

            if (childContainer) {
                targetContainer = childContainer;
                foundChildContainer = true;
                setIsRelativePositioning(true); // Use relative positioning for child containers
            } else {
                // If no child container found, use the main container
                targetContainer = scrollContainer;
                setIsRelativePositioning(false); // Use fixed positioning for main container
            }
        } else {
            // Priority 2: Fallback to global search if no main container provided
            targetContainer = document.querySelector('main[class*="overflow-y-auto"]') as HTMLElement;
            setIsRelativePositioning(false); // Use fixed positioning for global search
        }

        setHasChildContainer(foundChildContainer);
        scrollContainerRef.current = targetContainer;
    }, [scrollContainer, childScrollSelector]);

    const { scrollY, isAtTop, isNearTop, scrollDirection, scrollToTop } = useAdvancedScroll({
        nearTopThreshold: showThreshold,
        threshold: 10,
        debounceMs: 100,
        scrollContainer: scrollContainerRef.current,
    });

    // Show button when scrolled down past threshold
    const shouldShow = scrollY > showThreshold && !isAtTop;

    const handleClick = () => {
        scrollToTop(true);
    };

    // Determine positioning strategy and create portal if needed
    const buttonElement = (
        <Button
            onClick={handleClick}
            size="icon"
            className={cn(
                "hidden md:flex items-center justify-center",
                "h-12 w-12 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                "border border-border/20 backdrop-blur-sm",
                isRelativePositioning
                    ? "sticky bottom-6 ml-[90%] mr-3" // Absolute positioning relative to container
                    : "fixed bottom-6 right-10", // Fixed positioning relative to viewport
                shouldShow
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-4 pointer-events-none",
                className
            )}
            aria-label="Jump to top"
        >
            <ChevronUp className="!size-6" />
        </Button>
    );

    // For relative positioning, we need to ensure the parent container has relative positioning
    useEffect(() => {
        if (isRelativePositioning && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const currentPosition = getComputedStyle(container).position;
            if (currentPosition === 'static') {
                container.style.position = 'relative';
            }
        }
    }, [isRelativePositioning]);

    // Use portal to render button in the correct container when using relative positioning
    if (isRelativePositioning && scrollContainerRef.current) {
        return createPortal(buttonElement, scrollContainerRef.current);
    }

    // Default rendering for fixed positioning
    return buttonElement;
};

export default JumpToTopButton;