'use client';

import { useEffect, useState } from 'react';
import { cookieUtils, COOKIE_KEYS } from '@/lib/cookie-utils';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

export function PostLoginStatusIndicator() {
    const [timeRemaining, setTimeRemaining] = useState<string>('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if the cookie exists (meaning loading was shown recently)
        const cookieValue = cookieUtils.getCookie('bitroot_post_login_shown');
        if (cookieValue) {
            setIsVisible(true);

            // Calculate time remaining
            const updateTimeRemaining = () => {
                // Get cookie expiration time (assuming 1 hour from when it was set)
                // This is a simplified calculation
                const now = Date.now();
                const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

                // Since we can't get exact cookie expiration, we'll show a general message
                setTimeRemaining('~1 hour');
            };

            updateTimeRemaining();
            const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

            return () => clearInterval(interval);
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div className="mb-4">
            <Badge variant="outline" className="gap-2">
                <Clock className="h-3 w-3" />
                Post-login loading skipped (resets in {timeRemaining})
            </Badge>
        </div>
    );
}
