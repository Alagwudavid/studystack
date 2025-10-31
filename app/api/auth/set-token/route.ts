import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Token is required' },
                { status: 400 }
            );
        }

        // Set the authentication token as an HTTP-only cookie
        const response = NextResponse.json({ success: true });

        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Error setting token:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to set token' },
            { status: 500 }
        );
    }
}