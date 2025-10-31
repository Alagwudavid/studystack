/**
 * Get the base URL for the application
 * Automatically detects the correct URL based on environment
 */
export function getBaseUrl(): string {
    // Browser environment
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }

    // Server environment
    // 1. Check for Vercel URL
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // 2. Check for custom base URL
    if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL;
    }

    // 3. Default to localhost in development
    return 'http://localhost:3000';
}

/**
 * Get the API base URL
 */
export function getApiUrl(path: string = ''): string {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/api${path}`;
}

/**
 * Check if we're in production environment
 */
export function isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
}

/**
 * Check if we're in development environment
 */
export function isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
}

/**
 * Get allowed origins for CORS
 */
export function getAllowedOrigins(): string[] {
    const origins = process.env.ALLOWED_ORIGINS?.split(',') || [];

    // Always include the current base URL
    const baseUrl = getBaseUrl();
    if (!origins.includes(baseUrl)) {
        origins.push(baseUrl);
    }

    // In development, also allow localhost variants
    if (isDevelopment()) {
        const localhostVariants = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://0.0.0.0:3000'
        ];
        origins.push(...localhostVariants);
    }

    return [...new Set(origins)]; // Remove duplicates
}
