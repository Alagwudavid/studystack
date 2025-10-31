import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Get authentication token from multiple sources
        let authToken = request.cookies.get('auth_token')?.value ||
            request.cookies.get('client_auth_token')?.value;

        // Also check Authorization header for production
        const authHeader = request.headers.get('authorization');
        if (!authToken && authHeader?.startsWith('Bearer ')) {
            authToken = authHeader.substring(7);
        }

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

        console.log('Forwarding upload to:', `${backendUrl}/profile/upload-image`);

        const response = await fetch(`${backendUrl}/profile/upload-image`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Protection': '1',
                'Authorization': `Bearer ${authToken}`,
                // Add User-Agent for production compatibility
                'User-Agent': 'Bitroot-Frontend/1.0',
            },
            body: backendFormData,
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const responseText = await response.text();
            console.error('Backend returned non-JSON response:', {
                status: response.status,
                statusText: response.statusText,
                contentType,
                responseText: responseText.substring(0, 500), // Log first 500 chars
                url: `${backendUrl}/profile/upload-image`
            });
            return NextResponse.json(
                { success: false, message: 'Backend server error - invalid response format' },
                { status: 500 }
            );
        }

        const data = await response.json();

        if (!response.ok) {
            console.error('Backend API error:', {
                status: response.status,
                statusText: response.statusText,
                data,
                url: `${backendUrl}/profile/upload-image`
            });

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
                { success: false, message: data.message || 'Failed to upload image' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Profile image upload API error:', {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            backendUrl: process.env.NEXT_PUBLIC_API_URL
        });
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}