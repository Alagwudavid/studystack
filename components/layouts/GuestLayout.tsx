"use client";

import { TopNavigation } from "@/components/top-navigation";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BottomWidget } from "../BottomWidget";
import { useScreenSize } from "@/hooks/use-screen-size";

interface GuestLayoutProps {
  children: React.ReactNode;
}

export function GuestLayout({ children }: GuestLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  // const { showTopNav } = useScreenSize();
  const router = useRouter();

  // Check for authentication and redirect if user is authenticated
  useEffect(() => {
    // Only redirect if we're not loading and user is actually authenticated
    if (!isLoading && isAuthenticated) {
      router.push('/home');
    }
  }, [isAuthenticated, isLoading, router]);

  // If user is authenticated, don't render content (will redirect)
  if (!isLoading && isAuthenticated) {
    return null;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  return (
    <LayoutProvider user={null}>
      <div className="min-h-screen flex flex-col bg-background relative pb-10">
        {/* TopNav: show on mobile (below md), hide on tablet+ (above md) */}
          <div>
            <TopNavigation />
          </div>
        {/* Main Content */}
        <main className={`flex-1 pt-14`}>{children}</main>
        <BottomWidget className="absolute bottom-0 left-0 right-0" />
      </div>
    </LayoutProvider>
  );
}
