import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Authentication - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: "Verify account to continue.",
  generator: "Techgators",
  metadataBase: new URL(
    "https://bitroot.com.ng/"
  ),
  openGraph: {
    title: `Authentication - ${process.env.NEXT_PUBLIC_APP_NAME}`,
    description: "Verify account to continue.",
    url: "https://bitroot.com.ng/",
    siteName: "Bitroot",
    images: [
      {
        url: "/og/icon.png",
        width: 1200,
        height: 630,
        alt: "Bitroot App Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Authentication - ${process.env.NEXT_PUBLIC_APP_NAME}`,
    description: "Learn and network with peers.",
    images: ["/og/icon.png"],
    creator: "@LegendNGR",
  },
};


export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
