import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Company - Bitroot",
    description: "Join language communities and connect with native speakers and learners from around the world. Discover trending communities and engage with fellow language enthusiasts.",
    keywords: ["language communities", "native speakers", "language exchange", "community", "language learning groups"],
    openGraph: {
        title: "Company - Bitroot",
        description: "Join language communities and connect with native speakers and learners from around the world",
        url: "https://bitroot.com.ng/community",
        siteName: "Bitroot",
        images: [
            {
                url: "/og/community-preview.png",
                width: 1200,
                height: 630,
                alt: "Bitroot Company - Connect with Learners",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Company - Bitroot",
        description: "Join language communities and connect with native speakers and learners from around the world",
        images: ["/og/community-preview.png"],
        creator: "@LegendNGR",
    },
    robots: {
        index: true,
        follow: true,
    },
};

interface CompanyLayoutProps {
    children: React.ReactNode;
}

export default function CompanyLayout({ children }: CompanyLayoutProps) {
    return (
        <>
            {children}
        </>
    );
}
