import type { Metadata } from "next";
import { GuestLayout } from "@/components/layouts/GuestLayout";

export const metadata: Metadata = {
  title: "Coming Soon - Bitroot",
  description:
    "We're cooking something amazing. Stay tuned for the launch of Bitroot - where language takes root and culture comes alive.",
  keywords: ["coming soon", "launch", "language learning", "culture"],
  openGraph: {
    title: "Coming Soon - Bitroot",
    description:
      "We're cooking something amazing. Stay tuned for the launch of Bitroot.",
    url: "https://bitroot.com.ng/coming-soon",
    siteName: "Bitroot",
    images: [
      {
        url: "/og/coming-soon-preview.png",
        width: 1200,
        height: 630,
        alt: "Bitroot Coming Soon - Language Learning Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coming Soon - Bitroot",
    description:
      "We're cooking something amazing. Stay tuned for the launch of Bitroot.",
    images: ["/og/coming-soon-preview.png"],
    creator: "@LegendNGR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface ComingSoonLayoutProps {
  children: React.ReactNode;
}

export default function ComingSoonLayout({ children }: ComingSoonLayoutProps) {
  return <GuestLayout>{children}</GuestLayout>;
}
