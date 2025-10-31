import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Channels - Bitroot",
  description:
    "Discover and join language learning channels. Connect with communities focused on specific languages and learning goals.",
  keywords: [
    "language learning",
    "channels",
    "communities",
    "language groups",
    "learning communities",
  ],
  openGraph: {
    title: "Channels - Bitroot",
    description:
      "Discover and join language learning channels. Connect with communities focused on specific languages and learning goals.",
    url: "https://bitroot.com.ng/channels",
    siteName: "Bitroot",
    images: [
      {
        url: "/og/channels-preview.png",
        width: 1200,
        height: 630,
        alt: "Bitroot Channels - Language Learning Communities",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Channels - Bitroot",
    description:
      "Discover and join language learning channels. Connect with communities focused on specific languages and learning goals.",
    images: ["/og/channels-preview.png"],
    creator: "@LegendNGR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface ChannelsLayoutProps {
  children: React.ReactNode;
}

export default function ChannelsLayout({ children }: ChannelsLayoutProps) {
  return <>{children}</>;
}
