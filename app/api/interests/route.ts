import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const authToken = request.cookies.get('auth_token')?.value;

        if (!authToken) {
            return NextResponse.json(
                { success: false, message: 'No authentication token found' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Forward the request to the Laravel backend
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const response = await fetch(`${backendUrl}/interests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            // Clear invalid cookies if auth fails
            if (response.status === 401) {
                const clearResponse = NextResponse.json(
                    { success: false, message: data.message || 'Authentication failed' },
                    { status: 401 }
                );

                clearResponse.cookies.delete('auth_token');
                clearResponse.cookies.delete('client_auth_token');

                return clearResponse;
            }

            return NextResponse.json(
                { success: false, message: data.message || 'Failed to add custom interest' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Add custom interest API error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}