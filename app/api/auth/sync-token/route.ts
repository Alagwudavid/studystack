import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint to sync authentication tokens between httpOnly and client-accessible cookies
 * This validates the token with the backend and ensures both cookies are set
 */
export async function POST(request: NextRequest) {
    try {
        // Get the httpOnly auth token from the request
        const authToken = request.cookies.get('auth_token')?.value;

        if (!authToken) {
            // No token found, return success but indicate no sync needed
            return NextResponse.json(
                { success: false, message: 'No authentication token found', needsAuth: true },
                { status: 200 } // Return 200 instead of 401 to avoid console errors
            );
        }

        // Validate the token with the Laravel backend using the profile endpoint
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        try {
            const response = await fetch(`${backendUrl}/auth/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                // Token is invalid, clear the cookies
                const clearResponse = NextResponse.json(
                    { success: false, message: 'Invalid token' },
                    { status: 401 }
                );

                clearResponse.cookies.delete('auth_token');
                clearResponse.cookies.delete('client_auth_token');

                return clearResponse;
            }

            const data = await response.json();

            if (data.success) {
                // Token is valid, sync the client-accessible cookie
                const syncResponse = NextResponse.json({
                    success: true,
                    message: 'Token synchronized successfully',
                    user: data.user,
                });

                // Set client-accessible auth token cookie with the actual JWT token
                syncResponse.cookies.set('client_auth_token', authToken, {
                    httpOnly: false, // Client needs to read this
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 60 * 60 * 24 * 30, // 30 days to match backend
                });

                return syncResponse;
            }
        } catch (fetchError) {
            console.error('Backend validation error:', fetchError);
            // If backend is not available, still allow sync but with warning
            const fallbackResponse = NextResponse.json({
                success: true,
                message: 'Token synced (backend unavailable)',
                warning: 'Could not validate with backend'
            });

            fallbackResponse.cookies.set('client_auth_token', authToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });

            return fallbackResponse;
        }

        return NextResponse.json(
            { success: false, message: 'Token validation failed' },
            { status: 401 }
        );
    } catch (error) {
        console.error('Token sync error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to sync authentication token' },
            { status: 500 }
        );
    }
}