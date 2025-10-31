"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PostLoginLoading } from "@/components/auth/PostLoginLoading";
import { getPostLoginRedirectUrl } from "@/lib/fallback-url";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginSuccessPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { refreshProfile } = useAuth();

  useEffect(() => {
    const handleAuthSync = async () => {
      try {
        // First, try to sync auth token from cookies using the sync endpoint
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        await fetch(`${backendUrl}/auth/sync-token`, {
          method: 'POST',
          credentials: 'include',
        });

        // Then refresh auth state to ensure everything is in sync
        await refreshProfile();

        // Wait a bit to ensure auth state is properly updated
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsLoading(false);

        // Get the appropriate redirect URL (fallback URL or /home)
        const redirectUrl = getPostLoginRedirectUrl();

        console.log("🔄 Redirecting to:", redirectUrl);
        router.push(redirectUrl);
      } catch (error) {
        console.error("Auth sync error:", error);
        // If auth sync fails, redirect to auth page
        router.push('/auth');
      }
    };

    handleAuthSync();
  }, [router, refreshProfile]);

  if (isLoading) {
    return (
      <PostLoginLoading message="Welcome back! Setting up your dashboard..." />
    );
  }

  return null;
}
