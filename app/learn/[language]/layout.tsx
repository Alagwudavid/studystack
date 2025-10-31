import type { Metadata } from "next";

export async function generateMetadata({
    params
}: {
    params: Promise<{ language: string }>
}): Promise<Metadata> {
    const { language } = await params;
    const capitalizedLang = language.charAt(0).toUpperCase() + language.slice(1);

    return {
        title: `Learn ${capitalizedLang} - Bitroot`,
        description: `Master ${capitalizedLang} with interactive lessons, games, and community support. Start your ${capitalizedLang} learning journey with structured courses and AI assistance.`,
        keywords: [`learn ${language}`, `${language} lessons`, `${language} course`, "language learning", "interactive lessons"],
        openGraph: {
            title: `Learn ${capitalizedLang} - Bitroot`,
            description: `Master ${capitalizedLang} with interactive lessons, games, and community support`,
            url: `https://bitroot.com.ng/learn/${language}`,
            siteName: "Bitroot",
            images: [
                {
                    url: `/og/learn-${language}-preview.png`,
                    width: 1200,
                    height: 630,
                    alt: `Learn ${capitalizedLang} on Bitroot`,
                },
            ],
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `Learn ${capitalizedLang} - Bitroot`,
            description: `Master ${capitalizedLang} with interactive lessons and community support`,
            images: [`/og/learn-${language}-preview.png`],
            creator: "@LegendNGR",
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

interface LearnLanguageLayoutProps {
    children: React.ReactNode;
}

export default function LearnLanguageLayout({ children }: LearnLanguageLayoutProps) {
    return (
        <>
            {children}
        </>
    );
}
