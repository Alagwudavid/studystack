import { useEffect, useState } from 'react';

interface ScreenBreakpoints {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
}

interface ScreenObserverConfig {
    breakpoints?: Partial<ScreenBreakpoints>;
    widthFactors?: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
        '2xl': string;
    };
}

const defaultBreakpoints: ScreenBreakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

const defaultWidthFactors = {
    sm: '28rem',    // max-w-md equivalent (448px)
    md: '36rem',    // max-w-xl equivalent (576px)
    lg: '48rem',    // max-w-3xl equivalent (768px)
    xl: '56rem',    // max-w-4xl equivalent (896px)
    '2xl': '64rem', // max-w-5xl equivalent (1024px)
};

export const useScreenObserver = (config: ScreenObserverConfig = {}) => {
    const [screenWidth, setScreenWidth] = useState<number>(0);
    const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('sm');

    const breakpoints = { ...defaultBreakpoints, ...config.breakpoints };
    const widthFactors = { ...defaultWidthFactors, ...config.widthFactors };

    useEffect(() => {
        const updateScreenWidth = () => {
            const width = window.innerWidth;
            setScreenWidth(width);

            // Determine current breakpoint
            let breakpoint = 'sm';
            if (width >= breakpoints['2xl']) {
                breakpoint = '2xl';
            } else if (width >= breakpoints.xl) {
                breakpoint = 'xl';
            } else if (width >= breakpoints.lg) {
                breakpoint = 'lg';
            } else if (width >= breakpoints.md) {
                breakpoint = 'md';
            }

            setCurrentBreakpoint(breakpoint);

            // Set CSS variables on document root
            const root = document.documentElement;
            root.style.setProperty('--screen-width', `${width}px`);
            root.style.setProperty('--screen-breakpoint', breakpoint);
            root.style.setProperty('--dynamic-max-width', widthFactors[breakpoint as keyof typeof widthFactors]);

            // Set individual breakpoint variables
            Object.entries(widthFactors).forEach(([bp, value]) => {
                root.style.setProperty(`--max-width-${bp}`, value);
            });
        };

        // Initial call
        updateScreenWidth();

        // Add resize listener
        window.addEventListener('resize', updateScreenWidth);

        // Cleanup
        return () => {
            window.removeEventListener('resize', updateScreenWidth);
        };
    }, [breakpoints, widthFactors]);

    return {
        screenWidth,
        currentBreakpoint,
        breakpoints,
        widthFactors,
        // Utility function to get current max width
        getCurrentMaxWidth: () => widthFactors[currentBreakpoint as keyof typeof widthFactors],
    };
};

export default useScreenObserver;