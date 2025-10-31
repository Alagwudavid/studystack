'use client';

import { useEffect, useState } from 'react';
import { cookieUtils } from '@/lib/cookie-utils';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

export function AuthGuardStatusIndicator() {
    const [timeRemaining, setTimeRemaining] = useState<string>('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if the auth guard cookie exists (meaning guard was shown recently)
        const cookieValue = cookieUtils.getCookie('bitroot_auth_guard_checked');
        if (cookieValue) {
            setIsVisible(true);

            // Calculate time remaining
            const updateTimeRemaining = () => {
                // Since we can't get exact cookie expiration, we'll show a general message
                setTimeRemaining('~30 min');
            };

            updateTimeRemaining();
            const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

            return () => clearInterval(interval);
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div className="mb-2">
            <Badge variant="secondary" className="gap-2 text-xs">
                <Shield className="h-3 w-3" />
                Auth guard silent (resets in {timeRemaining})
            </Badge>
        </div>
    );
}
