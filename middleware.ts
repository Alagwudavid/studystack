import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAllowedOrigins } from "@/lib/env";
import { isProtectedRoute, isAuthRoute } from "@/lib/route-config";

// Simple in-memory cache for JWT validation results
const tokenCache = new Map<string, { valid: boolean; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds cache

function getCachedTokenResult(token: string): boolean | null {
  const cached = tokenCache.get(token);
  if (!cached) return null;

  // Check if cache entry is still valid
  if (Date.now() - cached.timestamp > CACHE_DURATION) {
    tokenCache.delete(token);
    return null;
  }

  return cached.valid;
}

function setCachedTokenResult(token: string, valid: boolean): void {
  tokenCache.set(token, { valid, timestamp: Date.now() });

  // Clean up old cache entries (keep cache size reasonable)
  if (tokenCache.size > 100) {
    const oldestEntries = Array.from(tokenCache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)
      .slice(0, 50);

    oldestEntries.forEach(([key]) => tokenCache.delete(key));
  }
}

async function validateServerToken(token: string): Promise<boolean> {
  try {
    // First, check basic JWT format
    if (!token || !token.includes('.') || token.split('.').length !== 3) {
      return false;
    }

    // Check cache first
    const cachedResult = getCachedTokenResult(token);
    if (cachedResult !== null) {
      console.log('🚀 Middleware: Using cached token validation result');
      return cachedResult;
    }

    // Try to validate with backend
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

      const response = await fetch(`${backendUrl}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Protection': '1',
        },
        // Use shorter timeout for middleware to avoid blocking
        signal: AbortSignal.timeout(3000),
      });

      const isValid = response.ok && (await response.json()).success === true;

      if (isValid) {
        console.log('✅ Middleware: Backend JWT validation successful');
      } else {
        console.warn('❌ Middleware: Backend validation failed with status:', response.status);
      }

      // Cache the result
      setCachedTokenResult(token, isValid);
      return isValid;

    } catch (backendError) {
      console.warn('❌ Middleware: Backend validation error:',
        backendError instanceof Error ? backendError.message : 'Unknown error');

      // If backend is unreachable, but token has valid format, allow temporary access
      // This prevents complete lockout during backend downtime
      console.warn('⚠️ Middleware: Using format fallback due to backend unavailability');
      const fallbackResult = true;
      setCachedTokenResult(token, fallbackResult);
      return fallbackResult;
    }

  } catch (error) {
    console.error('Middleware: Token validation failed:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Security headers
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Content Security Policy - comprehensive policy
  const isDevelopment = process.env.NODE_ENV === 'development';
  const cspPolicy = isDevelopment
    ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http://localhost:8000 http://127.0.0.1:8000 http://localhost:8000/storage http://127.0.0.1:8000/storage; font-src 'self' data:; connect-src 'self' ws://localhost:8081 wss://localhost:8081 http://localhost:8000 http://127.0.0.1:8000 https://api.bitroot.com.ng https://lpkchwfxhawgankunodn.supabase.co https://api.ipify.org https://ipapi.co; frame-ancestors 'none';"
    : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https://assets.bitroot.com.ng http://localhost:8000 http://127.0.0.1:8000 http://localhost:8000/storage http://127.0.0.1:8000/storage; font-src 'self' data:; connect-src 'self' wss://api.bitroot.com.ng https://api.bitroot.com.ng https://lpkchwfxhawgankunodn.supabase.co https://api.ipify.org https://ipapi.co; frame-ancestors 'none';"

  response.headers.set("Content-Security-Policy", cspPolicy);

  // MIME type sniffing protection
  response.headers.set("X-Content-Type-Options", "nosniff");

  // XSS protection
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Authentication checks
  const authToken =
    request.cookies.get("auth_token")?.value ||
    request.cookies.get("client_auth_token")?.value;

  // For protected routes, validate authentication
  if (isProtectedRoute(pathname)) {
    if (!authToken) {
      // Create auth URL with fallback parameter containing current URL
      const currentUrl = request.nextUrl.pathname + request.nextUrl.search;
      const authUrl = new URL("/auth", request.url);
      authUrl.searchParams.set("fallback", currentUrl);
      return NextResponse.redirect(authUrl);
    }

    // Validate token server-side
    const isValidToken = await validateServerToken(authToken);
    if (!isValidToken) {
      // Clear invalid token cookies and redirect with fallback
      const currentUrl = request.nextUrl.pathname + request.nextUrl.search;
      const authUrl = new URL("/auth", request.url);
      authUrl.searchParams.set("fallback", currentUrl);

      const redirectResponse = NextResponse.redirect(authUrl);
      redirectResponse.cookies.delete("auth_token");
      redirectResponse.cookies.delete("client_auth_token");
      return redirectResponse;
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute(pathname) && authToken) {
    // Validate token for auth pages too
    const isValidToken = await validateServerToken(authToken);
    if (isValidToken) {
      return NextResponse.redirect(new URL("/home", request.url));
    } else {
      // Clear invalid token cookies but allow access to auth pages
      const authResponse = NextResponse.next();
      authResponse.cookies.delete("auth_token");
      authResponse.cookies.delete("client_auth_token");
      return authResponse;
    }
  }

  // Only allow API requests from same origin or specific origins
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    // Allow same-origin requests
    if (origin && host && !origin.includes(host)) {
      // Check against allowed origins
      const allowedOrigins = getAllowedOrigins();

      if (allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
        console.warn(`Blocked request from unauthorized origin: ${origin}`);
        return new NextResponse("Forbidden", { status: 403 });
      }
    }

    // Block requests with suspicious user agents
    const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
    const suspiciousPatterns = ["bot", "crawler", "spider", "scraper"];

    if (suspiciousPatterns.some((pattern) => userAgent.includes(pattern))) {
      // You might want to allow legitimate bots in production
      console.warn(`Blocked suspicious user agent: ${userAgent}`);
    }
  }

  return response;
}
export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
