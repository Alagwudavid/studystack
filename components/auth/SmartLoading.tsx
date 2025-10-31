"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PostLoginLoading } from "./PostLoginLoading";

interface SmartLoadingProps {
  children: React.ReactNode;
}

export function SmartLoading({ children }: SmartLoadingProps) {
  const [isHardReload, setIsHardReload] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Remove stale previous path after 5 minutes
    const lastUpdate = sessionStorage.getItem("lastPathUpdate");
    const now = Date.now();
    if (lastUpdate && now - parseInt(lastUpdate) > 300000) {
      sessionStorage.removeItem("previousPath");
    }

    // Check if this is a hard reload
    const hasPreviousPath = sessionStorage.getItem("previousPath");
    setIsHardReload(!hasPreviousPath);

    // Store current path + timestamp
    sessionStorage.setItem("previousPath", pathname);
    sessionStorage.setItem("lastPathUpdate", now.toString());
  }, [pathname]);

  // Loader is shown only when it's a hard reload and auth is still checking
  const showLoader = isHardReload && authLoading;

  if (showLoader) {
    return <PostLoginLoading message="Checking authentication..." />;
  }

  return <>{children}</>;
}
