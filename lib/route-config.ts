// Route configuration for authentication
export const ROUTE_CONFIG = {
  // Public routes that don't require authentication
  PUBLIC_ROUTES: ["/", "/coming-soon", "/contact-us", "/auth", "/auth-test"],

  // Protected routes that require authentication
  PROTECTED_ROUTES: [
    "/home",
    "/profile",
    "/u",
    "/settings",
    "/activities",
    "/learn",
    "/temporary",
  ],

  // Auth routes that should redirect authenticated users
  AUTH_ROUTES: ["/auth", "/login-success"],
} as const;

/**
 * Check if a route is public (doesn't require authentication)
 */
export function isPublicRoute(pathname: string): boolean {
  return ROUTE_CONFIG.PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

/**
 * Check if a route is protected (requires authentication)
 */
export function isProtectedRoute(pathname: string): boolean {
  return ROUTE_CONFIG.PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

/**
 * Check if a route is an auth route (login, register, etc.)
 */
export function isAuthRoute(pathname: string): boolean {
  return ROUTE_CONFIG.AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}
