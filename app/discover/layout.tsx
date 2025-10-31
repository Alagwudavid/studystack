import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Explore Feed - Bitroot",
    description: "Share your learning progress and connect with learners worldwide. Discover content from the community and track your learning journey.",
    keywords: ["language learning", "progress sharing", "community", "feed", "social learning"],
    openGraph: {
        title: "Explore Feed - Bitroot",
        description: "Share your learning progress and connect with learners worldwide",
        url: "https://bitroot.com.ng/explore",
        siteName: "Bitroot",
        images: [
            {
                url: "/og/explore-preview.png",
                width: 1200,
                height: 630,
                alt: "Bitroot Explore Feed - The No.1 Learning and Networking Platform",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Explore Feed - Bitroot",
        description: "Share your learning progress and connect with learners worldwide",
        images: ["/og/explore-preview.png"],
        creator: "@LegendNGR",
    },
    robots: {
        index: true,
        follow: true,
    },
};

interface ExploreLayoutProps {
    children: React.ReactNode;
}

export default function ExploreLayout({ children }: ExploreLayoutProps) {
    return (
        <>
            {children}
        </>
    );
}
