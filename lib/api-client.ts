// API configuration for Laravel backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

import { cookieUtils } from './cookie-utils';
import { csrfManager } from './csrf-utils';

// API client with authentication and CSRF protection
class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    // Helper method to get authentication token
    private getAuthToken(): string | null {
        if (typeof window === 'undefined') return null;

        // First, try localStorage (set by frontend during auth flow)
        const localToken = localStorage.getItem('auth_token');
        if (localToken) {
            return localToken;
        }

        // Then try to get token from client-accessible cookie (server-side set)
        const cookieString = document.cookie;

        const cookies = cookieString.split(';');

        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            // Check for client-accessible auth token first, then fallback to other names
            if ((name === 'client_auth_token' || name === 'auth_token' || name === 'session_token' || name === 'access_token') && value) {
                const token = decodeURIComponent(value);
                // Only store in localStorage if we're not in production (for security)
                if (!this.isProduction()) {
                    localStorage.setItem('auth_token', token);
                }
                return token;
            }
        }

        return null;
    }

    // Method to manually clear authentication tokens when needed
    public clearAuthTokens() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            // Clear both auth cookies
            document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
            document.cookie = 'client_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        }
    }

    // Helper method to check if user is authenticated
    private isAuthenticated(): boolean {
        const token = this.getAuthToken();
        return !!token;
    }

    // Helper method to detect production environment
    private isProduction(): boolean {
        return process.env.NODE_ENV === 'production' ||
            (typeof window !== 'undefined' && window.location.hostname !== 'localhost');
    }

    // Helper method for public API calls (no authentication required)
    private async publicRequest(endpoint: string, options: RequestInit = {}) {
        const url = `${this.baseURL}${endpoint}`;

        // Security: Validate endpoint format
        if (!endpoint.startsWith('/')) {
            throw new Error('Invalid endpoint format');
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...options.headers as Record<string, string>,
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                credentials: 'include',
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Invalid response content type');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Request failed with status ${response.status}`);
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network request failed');
        }
    }

    private async request(endpoint: string, options: RequestInit = {}, useCSRF: boolean = false) {
        const url = `${this.baseURL}${endpoint}`;

        // Security: Validate endpoint format
        if (!endpoint.startsWith('/')) {
            throw new Error('Invalid endpoint format');
        }

        // Get authentication token
        const authToken = this.getAuthToken();

        let headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // Only add X-Requested-With header for same-origin requests to avoid CORS
            ...options.headers as Record<string, string>,
        };

        // Add Authorization header if we have an auth token
        // This is needed for direct Laravel backend API calls
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        // Only add X-Requested-With for same-origin requests or when explicitly needed
        if (useCSRF || (typeof window !== 'undefined' && url.startsWith(window.location.origin))) {
            headers['X-Requested-With'] = 'XMLHttpRequest';
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
                    // Don't automatically clear tokens on 401 errors
                    // Let the calling code decide if tokens should be cleared
                    // This prevents unintended logouts during onboarding skip operations
                    throw new Error(data.message || 'Authentication required');
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
        // Use Next.js API route for better authentication handling
        const url = '/api/profile';

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Request failed with status ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get profile error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Request failed',
                error: error instanceof Error ? error : new Error('Request failed'),
            };
        }
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

    async getCurrentSession() {
        return this.request('/sessions/current');
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

    async terminateOtherSessions() {
        return this.request('/sessions', {
            method: 'DELETE',
        }, true); // Use CSRF for terminating other sessions
    }

    async goOffline() {
        return this.request('/sessions/offline', {
            method: 'POST',
        }, true); // Use CSRF for going offline
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

    // Notification methods
    async getNotifications(limit: number = 10, offset: number = 0) {
        return this.request(`/notifications?limit=${limit}&offset=${offset}`);
    }

    async markNotificationAsRead(notificationId: number) {
        return this.request(`/notifications/${notificationId}/read`, {
            method: 'PATCH',
        }, true); // Use CSRF for marking as read
    }

    async markAllNotificationsAsRead() {
        return this.request('/notifications/read-all', {
            method: 'PATCH',
        }, true); // Use CSRF for bulk operations
    }

    async deleteNotification(notificationId: number) {
        return this.request(`/notifications/${notificationId}`, {
            method: 'DELETE',
        }, true); // Use CSRF for delete operations
    }

    // Profile management methods
    async updateProfile(profileData: any) {
        // Use Next.js API route for better authentication handling
        const url = '/api/profile/update';

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Update failed with status ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data,
                message: data.message
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Update failed',
                error: error instanceof Error ? error : new Error('Update failed'),
            };
        }
    }

    async checkUsernameAvailability(username: string) {
        return this.request(`/profile/check-username?username=${encodeURIComponent(username)}`);
    }

    async uploadProfileImage(formData: FormData) {
        // Always use Next.js API route for better error handling and consistent authentication
        const url = '/api/profile/upload-image';

        try {
            console.log('Uploading profile image to:', url);

            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                body: formData, // Don't set Content-Type for FormData
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const responseText = await response.text();
                console.error('Invalid response content type:', { contentType, responseText: responseText.substring(0, 200) });
                throw new Error('Invalid response content type');
            }

            const data = await response.json();

            if (!response.ok) {
                console.error('Upload failed:', { status: response.status, data });

                if (response.status === 401) {
                    throw new Error('Authentication required');
                }
                throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            console.error('Profile image upload failed:', error);
            throw error;
        }
    }

    async updateProfileCompletionStatus(status: 'completed' | 'incomplete' | 'hidden') {
        return this.request('/profile/completion-status', {
            method: 'PUT',
            body: JSON.stringify({ status }),
        }, true); // Use CSRF for profile completion status updates
    }

    // Professional profile application
    async applyProfessionalProfile(data: {
        credentials: string;
        switch_to_professional: boolean;
        professional_category?: string | null;
    }) {
        return this.request('/apply-professional-profile', {
            method: 'POST',
            body: JSON.stringify(data),
        }, true); // Use CSRF for professional profile application
    }

    // Check professional application status with retry for new accounts
    async getProfessionalApplicationStatus() {
        return this.authenticatedRequest('/professional-application-status');
    }

    // Onboarding data management
    async getOnboardingData() {
        return this.authenticatedRequest('/onboarding');
    }

    async updateOnboardingData(data: any) {
        return this.authenticatedRequest('/onboarding', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }, true);
    }

    async updateOnboarding(data: any) {
        // Use Next.js API route for better authentication handling
        const url = '/api/onboarding';

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Update failed with status ${response.status}`);
            }

            const responseData = await response.json();
            return {
                success: true,
                data: responseData.data,
                message: responseData.message
            };
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Update failed',
                error: error instanceof Error ? error : new Error('Update failed'),
            };
        }
    }

    async completeOnboarding(data: any) {
        // Use updateOnboarding since there's no separate complete endpoint
        return this.updateOnboarding(data);
    }

    async createOnboardingRecord(data: any) {
        return this.authenticatedRequest('/onboarding', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }, true);
    }

    // Update user onboarding status
    async updateOnboardingStatus(status: 'complete' | 'incomplete' | 'skipped') {
        // Use Next.js API route for better authentication handling
        const url = '/api/user/onboarding-status';

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_onboarded_status: status }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Update failed with status ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Update onboarding status error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Update failed',
                error: error instanceof Error ? error : new Error('Update failed'),
            };
        }
    }

    // Upload banner image for business onboarding
    async uploadBannerImage(formData: FormData) {
        // Use Next.js API route for better error handling and authentication
        const url = '/api/profile/upload-banner';

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Upload failed with status ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data.data,
            };
        } catch (error) {
            console.error('Banner upload error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Upload failed',
                error: error instanceof Error ? error : new Error('Upload failed'),
            };
        }
    }

    // Interests management methods
    async getInterests(searchTerm?: string, type?: 'default' | 'user_added' | 'suggested') {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (type) params.append('type', type);

        const queryString = params.toString();
        const endpoint = `/interests${queryString ? `?${queryString}` : ''}`;

        return this.publicRequest(endpoint); // Use public request (no auth required)
    }

    async getSuggestedInterests() {
        return this.publicRequest('/interests/suggested'); // Use public request (no auth required)
    } async addCustomInterest(label: string) {
        // Use Next.js API route for better authentication handling
        const url = '/api/interests';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ label }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Add custom interest failed with status ${response.status}`);
            }

            return await response.json();
        } catch (error: any) {
            console.error('Add custom interest error:', error);
            // Handle authentication errors gracefully
            if (error.message?.includes('Authorization') || error.message?.includes('Authentication')) {
                return {
                    success: false,
                    message: 'You need to be logged in to add custom interests. Please complete the onboarding first.',
                    requiresAuth: true
                };
            }
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Add custom interest failed',
                error: error instanceof Error ? error : new Error('Add custom interest failed'),
            };
        }
    }

    async getUserSelectedInterests() {
        // Use Next.js API route for better authentication handling
        const url = '/api/interests/user-selected';

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Request failed with status ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get user interests error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Request failed',
                error: error instanceof Error ? error : new Error('Request failed'),
            };
        }
    }

    async updateUserInterests(interestIds: number[]) {
        // Use Next.js API route for better authentication handling
        const url = '/api/interests/user-selected';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ interest_ids: interestIds }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Update failed with status ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Update user interests error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Update failed',
                error: error instanceof Error ? error : new Error('Update failed'),
            };
        }
    }

    // Enhanced request method for authenticated endpoints
    private async authenticatedRequest(endpoint: string, options: RequestInit = {}, useCSRF: boolean = false, retryOnAuth: boolean = false) {
        try {
            return await this.request(endpoint, options, useCSRF);
        } catch (error: any) {
            // For HttpOnly cookie auth, we can't retry with token sync
            // The backend handles authentication entirely via cookies
            throw error;
        }
    }

    // Protected action example - use CSRF for in-app actions
    async authenticatedAction(endpoint: string, options: RequestInit = {}) {
        return this.request(endpoint, options, true);
    }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);
