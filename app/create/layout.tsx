import { Metadata } from "next";
import { requireAuth } from '@/lib/server-auth';
import { ProtectedLayout } from '@/components/layouts/ProtectedLayout';
import CreateTabs from "./CreateTabs";

export const metadata: Metadata = {
    title: "Compose Feed - Bitroot",
    description: "Share your learning progress and connect with learners worldwide. Discover content from the community and track your learning journey.",
    keywords: ["language learning", "progress sharing", "community", "feed", "social learning"],
    openGraph: {
        title: "Compose Feed - Bitroot",
        description: "Share your learning progress and connect with learners worldwide",
        url: "https://bitroot.com.ng/create",
        siteName: "Bitroot",
        images: [
            {
                url: "/og/create-preview.png",
                width: 1200,
                height: 630,
                alt: "Bitroot Compose Feed - The No.1 Learning and Networking Platform",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Compose Feed - Bitroot",
        description: "Share your learning progress and connect with learners worldwide",
        images: ["/og/create-preview.png"],
        creator: "@LegendNGR",
    },
    robots: {
        index: true,
        follow: true,
    },
};

interface CreateLayoutProps {
    children: React.ReactNode;
}

export default async function CreateLayout({ children }: CreateLayoutProps) {
    // Require authentication - will redirect to login if not authenticated
    const { user } = await requireAuth();

    return (
        <ProtectedLayout user={user}>
            <CreateTabs user={user}>
                {children}
            </CreateTabs>
        </ProtectedLayout>
    );
}