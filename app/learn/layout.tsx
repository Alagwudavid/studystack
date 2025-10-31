import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Learn Languages - Bitroot",
    description: "Start your language learning journey with structured courses, interactive lessons, and AI-powered assistance. Master new languages at your own pace.",
    keywords: ["language learning", "courses", "lessons", "structured learning", "AI assistance", "language courses"],
    openGraph: {
        title: "Learn Languages - Bitroot",
        description: "Start your language learning journey with structured courses, interactive lessons, and AI-powered assistance",
        url: "https://bitroot.com.ng/learn",
        siteName: "Bitroot",
        images: [
            {
                url: "/og/learn-preview.png",
                width: 1200,
                height: 630,
                alt: "Bitroot Learn - Language Learning Courses",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Learn Languages - Bitroot",
        description: "Start your language learning journey with structured courses, interactive lessons, and AI-powered assistance",
        images: ["/og/learn-preview.png"],
        creator: "@LegendNGR",
    },
    robots: {
        index: true,
        follow: true,
    },
};

interface LearnLayoutProps {
    children: React.ReactNode;
}

export default function LearnLayout({ children }: LearnLayoutProps) {
    return (
        <>
            {children}
        </>
    );
}
