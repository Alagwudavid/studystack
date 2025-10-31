import * as React from "react";

const TABLET_BREAKPOINT = 1024; // 1024px

export function useIsTablet() {
  const [mounted, setMounted] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState<boolean>(
    typeof window !== "undefined"
      ? window.innerWidth < TABLET_BREAKPOINT
      : false // SSR fallback
  );

  React.useEffect(() => {
    setMounted(true);
    const onChange = () => {
      setIsTablet(window.innerWidth < TABLET_BREAKPOINT);
    };
    window.addEventListener("resize", onChange);
    // Set initial value again in case of hydration mismatch
    setIsTablet(window.innerWidth < TABLET_BREAKPOINT);
    return () => window.removeEventListener("resize", onChange);
  }, []);

  // Return undefined during SSR or before mount to prevent hydration mismatch
  if (!mounted) {
    return undefined;
  }

  return isTablet;
}
