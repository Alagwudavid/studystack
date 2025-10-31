<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | This file controls what cross-origin requests are allowed. Adjust as needed.
    | Since you're using Sanctum with cookies, we must explicitly allow origins
    | (wildcards are not allowed with supports_credentials = true).
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        // Development origins
        'http://localhost:3000',
        'http://127.0.0.1:3000',

        // Production origins - CRITICAL: both www and non-www must be explicitly listed
        'https://bitroot.com.ng',
        'https://www.bitroot.com.ng',
        'https://api.bitroot.com.ng',
        'https://www.api.bitroot.com.ng',

        // Vercel deployment origins
        'https://bitroot.vercel.app',
        'https://bitroot-repo.vercel.app',

        // Environment variable origins (fallback)
        env('FRONTEND_URL', 'https://www.bitroot.com.ng'),
        env('NEXT_PUBLIC_APP_URL', 'https://www.bitroot.com.ng'),
    ],

    'allowed_origins_patterns' => [
        '/^https:\/\/(www\.)?bitroot\.com\.ng$/',           // allow root + www
        '/^https:\/\/(www\.)?api\.bitroot\.com\.ng$/',      // allow API subdomain with/without www
        '/^https:\/\/.*\.bitroot\.com\.ng$/',              // allow any subdomains
        '/^https:\/\/.*\.vercel\.app$/',                   // allow Vercel previews
        '/^http:\/\/localhost:[0-9]+$/',                    // allow localhost with any port
        '/^http:\/\/127\.0\.0\.1:[0-9]+$/',                // allow 127.0.0.1 with any port
    ],

    'allowed_headers' => [
        '*',  // Allow all headers for now to debug
        'Accept',
        'Authorization',
        'Content-Type',
        'X-Requested-With',
        'X-CSRF-Protection',
        'X-CSRF-TOKEN',
        'Origin',
        'User-Agent',
        'Cache-Control',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
    ],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

    // Debug mode for CORS - remove in production
    'log_requests' => env('APP_DEBUG', false),

];
