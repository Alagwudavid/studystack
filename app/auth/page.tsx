import { redirectIfAuthenticated } from '@/lib/server-auth';
import { Suspense } from 'react';
import AuthClient from './AuthClient';

export default async function AuthPage() {
    // Redirect to home if already authenticated
    await redirectIfAuthenticated('/home');

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthClient />
        </Suspense>
    );
}
