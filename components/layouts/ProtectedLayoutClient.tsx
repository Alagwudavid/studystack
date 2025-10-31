"use client";

import { BottomNav } from "@/components/bottom-nav";
import { TopNavigation } from "@/components/top-navigation";
import { AsideBar } from "@/components/aside-bar";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useScreenSize } from "@/hooks/use-screen-size";

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  profile_image: string | null;
  bio: string | null;
  points: number;
  level: number;
  streak_count: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

interface ProtectedLayoutClientProps {
  children: React.ReactNode;
  user: User;
  token: string;
}

/**
 * Client-side protected layout that receives pre-authenticated user data
 * No loading state - user is already authenticated by server
 */
export function ProtectedLayoutClient({
  children,
  user,
  token,
}: ProtectedLayoutClientProps) {
  const { setServerUser } = useAuth();
  const { showTopNav } = useScreenSize();

  useEffect(() => {
    // Set the user data and token from server in the client context
    if (user && setServerUser) {
      setServerUser(user, token);
    }
  }, [user, token, setServerUser]);

  return (
    <LayoutProvider user={user}>
      <div className="flex h-screen bg-background text-foreground theme-aware overflow-hidden relative">
        {/* TopNav: show on mobile (below md), hide on tablet+ (above md) */}
        {showTopNav && (
          <div>
            <TopNavigation />
          </div>
        )}
        <div className="flex-1 flex h-screen overflow-hidden overflow-y-auto w-full container">
          <main className="flex-1 p-2">
            {showTopNav && <div className="h-16 w-full shrink-0 bg-transparent border-0"></div>}
            {children}
            <div className="h-16 w-full shrink-0 bg-transparent border-0 md:hidden flex"></div>
          </main>
          {/* <AsideBar /> */}
        </div>
        <BottomNav />
      </div>
    </LayoutProvider>
  );
}
