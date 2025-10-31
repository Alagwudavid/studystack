import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Search - Bitroot",
    description: "Join language communities and connect with native speakers and learners from around the world. Discover trending communities and engage with fellow language enthusiasts.",
    keywords: ["language communities", "native speakers", "language exchange", "search", "language learning groups"],
    openGraph: {
        title: "Search - Bitroot",
        description: "Join language communities and connect with native speakers and learners from around the world",
        url: "https://bitroot.com.ng/search",
        siteName: "Bitroot",
        images: [
            {
                url: "/og/search-preview.png",
                width: 1200,
                height: 630,
                alt: "Bitroot Language Search - Connect with Learners",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Search - Bitroot",
        description: "Join language communities and connect with native speakers and learners from around the world",
        images: ["/og/search-preview.png"],
        creator: "@LegendNGR",
    },
    robots: {
        index: true,
        follow: true,
    },
};

interface SearchLayoutProps {
    children: React.ReactNode;
}

export default function SearchLayout({ children }: SearchLayoutProps) {
    return (
        <>
            {children}
        </>
    );
}
