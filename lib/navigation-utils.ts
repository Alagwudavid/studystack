/**
 * Navigation utilities for detecting hard reloads vs SPA navigation
 */

/**
 * Clear the navigation history (useful for logout or when you want to force a "fresh start")
 */
export function clearNavigationHistory(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("previousPath");
  }
}

/**
 * Check if the current navigation is a hard reload
 */
export function isHardReload(): boolean {
  if (typeof window === "undefined") return true;

  const previousPath = sessionStorage.getItem("previousPath");
  return !previousPath;
}

/**
 * Store the current path for navigation tracking
 */
export function storeCurrentPath(path: string): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("previousPath", path);
  }
}

/**
 * Get the previous path from session storage
 */
export function getPreviousPath(): string | null {
  if (typeof window === "undefined") return null;

  return sessionStorage.getItem("previousPath");
}
