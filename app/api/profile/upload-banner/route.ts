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

        const formData = await request.formData();

        // Forward the request to the Laravel backend
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

        // Create a new FormData for the backend request
        const backendFormData = new FormData();

        // Copy all form data to the backend request
        for (const [key, value] of formData.entries()) {
            backendFormData.append(key, value);
        }

        const response = await fetch(`${backendUrl}/profile/upload-banner`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Protection': '1',
                'Authorization': `Bearer ${authToken}`,
            },
            body: backendFormData,
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Backend returned non-JSON response:', await response.text());
            return NextResponse.json(
                { success: false, message: 'Backend server error - invalid response format' },
                { status: 500 }
            );
        }

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
                { success: false, message: data.message || 'Failed to upload banner image' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Banner image upload API error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}