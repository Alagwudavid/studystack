"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface TransitionContextType {
    isTransitioning: boolean;
    triggerTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
    const [isTransitioning, setIsTransitioning] = useState(false);

    const triggerTransition = () => {
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 300);
    };

    return (
        <TransitionContext.Provider value={{ isTransitioning, triggerTransition }}>
            {children}
        </TransitionContext.Provider>
    );
}

export function useTransition() {
    const context = useContext(TransitionContext);
    if (context === undefined) {
        throw new Error("useTransition must be used within a TransitionProvider");
    }
    return context;
}