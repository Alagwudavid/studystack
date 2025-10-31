"use client";

const FALLBACK_URL_KEY = 'bitroot_fallback_url';

/**
 * Validates if a URL is internal to the application
 * @param url - The URL to validate
 * @returns true if internal, false if external
 */
export function isInternalUrl(url: string): boolean {
    try {
        // Handle relative URLs (they are internal by definition)
        if (url.startsWith('/')) {
            return true;
        }

        const urlObj = new URL(url);
        const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

        // Additional security: prevent javascript: and data: URLs
        if (urlObj.protocol === 'javascript:' || urlObj.protocol === 'data:') {
            return false;
        }

        // Check if it's the same origin
        return urlObj.origin === currentOrigin;
    } catch {
        // If URL parsing fails, assume it's not a valid URL
        return false;
    }
}

/**
 * Validates if a path is safe for redirection
 * @param path - The path to validate
 * @returns true if safe, false if potentially dangerous
 */
export function isSafePath(path: string): boolean {
    // Prevent auth loops and dangerous paths
    const dangerousPaths = ['/auth', '/login', '/logout', '/api/'];

    return !dangerousPaths.some(dangerous => path.startsWith(dangerous));
}

/**
 * Saves the current URL as fallback URL in localStorage
 * @param url - The URL to save as fallback
 */
export function saveFallbackUrl(url: string): void {
    if (typeof window === 'undefined') return;

    // Only save internal and safe URLs
    if (isInternalUrl(url) && isSafePath(url)) {
        localStorage.setItem(FALLBACK_URL_KEY, url);
    }
}

/**
 * Retrieves the fallback URL from localStorage
 * @returns The fallback URL or null if not found/invalid
 */
export function getFallbackUrl(): string | null {
    if (typeof window === 'undefined') return null;

    try {
        const fallbackUrl = localStorage.getItem(FALLBACK_URL_KEY);

        if (!fallbackUrl) {
            return null;
        }

        // Validate that the stored URL is still internal and safe
        if (isInternalUrl(fallbackUrl) && isSafePath(fallbackUrl)) {
            return fallbackUrl;
        }

        // If it's not internal, remove it and return null
        clearFallbackUrl();
        return null;
    } catch {
        return null;
    }
}

/**
 * Clears the fallback URL from localStorage
 */
export function clearFallbackUrl(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(FALLBACK_URL_KEY);
    } catch {
        // Silent fail for localStorage access issues
    }
}

/**
 * Gets the redirect URL after successful login
 * Priority: fallback URL > /home
 * @returns The URL to redirect to
 */
export function getPostLoginRedirectUrl(): string {
    const fallbackUrl = getFallbackUrl();

    if (fallbackUrl) {
        // Clear the fallback URL since we're using it
        clearFallbackUrl();
        return fallbackUrl;
    }

    // Default to home page
    return '/home';
}

/**
 * Extracts fallback URL from query parameters and shares it
 * @param searchParams - URLSearchParams or query string
 */
export function handleFallbackFromQuery(searchParams: URLSearchParams | string): void {
    const params = typeof searchParams === 'string'
        ? new URLSearchParams(searchParams)
        : searchParams;

    const fallbackUrl = params.get('fallback');

    if (fallbackUrl && isInternalUrl(fallbackUrl) && isSafePath(fallbackUrl)) {
        saveFallbackUrl(fallbackUrl);
    }
}
