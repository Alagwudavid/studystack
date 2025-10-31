'use client';

interface CSRFConfig {
    endpoint: string;
    token: string | null;
    lastFetch: number;
    expiry: number; // 30 minutes
}

class CSRFManager {
    private config: CSRFConfig = {
        endpoint: '/api/csrf',
        token: null,
        lastFetch: 0,
        expiry: 30 * 60 * 1000 // 30 minutes
    };

    /**
     * Get CSRF token, fetching if needed
     */
    async getToken(): Promise<string | null> {
        const now = Date.now();

        // Return cached token if still valid
        if (this.config.token && (now - this.config.lastFetch) < this.config.expiry) {
            return this.config.token;
        }

        // Get authentication token for CSRF request
        const authToken = this.getAuthToken();
        if (!authToken) {
            console.debug('No auth token found, skipping CSRF token fetch');
            return null;
        }

        // Fetch new token
        try {
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            const response = await fetch(`${backendUrl}/csrf`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.config.token = data.token;
                this.config.lastFetch = now;
                return this.config.token;
            } else if (response.status === 401) {
                console.debug('CSRF token fetch failed: Unauthorized');
                return null;
            }
        } catch (error) {
            console.debug('Failed to fetch CSRF token:', error);
        }

        return null;
    }

    /**
     * Get authentication token from localStorage or cookies
     */
    private getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;

        // Try localStorage first
        let token = localStorage.getItem('auth_token');

        // If not in localStorage, try cookies
        if (!token) {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'auth_token' && value) {
                    token = decodeURIComponent(value);
                    // Sync to localStorage for future use
                    localStorage.setItem('auth_token', token);
                    break;
                }
            }
        }

        return token;
    }

    /**
     * Add CSRF token to request headers
     */
    async addCSRFHeaders(headers: Record<string, string> = {}): Promise<Record<string, string>> {
        const token = await this.getToken();

        if (token) {
            headers['X-CSRF-Token'] = token;
        }

        return headers;
    }

    /**
     * Make authenticated request with CSRF protection
     */
    async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
        const headers = await this.addCSRFHeaders(options.headers as Record<string, string> || {});

        return fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            }
        });
    }

    /**
     * Clear cached token (call on logout)
     */
    clearToken(): void {
        this.config.token = null;
        this.config.lastFetch = 0;
    }
}

export const csrfManager = new CSRFManager();
