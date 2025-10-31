'use client';

import { useAuth } from '@/contexts/AuthContext';
import { PasswordlessLogin } from '@/components/auth/PasswordlessLogin';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return fallback || <PasswordlessLogin />;
    }

    return <>{children}</>;
}
