// API configuration for Laravel backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

import { cookieUtils } from './cookie-utils';
import { csrfManager } from './csrf-utils';

// API client with authentication and CSRF protection
class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    // Helper to get token from localStorage or cookies
    private getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;

        // Try localStorage first
        let token = localStorage.getItem('auth_token');

        // If not in localStorage, try cookies
        if (!token) {
            token = cookieUtils.getCookie('auth_token');
            // If found in cookies, sync to localStorage for future API calls
            if (token) {
                localStorage.setItem('auth_token', token);
            }
        }

        return token;
    }

    private async request(endpoint: string, options: RequestInit = {}, useCSRF: boolean = false) {
        const url = `${this.baseURL}${endpoint}`;

        // Security: Validate endpoint format
        if (!endpoint.startsWith('/')) {
            throw new Error('Invalid endpoint format');
        }

        // Get token from localStorage or cookies with validation
        const token = this.getAuthToken();

        // Security: Basic token format validation (skip for server-authenticated placeholder)
        if (token && token !== 'server-authenticated' && (token.length < 50 || token.length > 1000 || !token.includes('.'))) {
            localStorage.removeItem('auth_token');
            throw new Error('Invalid authentication token');
        }

        let headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // Security: Add CSRF protection headers
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-Protection': '1',
            // Only add Authorization header if we have a real JWT token (not placeholder)
            ...(token && token !== 'server-authenticated' && { Authorization: `Bearer ${token}` }),
            ...options.headers as Record<string, string>,
        };

        // Add CSRF token for authenticated requests that modify data
        if (useCSRF && token) {
            try {
                headers = await csrfManager.addCSRFHeaders(headers);
            } catch (error) {
                console.warn('Failed to add CSRF token:', error);
            }
        }

        const config: RequestInit = {
            headers,
            // Security: Add credentials for CORS - this will send HTTP-only cookies
            credentials: 'include',
            ...options,
        };

        try {
            const response = await fetch(url, config);

            // Security: Validate response content type
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response content type');
            }

            const data = await response.json();

            // Security: Handle authentication errors
            if (!response.ok) {
                if (response.status === 401) {
                    // Clear invalid token
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('auth_token');
                    }
                    throw new Error('Authentication required');
                }

                if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please try again later.');
                }

                throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Authentication methods (no CSRF needed for auth endpoints)
    async requestVerificationCode(email: string) {
        return this.request('/auth/request-code', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async verifyCode(email: string, code: string) {
        return this.request('/auth/verify-code', {
            method: 'POST',
            body: JSON.stringify({ email, code }),
        });
    }

    async getProfile() {
        return this.request('/auth/profile');
    }

    async refreshToken() {
        return this.request('/auth/refresh', {
            method: 'POST',
        });
    }

    async logout() {
        return this.request('/auth/logout', {
            method: 'POST',
        }, true); // Use CSRF for logout
    }

    // Session management methods
    async getActiveSessions() {
        return this.request('/sessions/active');
    }

    async getSessionStatistics() {
        return this.request('/sessions/statistics');
    }

    async startSession(deviceInfo: any) {
        return this.request('/sessions/start', {
            method: 'POST',
            body: JSON.stringify(deviceInfo),
        }, true); // Use CSRF for session start
    }

    async updateSessionStatus(status: string) {
        return this.request('/sessions/status', {
            method: 'PUT',
            body: JSON.stringify({ status }),
        }, true); // Use CSRF for session updates
    }

    async terminateSession(sessionId: string) {
        return this.request(`/sessions/${sessionId}/terminate`, {
            method: 'DELETE',
        }, true); // Use CSRF for session termination
    }

    async heartbeat() {
        return this.request('/sessions/heartbeat', {
            method: 'POST',
        }, true); // Use CSRF for heartbeat
    }

    // Health check (no auth required)
    async healthCheck() {
        return this.request('/health');
    }

    // Protected action example - use CSRF for in-app actions
    async authenticatedAction(endpoint: string, options: RequestInit = {}) {
        return this.request(endpoint, options, true);
    }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);
