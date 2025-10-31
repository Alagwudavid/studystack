/**
 * Profile completion utility functions
 */

import type { User } from "@/types/user";

/**
 * Check if a user's profile is complete based on essential fields
 */
export function isProfileComplete(user: User | null): boolean {
    if (!user) return false;

    // Essential fields for profile completion
    const hasProfileImage = !!user.profile_image;
    const hasUsername = !!user.username && user.username.trim().length > 0;
    const hasBio = !!user.bio && user.bio.trim().length > 0;
    const hasDateOfBirth = !!user.date_of_birth;
    const hasLocation = !!user.location && user.location.trim().length > 0;

    // Profile is considered complete if user has at least:
    // - Username (required)
    // - At least 2 out of 4 optional fields (profile_image, bio, date_of_birth, location)

    if (!hasUsername) return false;

    const optionalFieldsCount = [hasProfileImage, hasBio, hasDateOfBirth, hasLocation].filter(Boolean).length;
    return optionalFieldsCount >= 2;
}

/**
 * Get missing profile fields for completion
 */
export function getMissingProfileFields(user: User | null): string[] {
    if (!user) return ['username', 'profile_image', 'bio', 'date_of_birth', 'location'];

    const missing: string[] = [];

    if (!user.username || user.username.trim().length === 0) {
        missing.push('username');
    }

    if (!user.profile_image) {
        missing.push('profile_image');
    }

    if (!user.bio || user.bio.trim().length === 0) {
        missing.push('bio');
    }

    if (!user.date_of_birth) {
        missing.push('date_of_birth');
    }

    if (!user.location || user.location.trim().length === 0) {
        missing.push('location');
    }

    return missing;
}

/**
 * Check if user is new (created within the last 24 hours)
 */
export function isNewUser(user: User | null): boolean {
    if (!user) return false;

    const createdAt = new Date(user.created_at);
    const now = new Date();
    const timeDifference = now.getTime() - createdAt.getTime();
    const hoursAgo = timeDifference / (1000 * 60 * 60);

    return hoursAgo <= 24;
}

/**
 * Determine if profile completion modal should be shown
 * Uses the new profile_completion_status field
 */
export function shouldShowProfileCompletion(user: User | null): boolean {
    if (!user) return false;

    // Check the profile completion status
    const status = user.profile_completion_status || 'incomplete';

    // Show modal only if status is 'incomplete'
    // Don't show if 'completed' or 'hidden'
    return status === 'incomplete';
}

/**
 * Get profile completion percentage
 */
export function getProfileCompletionPercentage(user: User | null): number {
    if (!user) return 0;

    const totalFields = 5; // username, profile_image, bio, date_of_birth, location
    const completedFields = [];

    if (user.username && user.username.trim().length > 0) {
        completedFields.push('username');
    }

    if (user.profile_image) {
        completedFields.push('profile_image');
    }

    if (user.bio && user.bio.trim().length > 0) {
        completedFields.push('bio');
    }

    if (user.date_of_birth) {
        completedFields.push('date_of_birth');
    }

    if (user.location && user.location.trim().length > 0) {
        completedFields.push('location');
    }

    return Math.round((completedFields.length / totalFields) * 100);
}
