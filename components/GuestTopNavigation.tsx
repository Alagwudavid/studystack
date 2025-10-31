"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandMenu } from "@/components/brand-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlignLeft, HeartHandshake } from "lucide-react";
import { useState } from "react";
// import { MobileSidebar } from "@/components/mobile-sidebar";

export function GuestTopNavigation() {
    const isMobile = useIsMobile();
    // const [sidebarOpen, setSidebarOpen] = useState(false);

    const guestMenuItems = [
        {
            id: "contact-us",
            label: "Contact Us",
            icon: <HeartHandshake className="shrink-0 !size-6" />,
            href: "/contact-us",
        },
        {
            id: "status",
            label: "Status",
            icon: (
                <svg
                    className="shrink-0 !size-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12.437 13C13.437 12 14.437 11.6046 14.437 10.5C14.437 9.39543 13.5416 8.5 12.437 8.5C11.5051 8.5 10.722 9.13739 10.5 10M12.437 16H12.447M8.4 19C5.41766 19 3 16.6044 3 13.6493C3 11.2001 4.8 8.9375 7.5 8.5C8.34694 6.48637 10.3514 5 12.6893 5C15.684 5 18.1317 7.32251 18.3 10.25C19.8893 10.9449 21 12.6503 21 14.4969C21 16.9839 18.9853 19 16.5 19L8.4 19Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            href: "/coming-soon",
        },
    ];

    return (
        <>
            {/* <MobileSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            /> */}
            {isMobile ? (
                // Mobile layout
                <header className="fixed top-0 z-40 w-full h-14 px-6 grid grid-cols-[auto_1fr_auto] gap-1 bg-background/80 backdrop-blur-sm border-b border-border theme-aware">
                    <div className="flex items-center">
                        {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSidebarOpen(true)}
                            className="text-gray-600 dark:text-[#fafafa] hover:bg-gray-100 dark:hover:bg-gray-800 px-2"
                        >
                            <AlignLeft className="shrink-0 !size-8" />
                        </Button> */}
                        <BrandMenu />
                    </div>
                    <div></div>
                    <div className="flex items-center justify-end gap-2">
                        {guestMenuItems.map((item) => (
                            <Link key={item.id} href={item.href}>
                                <Button variant="ghost" size="sm" className="p-2">
                                    {item.icon}
                                </Button>
                            </Link>
                        ))}
                        <Link href="/auth">
                            <Button variant="default" size="sm">
                                Login
                            </Button>
                        </Link>
                    </div>
                </header>
            ) : (
                // Desktop layout
                <header className="fixed top-0 z-40 w-full h-14 px-8 flex items-center justify-between theme-aware bg-background/80 backdrop-blur-sm border-b border-border">
                    <div className="flex items-center">
                        <BrandMenu />
                    </div>

                    {/* Center navigation for larger screens */}
                    <nav className="flex items-center gap-4">
                        {guestMenuItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 dark:text-[#fafafa]/70 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                            >
                                {item.icon}
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link href="/auth">
                            <Button variant="default" size="sm">
                                Login
                            </Button>
                        </Link>
                    </div>
                </header>
            )}
        </>
    );
}