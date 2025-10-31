import { getServerAuth } from "@/lib/server-auth";
import { isProtectedRoute, isPublicRoute } from "@/lib/route-config";
import { redirect } from "next/navigation";
import { GuestLayout } from "./GuestLayout";
import { ServerProtectedLayout } from "./ServerProtectedLayout";

interface RootLayoutWrapperProps {
  children: React.ReactNode;
  pathname: string;
}

export async function RootLayoutWrapper({
  children,
  pathname,
}: RootLayoutWrapperProps) {
  // Check if user is authenticated
  const auth = await getServerAuth();

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!auth) {
      // Redirect to login if not authenticated
      redirect("/auth");
    }

    // Use protected layout for authenticated users
    return <ServerProtectedLayout>{children}</ServerProtectedLayout>;
  }

  // Handle public routes
  if (isPublicRoute(pathname)) {
    // Use guest layout for public routes
    return <GuestLayout>{children}</GuestLayout>;
  }

  // Default fallback - use guest layout
  return <GuestLayout>{children}</GuestLayout>;
}
