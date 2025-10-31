"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface LoginResponse {
  success: boolean;
  data?: {
    user: any;
    token: string;
  };
  message?: string;
}

interface RequestCodeResponse {
  success: boolean;
  message?: string;
  code_reused?: boolean;
  expires_at?: string;
  magic_token?: string;
  debug?: any;
}

/**
 * Server action to handle login and set HTTP-only cookies
 */
export async function serverLogin(
  email: string,
  code: string,
  keepSignedIn: boolean = false
) {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    const response = await fetch(`${apiUrl}/auth/verify-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest", // CSRF protection
        "X-CSRF-Protection": "1", // Additional CSRF protection
      },
      body: JSON.stringify({ email, code, keepSignedIn }),
    });

    const data: LoginResponse = await response.json();

    if (data.success && data.data) {
      const cookieStore = await cookies();

      // Calculate cookie maxAge based on keepSignedIn preference
      const maxAge = keepSignedIn
        ? 60 * 60 * 24 * 30 // 30 days
        : 60 * 60 * 24 * 7; // 7 days

      // Extract auth_token and set it manually since fetch from server actions
      // doesn't automatically forward Set-Cookie headers to the browser
      const setCookieHeaders = response.headers.getSetCookie?.() || [response.headers.get('set-cookie')].filter(Boolean);

      let authToken = null;

      // Try to get auth token from Set-Cookie headers first
      if (setCookieHeaders.length > 0) {
        for (const cookieHeader of setCookieHeaders) {
          const authTokenMatch = cookieHeader.match(/auth_token=([^;]+)/);
          if (authTokenMatch && authTokenMatch[1]) {
            authToken = authTokenMatch[1];
            break;
          }
        }
      }

      // Fallback: get token from response body
      if (!authToken && data.data.token) {
        authToken = data.data.token;
      }

      if (authToken) {
        // Set the auth_token cookie manually in the server action (httpOnly for server auth)
        cookieStore.set('auth_token', authToken, {
          maxAge: maxAge,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });

        // Also set a client-accessible token for API requests
        cookieStore.set('client_auth_token', authToken, {
          maxAge: maxAge,
          httpOnly: false, // Client needs to read this
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
      }

      // Check if it's a new user and redirect to onboarding
      if (data.data.user.is_new_user) {
        // For new users, redirect to onboarding flow
        redirect("/onboarding");
      } else {
        // For existing users, redirect directly to home (like magic link does)
        // This avoids the intermediate /login-success redirect that can cause auth sync issues
        redirect("/home");
      }
    }

    return { success: false, message: data.message || "Login failed" };
  } catch (error) {
    // Check if this is a Next.js redirect (expected behavior)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      // This is expected when redirect() is called - let it propagate
      throw error;
    }
    console.error("Server login error:", error);
    return { success: false, message: "An error occurred during login" };
  }
}

/**
 * Server action to handle logout and clear cookies
 */
export async function serverLogout() {
  try {
    const cookieStore = await cookies();

    // Get current token for API logout
    const authToken = cookieStore.get("auth_token");

    if (authToken?.value) {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

        // Call enhanced logout API that destroys sessions and clears tokens
        const response = await fetch(`${apiUrl}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken.value}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-Protection": "1",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Backend logout successful:", data.message);
        }
      } catch (error) {
        console.error("API logout error:", error);
        // Continue with local logout even if API fails
      }
    }

    // Clear authentication cookies
    cookieStore.delete("auth_token");
    cookieStore.delete("client_auth_token");
    cookieStore.delete("session_token");
    cookieStore.delete("csrf_token");

    // Immediate redirect to auth page
    redirect("/auth");
  } catch (error) {
    // Check if this is a Next.js redirect (expected behavior)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      // This is expected when redirect() is called - let it propagate
      throw error;
    }
    console.error("Server logout error:", error);

    // Force cleanup and redirect even on error
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("client_auth_token");
    cookieStore.delete("session_token");
    cookieStore.delete("csrf_token");

    redirect("/auth");
  }
}

/**
 * Server action to request verification code
 */
export async function serverRequestCode(email: string): Promise<RequestCodeResponse> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    const response = await fetch(`${apiUrl}/auth/request-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest", // CSRF protection
        "X-CSRF-Protection": "1", // Additional CSRF protection
      },
      body: JSON.stringify({ email }),
    });

    const data: RequestCodeResponse = await response.json();
    return {
      success: data.success,
      message: data.message,
      code_reused: data.code_reused,
      expires_at: data.expires_at,
      magic_token: data.magic_token
    };
  } catch (error) {
    console.error("Server request code error:", error);
    return { success: false, message: "Failed to send verification code" };
  }
}
