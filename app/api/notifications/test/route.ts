import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        // Get authentication token from cookie or header
        const cookieStore = cookies();
        const authCookie = cookieStore.get('auth_token');
        const authHeader = request.headers.get('authorization');

        const token = authCookie?.value || authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        const body = await request.json();
        const { title, message, type = 'test' } = body;

        // Validate input
        if (!title || !message) {
            return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
        }

        // Make request to backend API to create notification
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

        const response = await fetch(`${backendUrl}/api/notifications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                title,
                message,
                type,
                data: {
                    test: true,
                    timestamp: new Date().toISOString()
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Backend API error:', data);
            return NextResponse.json({ error: 'Failed to create notification' }, { status: response.status });
        }

        return NextResponse.json({
            success: true,
            notification: data,
            message: 'Test notification sent successfully'
        });

    } catch (error) {
        console.error('Test notification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}