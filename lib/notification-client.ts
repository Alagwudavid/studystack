// Notification API client methods
import { API_BASE_URL } from './api-client';

export class NotificationApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${this.baseURL}${endpoint}`;

        // Get token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Notification API request failed:', error);
            }
            throw error;
        }
    }

    // Get user notifications
    async getNotifications(limit = 20, offset = 0) {
        return this.request(`/notifications?limit=${limit}&offset=${offset}`);
    }

    // Mark notification as read
    async markNotificationAsRead(notificationId: number) {
        return this.request(`/notifications/${notificationId}/read`, {
            method: 'PATCH',
        });
    }

    // Mark all notifications as read
    async markAllNotificationsAsRead() {
        return this.request('/notifications/read-all', {
            method: 'PATCH',
        });
    }

    // Get unread notifications count
    async getUnreadNotificationsCount() {
        return this.request('/notifications/unread-count');
    }

    // Create test notification (development only)
    async createTestNotification(type: string, title: string, message: string) {
        return this.request('/notifications/test', {
            method: 'POST',
            body: JSON.stringify({ type, title, message }),
        });
    }
}

// Add notification methods to the existing ApiClient
const notificationApiClient = new NotificationApiClient(API_BASE_URL);

// Export notification client
export { notificationApiClient };
