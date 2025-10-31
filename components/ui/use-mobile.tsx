import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [mounted, setMounted] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState<boolean>(false); // Always start with false for SSR

  React.useEffect(() => {
    setMounted(true);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    window.addEventListener("resize", onChange);
    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => window.removeEventListener("resize", onChange);
  }, []);

  // Always return a boolean to prevent hydration mismatches
  return mounted ? isMobile : false;
}
