import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Post - Bitroot",
    description: "Share your learning progress and connect with learners worldwide. Discover content from the community and track your learning journey.",
    keywords: ["language learning", "progress sharing", "community", "feed", "social learning"],
    openGraph: {
        title: "Post - Bitroot",
        description: "Share your learning progress and connect with learners worldwide",
        url: "https://bitroot.com.ng/home",
        siteName: "Bitroot",
        images: [
            {
                url: "/og/home-preview.png",
                width: 1200,
                height: 630,
                alt: "Bitroot Post - The No.1 Learning and Networking Platform",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Post - Bitroot",
        description: "Share your learning progress and connect with learners worldwide",
        images: ["/og/home-preview.png"],
        creator: "@LegendNGR",
    },
    robots: {
        index: true,
        follow: true,
    },
};

interface PostLayoutProps {
    children: React.ReactNode;
}

export default function PostLayout({ children }: PostLayoutProps) {
    return (
        <>
            {children}
        </>
    );
}