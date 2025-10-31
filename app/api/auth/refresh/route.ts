import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const authToken = request.cookies.get('auth_token')?.value;

        if (!authToken) {
            return NextResponse.json(
                { success: false, message: 'No auth token found' },
                { status: 401 }
            );
        }

        // Forward the refresh request to the Laravel backend
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${backendUrl}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Protection': '1',
                'Authorization': `Bearer ${authToken}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            // Refresh failed, clear the cookies
            const clearResponse = NextResponse.json(
                { success: false, message: data.message || 'Token refresh failed' },
                { status: response.status }
            );

            clearResponse.cookies.delete('auth_token');
            clearResponse.cookies.delete('client_auth_token');

            return clearResponse;
        }

        // If refresh successful, update the auth token cookie
        if (data.success && data.token) {
            const refreshResponse = NextResponse.json(data);

            // Update HTTP-only cookie with new token
            refreshResponse.cookies.set('auth_token', data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60, // 7 days
                path: '/',
            });

            // Update client-accessible cookie
            refreshResponse.cookies.set('client_auth_token', 'authenticated', {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60, // 7 days
                path: '/',
            });

            return refreshResponse;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Refresh token error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}