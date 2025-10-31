"use client";

import { StepBasedAuth } from "@/components/auth/StepBasedAuth";
import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Audiowide } from "next/font/google";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { handleFallbackFromQuery } from '@/lib/fallback-url';
import {
    Signal,
} from "lucide-react";

const audiowide_regular = Audiowide({
    subsets: ["latin"],
    weight: "400",
});

function AuthContent() {
    const searchParams = useSearchParams();

    // Extract URL parameters for step-based auth
    const step = searchParams.get('step') || 'email';
    const email = searchParams.get('email');
    const error = searchParams.get('error');

    // Handle fallback URL from query parameters
    useEffect(() => {
        handleFallbackFromQuery(searchParams);
    }, [searchParams]);

    return (
        <AuthLayout>
            {/* Logo and Brand */}
            {/* <div className="text-center w-full flex flex-row gap-3 items-center justify-center mb-8">
                <span className={`text-3xl font-semibold select-none font-mono`}>Bitroot</span>
            </div> */}

            {/* Global Error Message */}
            {error && (
                <div className="mb-6">
                    <div className="bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-800 dark:text-red-400 px-4 py-3 rounded-lg">
                        {error === 'invalid_token' && 'Invalid or expired magic link'}
                        {error === 'token_expired' && 'This magic link has expired or has already been used'}
                        {error === 'code_expired' && 'The verification code has expired'}
                        {error === 'auth_failed' && 'Authentication failed. Please try again'}
                        {!['invalid_token', 'token_expired', 'code_expired', 'auth_failed'].includes(error) && 'An error occurred'}
                    </div>
                </div>
            )}

            {/* Step-based Auth Form */}
            <StepBasedAuth
                initialStep={step as 'email' | 'code'}
                initialEmail={email}
            />
        </AuthLayout>
    );
}

export default function AuthClient() {
    return (
        <Suspense fallback={<div>Loading authentication...</div>}>
            <AuthContent />
        </Suspense>
    );
}
