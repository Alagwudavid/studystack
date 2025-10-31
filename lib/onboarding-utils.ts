/**
 * Onboarding utility functions
 */

import type { User } from "@/types/user";

export type OnboardingStatus = 'complete' | 'incomplete' | 'skipped';

/**
 * Check if user needs to be redirected to onboarding
 */
export function shouldRedirectToOnboarding(user: User | null): boolean {
    if (!user) return false;

    const status = user.is_onboarded_status;
    // Redirect if status is undefined (new user) or 'incomplete'
    return !status || status === 'incomplete';
}

/**
 * Check if user has completed onboarding
 */
export function hasCompletedOnboarding(user: User | null): boolean {
    if (!user) return false;

    return user.is_onboarded_status === 'complete';
}

/**
 * Check if user has skipped onboarding
 */
export function hasSkippedOnboarding(user: User | null): boolean {
    if (!user) return false;

    return user.is_onboarded_status === 'skipped';
}

/**
 * Get onboarding status message for UI
 */
export function getOnboardingStatusMessage(user: User | null): string {
    if (!user) return 'Not authenticated';

    const status = user.is_onboarded_status;

    switch (status) {
        case 'complete':
            return 'Onboarding completed';
        case 'incomplete':
            return 'Onboarding in progress';
        case 'skipped':
            return 'Onboarding skipped';
        default:
            return 'Onboarding not started';
    }
}

/**
 * Check if user can access main app features
 */
export function canAccessMainFeatures(user: User | null): boolean {
    if (!user) return false;

    const status = user.is_onboarded_status;
    // Users can access main features if they completed or skipped onboarding
    return status === 'complete' || status === 'skipped';
}