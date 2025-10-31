"use client";

// Animation variants for sidebar components
export const sidebarVariants = {
    // Main sidebar container animations
    sidebar: {
        initial: { x: -80, opacity: 0 },
        animate: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                duration: 0.6
            }
        },
        exit: {
            x: -80,
            opacity: 0,
            transition: { duration: 0.3 }
        }
    },

    // Dropdown sidebar animations
    dropdown: {
        initial: { y: -20, opacity: 0, scale: 0.95 },
        animate: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.4
            }
        },
        exit: {
            y: -20,
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.3 }
        }
    },

    // Menu item animations
    menuItem: {
        initial: { opacity: 0, y: 8 },
        animate: (custom: { isVisible: boolean; index: number }) => ({
            opacity: custom.isVisible ? 1 : 0,
            y: custom.isVisible ? 0 : 8,
            transition: {
                duration: 0.4,
                delay: custom.index * 0.08,
                ease: [0.4, 0, 0.2, 1]
            }
        })
    },

    // Dropdown menu item animations (horizontal slide)
    dropdownMenuItem: {
        initial: { opacity: 0, x: -10 },
        animate: (custom: { isVisible: boolean; index: number }) => ({
            opacity: custom.isVisible ? 1 : 0,
            x: custom.isVisible ? 0 : -10,
            transition: {
                duration: 0.3,
                delay: custom.index * 0.06,
                ease: [0.4, 0, 0.2, 1]
            }
        })
    },

    // Skeleton loading animations
    skeleton: {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { duration: 0.2 }
        }
    }
};

// Utility function to create staggered children animations
export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    }
};