// "use client";

// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import { PostLoginLoading } from "./PostLoginLoading";

// interface RouteBasedLoadingProps {
//   children: React.ReactNode;
// }

// export function RouteBasedLoading({ children }: RouteBasedLoadingProps) {
//   const [showLoader, setShowLoader] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     // Skip loading for auth-related pages
//     if (pathname.includes('/login') || pathname.includes('/login-success')) {
//       return;
//     }

//     if (typeof window === "undefined") return;

//     // Check for hard reload only once when component mounts
//     const checkHardReload = () => {
//       const now = Date.now();
//       const lastUpdate = sessionStorage.getItem("lastPathUpdate");
//       const lastPath = sessionStorage.getItem("previousPath");

//       // Clear stale data (older than 5 mins)
//       if (lastUpdate && now - parseInt(lastUpdate) > 300000) {
//         sessionStorage.removeItem("previousPath");
//         sessionStorage.removeItem("lastPathUpdate");
//       }

//       // Hard reload detection: no previous path OR different domain/tab
//       const isHardReload = !lastPath || !lastUpdate;
      
//       console.log("RouteBasedLoading check:", {
//         pathname,
//         isHardReload,
//         lastPath,
//         lastUpdate
//       });

//       if (isHardReload) {
//         setShowLoader(true);
        
//         // Show loader briefly
//         setTimeout(() => {
//           setShowLoader(false);
//         }, 500);
//       }

//       // Always update storage
//       sessionStorage.setItem("previousPath", pathname);
//       sessionStorage.setItem("lastPathUpdate", now.toString());
//     };

//     // Only check on mount, not on every pathname change
//     checkHardReload();
//   }, []); // Empty dependency array - only run on mount

//   // Update path on navigation without showing loader
//   useEffect(() => {
//     if (typeof window !== "undefined" && !showLoader) {
//       sessionStorage.setItem("previousPath", pathname);
//       sessionStorage.setItem("lastPathUpdate", Date.now().toString());
//     }
//   }, [pathname, showLoader]);

//   if (showLoader) {
//     return <PostLoginLoading message="Loading..." />;
//   }

//   return <>{children}</>;
// }
