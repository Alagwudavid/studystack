"use client";

import { useState, useEffect } from "react";
import { shouldShowProfileCompletion } from "@/lib/profile-utils";

interface User {
    id: number;
    name: string;
    email: string;
    profile_image?: string | null;
    bio?: string | null;
    username?: string | null;
    date_of_birth?: string | null;
    location?: string | null;
    created_at: string;
    updated_at: string;
}

interface UseProfileCompletionOptions {
    user: User | null;
    enabled?: boolean;
}

export function useProfileCompletion({ user, enabled = true }: UseProfileCompletionOptions) {
    const [showModal, setShowModal] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    // Check if profile completion modal should be shown
    useEffect(() => {
        if (!enabled || !user || hasChecked) return;

        const shouldShow = shouldShowProfileCompletion(user);
        setShowModal(shouldShow);
        setHasChecked(true);
    }, [user, enabled, hasChecked]);

    const handleComplete = () => {
        setShowModal(false);
        setHasChecked(true);
    };

    const handleClose = (open: boolean) => {
        if (!open) {
            setShowModal(false);
        }
    };

    return {
        showModal,
        setShowModal: handleClose,
        onComplete: handleComplete,
    };
}
