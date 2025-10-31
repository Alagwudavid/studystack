import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, code } = body;

        if (!email || !code) {
            return NextResponse.json(
                { success: false, message: 'Email and code are required' },
                { status: 400 }
            );
        }

        // Forward the request to the Laravel backend
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${backendUrl}/auth/verify-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Protection': '1',
            },
            body: JSON.stringify({ email, code }),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: data.message || 'Failed to verify code' },
                { status: response.status }
            );
        }

        // If verification successful, set the auth token cookie
        if (data.success && data.token) {
            const responseWithCookies = NextResponse.json(data);

            // Set HTTP-only cookie for the auth token
            responseWithCookies.cookies.set('auth_token', data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60, // 7 days
                path: '/',
            });

            // Also set a client-accessible cookie for client-side auth checks
            responseWithCookies.cookies.set('client_auth_token', 'authenticated', {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60, // 7 days
                path: '/',
            });

            return responseWithCookies;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Verify code error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}