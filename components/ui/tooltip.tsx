import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({
  children,
  text,
  side = "right",
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [actualSide, setActualSide] = useState(side); // Track the actual rendered side
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let x = 0;
    let y = 0;
    let renderedSide = side; // Track which side we actually render on

    switch (side) {
      case "right":
        x = triggerRect.right + 8;
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;

        // Viewport awareness for right side
        if (x + tooltipRect.width > viewport.width) {
          x = triggerRect.left - tooltipRect.width - 8; // Switch to left
          renderedSide = "left";
        }
        break;

      case "left":
        x = triggerRect.left - tooltipRect.width - 8;
        y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;

        // Viewport awareness for left side
        if (x < 0) {
          x = triggerRect.right + 8; // Switch to right
          renderedSide = "right";
        }
        break;

      case "top":
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.top - tooltipRect.height - 8;

        // Viewport awareness for top
        if (y < 0) {
          y = triggerRect.bottom + 8; // Switch to bottom
          renderedSide = "bottom";
        }
        break;

      case "bottom":
        x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        y = triggerRect.bottom + 8;

        // Viewport awareness for bottom
        if (y + tooltipRect.height > viewport.height) {
          y = triggerRect.top - tooltipRect.height - 8; // Switch to top
          renderedSide = "top";
        }
        break;
    }

    // Ensure tooltip doesn't go off screen horizontally
    if (x < 8) x = 8;
    if (x + tooltipRect.width > viewport.width - 8) {
      x = viewport.width - tooltipRect.width - 8;
    }

    // Ensure tooltip doesn't go off screen vertically
    if (y < 8) y = 8;
    if (y + tooltipRect.height > viewport.height - 8) {
      y = viewport.height - tooltipRect.height - 8;
    }

    setPosition({ x, y });
    setActualSide(renderedSide); // Update the actual rendered side
  };

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();

      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [isVisible, side]);

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>

      {isVisible && typeof window !== "undefined" &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`fixed z-[9999] pointer-events-none ${className}`}
            style={{
              left: position.x,
              top: position.y,
            }}
          >
            <div className="relative animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="bg-foreground dark:text-black text-white text-foreground rounded-lg px-2.5 py-1 whitespace-nowrap">
                {text}
              </div>
              {/* Tail/Arrow */}
              <div
                className={`absolute w-2 h-2 bg-foreground border-foreground transform rotate-45 ${actualSide === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-b-0 border-r-0' :
                    actualSide === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 border-t-0 border-l-0' :
                      actualSide === 'left' ? 'left-full top-1/2 -translate-y-1/2 -translate-x-1/2 border-t-0 border-r-0' :
                        'right-full top-1/2 -translate-y-1/2 translate-x-1/2 border-b-0 border-l-0'
                  }`}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
