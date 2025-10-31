import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import GlobalNotificationHandler from "@/components/GlobalNotificationHandler";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} Web`,
  description: "Learn and network with peers.",
  generator: "Techgators",
  metadataBase: new URL("https://bitroot.com.ng/"),
  openGraph: {
    title: `${process.env.NEXT_PUBLIC_APP_NAME} Web`,
    description: "Learn and network with peers.",
    url: "https://bitroot.com.ng/",
    siteName: `${process.env.NEXT_PUBLIC_APP_NAME}`,
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
    title: `${process.env.NEXT_PUBLIC_APP_NAME} Web`,
    description: "Learn and network with peers.",
    images: ["/og/icon.png"],
    creator: "@LegendNGR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/assets/css/main.css" />
      </head>
      <body className="min-h-screen">
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
              <WebSocketProvider>
                <SearchProvider>
                  {children}
                  <GlobalNotificationHandler />
                  <Toaster position="top-right" richColors />
                </SearchProvider>
              </WebSocketProvider>
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
