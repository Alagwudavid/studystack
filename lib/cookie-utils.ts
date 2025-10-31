// Cookie utility functions for managing post-login loading state

export const COOKIE_KEYS = {
    POST_LOGIN_SHOWN: 'bitroot_post_login_shown',
    AUTH_GUARD_CHECKED: 'bitroot_auth_guard_checked',
} as const;

export const cookieUtils = {
    /**
     * Set a cookie with expiration time
     */
    setCookie(name: string, value: string, hours: number = 1): void {
        const date = new Date();
        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
    },

    /**
     * Get a cookie value by name
     */
    getCookie(name: string): string | null {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    /**
     * Delete a cookie by name
     */
    deleteCookie(name: string): void {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    },

    /**
     * Check if post-login loading should be shown
     */
    shouldShowPostLoginLoading(): boolean {
        return this.getCookie(COOKIE_KEYS.POST_LOGIN_SHOWN) === null;
    },

    /**
     * Mark that post-login loading has been shown (set for 1 hour)
     */
    markPostLoginLoadingShown(): void {
        this.setCookie(COOKIE_KEYS.POST_LOGIN_SHOWN, 'true', 1);
    },

    /**
     * Clear the post-login loading flag
     */
    clearPostLoginLoadingFlag(): void {
        this.deleteCookie(COOKIE_KEYS.POST_LOGIN_SHOWN);
    },

    /**
     * Check if auth guard should be shown (silent background check)
     */
    shouldShowAuthGuard(): boolean {
        return this.getCookie(COOKIE_KEYS.AUTH_GUARD_CHECKED) === null;
    },

    /**
     * Mark that auth guard has been shown (set for 30 minutes)
     */
    markAuthGuardShown(): void {
        this.setCookie(COOKIE_KEYS.AUTH_GUARD_CHECKED, 'true', 0.5); // 30 minutes = 0.5 hours
    },

    /**
     * Clear the auth guard flag
     */
    clearAuthGuardFlag(): void {
        this.deleteCookie(COOKIE_KEYS.AUTH_GUARD_CHECKED);
    }
};
