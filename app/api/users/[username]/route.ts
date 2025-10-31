import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.API_URL?.replace('/api', '') || 'http://localhost:8000';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await params;

        if (!username) {
            return NextResponse.json(
                { error: 'Username is required' },
                { status: 400 }
            );
        }

        // For development/testing: return mock data for test usernames
        if (username === 'testuser' || username === 'johndoe' || username === 'janedoe') {
            const testUser = {
                id: username === 'testuser' ? 1 : username === 'johndoe' ? 2 : 3,
                username: username,
                name: username === 'testuser' ? 'Test User' : username === 'johndoe' ? 'John Doe' : 'Jane Doe',
                bio: `This is ${username}'s profile. Welcome to my page!`,
                avatar_url: null,
                profile_image: null,
                banner_url: null,
                location: 'Remote',
                website: null,
                is_professional: false,
                professional_category: null,
                points: Math.floor(Math.random() * 1000) + 100,
                level: Math.floor(Math.random() * 10) + 1,
                streak_count: Math.floor(Math.random() * 30) + 1,
                created_at: new Date().toISOString(),
                followers_count: Math.floor(Math.random() * 100),
                is_following: false,
                profile_completion_status: 'complete',
                is_onboarded_status: 'complete',
                email_verified_at: new Date().toISOString(),
                last_activity_date: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                date_of_birth: null,
            };

            return NextResponse.json(testUser);
        }

        // Forward Authorization header if present
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const response = await fetch(`${API_BASE}/api/users/${encodeURIComponent(username)}`, {
            method: 'GET',
            headers,
            cache: 'no-store',
        });

        if (response.status === 404) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (!response.ok) {
            console.error('Backend API error:', response.status, response.statusText);
            return NextResponse.json(
                { error: 'Failed to fetch user data' },
                { status: response.status }
            );
        }

        const userData = await response.json();
        return NextResponse.json(userData);

    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}