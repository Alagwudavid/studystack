import { Suspense } from 'react';
import MagicAuthHandler from './MagicAuthHandler';

export default function MagicAuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Authenticating with magic link...</p>
                </div>
            </div>
        }>
            <MagicAuthHandler />
        </Suspense>
    );
}
