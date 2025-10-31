/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    emotion: true,
  },
  images: {
    unoptimized: true,
    domains: ['bitroot.com.ng', 'api.bitroot.com.ng'],
  },
  async rewrites() {
    return [
      {
        source: '/@:username',
        destination: '/users/:username',
      },
      {
        source: '/@:username/:path*',
        destination: '/users/:username/:path*',
      },
    ]
  },
  // Security headers for production
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          {
            key: 'Content-Security-Policy',
            value: isDevelopment
              ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http://localhost:8000 http://127.0.0.1:8000 http://localhost:8000/storage http://127.0.0.1:8000/storage; font-src 'self' data:; connect-src 'self' ws://localhost:8081 wss://localhost:8081 http://localhost:8000 http://127.0.0.1:8000 https://api.bitroot.com.ng https://lpkchwfxhawgankunodn.supabase.co https://api.ipify.org https://ipapi.co; frame-ancestors 'none';"
              : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https://assets.bitroot.com.ng http://localhost:8000 http://127.0.0.1:8000 http://localhost:8000/storage http://127.0.0.1:8000/storage; font-src 'self' data:; connect-src 'self' wss://api.bitroot.com.ng https://api.bitroot.com.ng https://lpkchwfxhawgankunodn.supabase.co https://api.ipify.org https://ipapi.co; frame-ancestors 'none';"
          }
        ]
      }
    ]
  },
  // Environment-specific configuration
  env: {
    CUSTOM_DOMAIN: process.env.NODE_ENV === 'production' ? 'bitroot.com.ng' : 'localhost:3000',
    API_DOMAIN: process.env.NODE_ENV === 'production' ? 'api.bitroot.com.ng' : 'localhost:8000',
  }
}

export default nextConfig
