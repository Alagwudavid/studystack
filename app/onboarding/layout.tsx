import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/server-auth";
import { shouldRedirectToOnboarding } from "@/lib/onboarding-utils";

export default async function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Check if user is authenticated
    const auth = await getServerAuth();

    if (!auth) {
        // Redirect to auth page if not authenticated
        redirect("/auth");
    }

    // If user has already completed or skipped onboarding, redirect them away
    if (!shouldRedirectToOnboarding(auth.user)) {
        // User has completed onboarding, redirect to home
        redirect("/home");
    }

    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
}