'use client';

import { useEffect, useRef } from 'react';

export function useDynamicFavicon(count: number = 0) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const originalFaviconRef = useRef<string | null>(null);

    useEffect(() => {
        // Only run on client side and ensure document is ready
        if (typeof window === 'undefined' || !document.head) return;

        // Get or create canvas
        if (!canvasRef.current) {
            canvasRef.current = document.createElement('canvas');
            canvasRef.current.width = 32;
            canvasRef.current.height = 32;
        }

        // Store original favicon on first run
        if (!originalFaviconRef.current) {
            const currentFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
            originalFaviconRef.current = currentFavicon?.href || '/icon.png';
        }

        // Use setTimeout to ensure DOM is stable
        const timeoutId = setTimeout(() => {
            updateFavicon(count);
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [count]);

    const updateFavicon = async (badgeCount: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        try {
            // Clear canvas
            ctx.clearRect(0, 0, 32, 32);

            // Load base favicon
            const img = new Image();
            img.crossOrigin = 'anonymous';

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject();
                img.src = originalFaviconRef.current || '/icon.png';
            });

            // Draw base favicon
            ctx.drawImage(img, 0, 0, 32, 32);

            // Add badge if count > 0
            if (badgeCount > 0) {
                // Badge background
                ctx.fillStyle = '#ff4444';
                ctx.beginPath();
                ctx.arc(24, 8, 8, 0, 2 * Math.PI);
                ctx.fill();

                // Badge border
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Badge text
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 10px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const text = badgeCount > 99 ? '99+' : badgeCount.toString();
                ctx.fillText(text, 24, 8);
            }

            // Update favicon
            const dataURL = canvas.toDataURL('image/png');
            updateFaviconLink(dataURL);

        } catch (error) {
            console.warn('Failed to update favicon:', error);
            // Fallback to original favicon
            if (originalFaviconRef.current) {
                updateFaviconLink(originalFaviconRef.current);
            }
        }
    };

    const updateFaviconLink = (href: string) => {
        try {
            // Find existing favicon
            let favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;

            if (favicon) {
                // Update existing favicon instead of removing/adding
                favicon.href = href;
            } else {
                // Only create new favicon if none exists
                favicon = document.createElement('link');
                favicon.rel = 'icon';
                favicon.type = 'image/png';
                favicon.href = href;
                document.head.appendChild(favicon);
            }
        } catch (error) {
            console.warn('Error updating favicon link:', error);
        }
    };

    // Cleanup function to restore original favicon
    const resetFavicon = () => {
        if (originalFaviconRef.current) {
            updateFaviconLink(originalFaviconRef.current);
        }
    };

    return { resetFavicon };
}