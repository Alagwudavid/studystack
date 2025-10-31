'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cookieUtils } from '@/lib/cookie-utils';

export default function DebugActivities() {
    const [debugInfo, setDebugInfo] = useState<any>({});
    const { isAuthenticated, user, token } = useAuth();

    useEffect(() => {
        const checkAuth = () => {
            // Get token from localStorage
            const localStorageToken = localStorage.getItem('auth_token');

            // Get token from cookies using our utility
            const cookieToken = cookieUtils.getCookie('auth_token');
            const clientCookieToken = cookieUtils.getCookie('client_auth_token');

            // Get all cookies for debugging
            const allCookies = document.cookie;

            // Check what cookies exist that contain 'token'
            const tokenCookies = allCookies.split(';')
                .filter(cookie => cookie.toLowerCase().includes('token'))
                .map(cookie => cookie.trim());

            // Test direct cookie access
            const directCookieTest = document.cookie.includes('auth_token');
            const directClientCookieTest = document.cookie.includes('client_auth_token');

            const info = {
                // AuthContext state
                authContextAuthenticated: isAuthenticated,
                authContextHasUser: !!user,
                authContextUserName: user?.name || user?.email,
                authContextHasToken: !!token,
                authContextTokenLength: token?.length || 0,
                authContextTokenPreview: token ? `${token.substring(0, 30)}...` : 'No token',

                // Direct storage checks
                localStorageToken: localStorageToken ? 'present' : 'missing',
                localStorageTokenLength: localStorageToken?.length || 0,
                localStorageTokenPreview: localStorageToken ? `${localStorageToken.substring(0, 30)}...` : 'No token',

                // Cookie checks
                cookieToken: cookieToken ? 'present' : 'missing',
                cookieTokenLength: cookieToken?.length || 0,
                cookieTokenPreview: cookieToken ? `${cookieToken.substring(0, 30)}...` : 'No token',

                clientCookieToken: clientCookieToken ? 'present' : 'missing',
                clientCookieTokenLength: clientCookieToken?.length || 0,
                clientCookieTokenPreview: clientCookieToken ? `${clientCookieToken.substring(0, 30)}...` : 'No token',

                // Direct cookie access tests
                directCookieIncludes: directCookieTest,
                directClientCookieIncludes: directClientCookieTest,

                // Raw cookie debugging
                allTokenCookies: tokenCookies,
                totalCookies: allCookies.split(';').length,
                rawCookieLength: allCookies.length,
                rawCookiesFirst200: allCookies.substring(0, 200) + (allCookies.length > 200 ? '...' : '')
            };

            setDebugInfo(info);
        };

        checkAuth();

        // Check every 5 seconds for 15 seconds only
        const interval = setInterval(checkAuth, 5000);

        setTimeout(() => clearInterval(interval), 15000);

        return () => clearInterval(interval);
    }, [isAuthenticated, user, token]);

    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="font-bold mb-2">Activities Debug Authentication Info:</h3>
            <pre className="text-xs overflow-auto max-h-96">
                {JSON.stringify(debugInfo, null, 2)}
            </pre>
        </div>
    );
}