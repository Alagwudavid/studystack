import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter') || 'not_following';
        const limit = searchParams.get('limit') || '10';

        // Forward the request to the Laravel backend
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

        // Build query string
        const queryParams = new URLSearchParams();
        queryParams.append('filter', filter);
        queryParams.append('limit', limit);

        const response = await fetch(`${backendUrl}/suggested/users?${queryParams.toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: 'Failed to fetch suggested users' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Suggested users API error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}