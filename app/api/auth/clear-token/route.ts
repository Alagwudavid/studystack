import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Clear the authentication token cookie
        const response = NextResponse.json({ success: true, message: 'Token cleared' });

        response.cookies.set('auth_token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0, // Expire immediately
            path: '/',
        });

        // Also clear client-side token cookie
        response.cookies.set('client_auth_token', '', {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0, // Expire immediately
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Error clearing token:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to clear token' },
            { status: 500 }
        );
    }
}