import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

/**
 * CSRF Token API endpoint
 * Returns a CSRF token for authenticated users
 */
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();

        // Check if user is authenticated via token
        const authToken = cookieStore.get('auth_token')?.value;

        if (!authToken) {
            return NextResponse.json({
                success: false,
                message: 'Authentication required'
            }, { status: 401 });
        }

        // Generate CSRF token
        const csrfToken = randomBytes(32).toString('hex');

        // Store CSRF token in secure cookie (httpOnly, sameSite)
        const response = NextResponse.json({
            success: true,
            token: csrfToken
        });

        response.cookies.set('csrf_token', csrfToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 60, // 30 minutes
            path: '/'
        });

        return response;

    } catch (error) {
        console.error('CSRF token generation error:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to generate CSRF token'
        }, { status: 500 });
    }
}

/**
 * CSRF Token validation utility
 */
export async function validateCSRF(request: NextRequest): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const headerToken = request.headers.get('X-CSRF-Token');
        const cookieToken = cookieStore.get('csrf_token')?.value;

        return headerToken !== null && cookieToken !== null && headerToken === cookieToken;
    } catch (error) {
        console.error('CSRF validation error:', error);
        return false;
    }
}
