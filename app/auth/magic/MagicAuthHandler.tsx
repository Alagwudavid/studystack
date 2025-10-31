"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { serverLogin } from "@/lib/auth-actions";

export default function MagicAuthHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    const token = searchParams.get('token');
    const error = searchParams.get('error');

    useEffect(() => {
        if (error) {
            handleError(error);
            return;
        }

        if (!token) {
            setStatus('error');
            setMessage('Invalid magic link - no token provided');
            return;
        }

        handleMagicAuth(token);
    }, [token, error]);

    const handleError = (errorType: string) => {
        setStatus('error');
        switch (errorType) {
            case 'invalid_token':
                setMessage('This magic link is invalid or malformed');
                break;
            case 'token_expired':
                setMessage('This magic link has expired or has already been used');
                break;
            case 'code_expired':
                setMessage('The verification code associated with this link has expired');
                break;
            case 'auth_failed':
                setMessage('Authentication failed. Please try again');
                break;
            default:
                setMessage('An unknown error occurred');
        }
    };

    const decodeJWTPayload = (token: string) => {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format');
            }

            // Decode the payload (second part)
            const payload = parts[1];
            // Add padding if needed
            const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
            const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));

            return JSON.parse(decodedPayload);
        } catch (error) {
            console.error('Error decoding JWT payload:', error);
            return null;
        }
    };

    const handleMagicAuth = async (magicToken: string) => {
        try {
            setStatus('loading');
            setMessage('Verifying your magic link...');

            console.log('Processing magic token:', magicToken.substring(0, 50) + '...');

            // Decode the JWT token to extract email and code
            const payload = decodeJWTPayload(magicToken);

            if (!payload) {
                setStatus('error');
                setMessage('Invalid magic link format');
                return;
            }

            console.log('Decoded payload:', payload);

            if (payload.type !== 'magic_auth' || !payload.email || !payload.code) {
                setStatus('error');
                setMessage('This magic link is invalid or malformed');
                return;
            }

            // Check if token is expired
            if (payload.exp && payload.exp < Date.now() / 1000) {
                setStatus('error');
                setMessage('This magic link has expired');
                return;
            }

            setMessage('Authenticating...');

            // Use the existing serverLogin flow with extracted email and code
            // This ensures proper cookie handling and auth state management
            const result = await serverLogin(payload.email, payload.code, true); // Keep signed in for magic link users

            if (result.success === false) {
                setStatus('error');
                setMessage(result.message || 'Authentication failed');
                return;
            }

            // If we get here, login was successful and user was redirected
            setStatus('success');
            setMessage('Authentication successful! Redirecting...');

        } catch (error) {
            console.error('Magic auth error:', error);

            // Check if this is a Next.js redirect (expected behavior)
            if (error instanceof Error && error.message === "NEXT_REDIRECT") {
                // This is expected when serverLogin redirects - the user was successfully authenticated
                setStatus('success');
                setMessage('Authentication successful! Redirecting...');
                return;
            }

            setStatus('error');
            setMessage('Failed to process magic link authentication');
        }
    };

    const handleRetry = () => {
        router.push('/auth');
    };

    const getIcon = () => {
        switch (status) {
            case 'loading':
                return <Loader2 className="h-8 w-8 animate-spin text-primary" />;
            case 'success':
                return <CheckCircle className="h-8 w-8 text-green-500" />;
            case 'error':
                return <XCircle className="h-8 w-8 text-red-500" />;
            default:
                return <AlertCircle className="h-8 w-8 text-yellow-500" />;
        }
    };

    const getTitle = () => {
        switch (status) {
            case 'loading':
                return 'Authenticating...';
            case 'success':
                return 'Success!';
            case 'error':
                return 'Authentication Failed';
            default:
                return 'Magic Link Authentication';
        }
    };

    return (
        <AuthLayout>
            <Card className="w-full max-w-md mx-auto border">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        {getIcon()}
                    </div>
                    <CardTitle>{getTitle()}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    {status === 'loading' && (
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                {message}
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-4">
                            <p className="text-green-600 font-medium">
                                You've been successfully authenticated!
                            </p>
                            <p className="text-muted-foreground">
                                Redirecting you now...
                            </p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-4">
                            <Alert variant="destructive">
                                <AlertDescription>{message}</AlertDescription>
                            </Alert>

                            <div className="space-y-2">
                                <p className="text-muted-foreground">
                                    Don't worry! You can still sign in manually.
                                </p>

                                <Button
                                    onClick={handleRetry}
                                    className="w-full"
                                >
                                    Go to Sign In
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
