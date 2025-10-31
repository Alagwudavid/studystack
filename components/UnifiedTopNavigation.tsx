"use client";

import {
    ChevronDown,
    AlignLeft,
    HeartHandshake,
    CircleDollarSign,
    PlusSquareIcon,
    AudioWaveform,
    Menu,
    SearchIcon,
    Images,
    Megaphone,
    X,
    Tally2,
    UnfoldHorizontal,
    Telescope,
    Pencil,
    Plus,
    PanelLeftOpen,
    PanelLeftClose,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { SkeletonTopBar } from "@/components/ui/skeleton-topbar";
import { BrandMenu } from "@/components/brand-menu";
import { MainMenu } from "@/components/main-menu";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import NotificationBell from "./NotificationBell";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { useAuth } from "@/contexts/AuthContext";
import { BrandComp } from "./ui/brand";
import { SearchBar } from "@/components/SearchBar";
import { Tooltip } from "./ui/tooltip";
import useAdvancedScroll from "@/hooks/use-advanced-scroll";
import { useScreenSize } from "@/hooks/use-screen-size";

interface UnifiedTopNavigationProps {
    onToggleSidebar?: () => void;
    sidebarVisible?: boolean;
}

export function UnifiedTopNavigation({
    onToggleSidebar,
    sidebarVisible = false
}: UnifiedTopNavigationProps = {}) {
    const { isMobile, showTopNav } = useScreenSize();
    const pathname = usePathname();
    const [currentLanguage, setCurrentLanguage] = useState("us");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const scrollContainerRef = useRef<HTMLElement | null>(null);

    // Use both auth contexts for comprehensive auth state
    const { user: layoutUser, isAuthenticated: layoutAuth, toggleDropdownSidebar } = useLayoutContext();
    const { user: authUser, isAuthenticated: authContextAuth, isLoading } = useAuth();

    // Determine authentication state from both contexts
    // Use AuthContext as primary source of truth, fallback to LayoutContext
    const isAuthenticated = authContextAuth || layoutAuth;
    const user = authUser || layoutUser;

    useEffect(() => {
        // Find the main scrollable container
        scrollContainerRef.current = document.querySelector('main[class*="overflow-y-auto"]');
    }, []);

    // Use advanced scroll hook to control top nav visibility
    const { scrollDirection, isAtTop } = useAdvancedScroll({
        threshold: 50,
        debounceMs: 100,
        scrollContainer: scrollContainerRef.current,
    });

    // Hide top nav when scrolling down (unless at top), show when scrolling up
    const shouldShowTopNav = isAtTop || scrollDirection === 'up' || scrollDirection === 'idle';

    // Show loading state while auth is being determined
    if (isLoading) {
        return (
            // <header className="w-full h-14 px-3 md:px-6 flex items-center justify-between bg-background border-b border-border theme-aware">
            //     <div className="flex items-center gap-2 select-none">
            //         <BrandComp />
            //     </div>
            //     <div className="animate-pulse">
            //         <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            //     </div>
            // </header>
            <span className="h-2 bg-card animate-pulse"></span>
        );
    }

    const menuItems = [
        {
            id: "Home",
            label: "Home",
            icon: (
                <svg
                    className="shrink-0 size-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2.5192 7.82274C2 8.77128 2 9.91549 2 12.2039V13.725C2 17.6258 2 19.5763 3.17157 20.7881C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.7881C22 19.5763 22 17.6258 22 13.725V12.2039C22 9.91549 22 8.77128 21.4808 7.82274C20.9616 6.87421 20.0131 6.28551 18.116 5.10812L16.116 3.86687C14.1106 2.62229 13.1079 2 12 2C10.8921 2 9.88939 2.62229 7.88403 3.86687L5.88403 5.10813C3.98695 6.28551 3.0384 6.87421 2.5192 7.82274ZM9.44661 15.3975C9.11385 15.1508 8.64413 15.2206 8.39747 15.5534C8.15082 15.8862 8.22062 16.3559 8.55339 16.6025C9.5258 17.3233 10.715 17.75 12 17.75C13.285 17.75 14.4742 17.3233 15.4466 16.6025C15.7794 16.3559 15.8492 15.8862 15.6025 15.5534C15.3559 15.2206 14.8862 15.1508 14.5534 15.3975C13.825 15.9373 12.9459 16.25 12 16.25C11.0541 16.25 10.175 15.9373 9.44661 15.3975Z"
                        fill="currentColor"
                    />
                </svg>
            ),
            href: "/home",
            authRequired: true,
        },
        {
            id: "contact-us",
            label: "Contact Us",
            icon: <HeartHandshake className="shrink-0 size-6" />,
            href: "/contact-us",
            authRequired: false,
        },
        {
            id: "notifications-test",
            label: "Activities",
            icon: (
                <svg
                    className="shrink-0 size-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 19V20H3V19L5 17V11C5 7.9 7.03 5.17 10 4.29C10 4.19 10 4.1 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.1 14 4.19 14 4.29C16.97 5.17 19 7.9 19 11V17L21 19ZM12 22C10.9 22 10 21.1 10 20H14C14 21.1 13.1 22 12 22Z"
                        fill="currentColor"
                    />
                </svg>
            ),
            href: "/activities/",
            authRequired: true,
        },
        {
            id: "status",
            label: "Status",
            icon: (
                <svg
                    className="shrink-0 size-6"
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
            authRequired: false,
        },
    ];

    // Filter menu items based on authentication status
    const visibleMenuItems = menuItems.filter(
        (item) => !item.authRequired || isAuthenticated
    );

    return (
        <>
            {/* Only show on mobile/small screens */}
            {showTopNav && isAuthenticated ? (
                <header className={cn(
                    "fixed top-0 left-0 right-0 z-50 w-full max-w-xl mx-auto h-14 px-3 grid grid-cols-[auto_1fr] gap-2 bg-background/80 backdrop-blur-sm theme-aware border-b transition-transform duration-300 ease-in-out",
                    shouldShowTopNav ? "translate-y-0" : "-translate-y-full"
                )}>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="cool"
                            size="sm"
                            onClick={toggleDropdownSidebar}
                            className="text-foreground p-2 h-10 w-10 rounded-full hover:bg-card flex"
                            aria-label="Toggle sidebar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="!size-7">
                                <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                            </svg>
                        </Button>
                        <BrandComp />
                    </div>

                    <div className="flex items-center justify-end gap-2 col-start-2">
                        <div className="flex items-center gap-2">
                            <Link
                                href="/#"
                                className={cn(
                                    "flex items-center w-10 h-10 rounded-full transition-all group relative text-lg p-2 bg-card/70 hover:bg-card text-card-foreground"
                                )}
                            >
                                <div className="relative flex items-center gap-1">
                                    <Plus className="!size-6" />
                                </div>
                            </Link>
                            <Tooltip text="For Business" side="bottom">
                                <Link
                                    href="/#"
                                    className={cn(
                                        "flex items-center w-12 h-10 rounded-lg transition-all group relative text-lg px-3 py-2.5 hover:bg-muted"
                                    )}
                                >
                                    <div className="relative text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.992 17h3m3 0h-3m0 0v-3m0 3v3"></path><path d="M4 9.4V4.6a.6.6 0 0 1 .6-.6h4.8a.6.6 0 0 1 .6.6v4.8a.6.6 0 0 1-.6.6H4.6a.6.6 0 0 1-.6-.6Zm0 10v-4.8a.6.6 0 0 1 .6-.6h4.8a.6.6 0 0 1 .6.6v4.8a.6.6 0 0 1-.6.6H4.6a.6.6 0 0 1-.6-.6Zm10-10V4.6a.6.6 0 0 1 .6-.6h4.8a.6.6 0 0 1 .6.6v4.8a.6.6 0 0 1-.6.6h-4.8a.6.6 0 0 1-.6-.6Z"></path></g></svg>
                                    </div>
                                </Link>
                            </Tooltip>

                            <div className="flex items-center gap-2">
                                <Tooltip text="Activities" side="bottom">
                                    <Link
                                        href="/activities"
                                        className={cn(
                                            "flex items-center w-12 h-10 rounded-lg transition-all group relative text-lg px-3 py-2.5 hover:bg-muted"
                                        )}
                                    >
                                        <div className="relative">
                                            <svg
                                                className="size-6 shrink-0"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 19V20H3V19L5 17V11C5 7.9 7.03 5.17 10 4.29C10 4.19 10 4.1 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.1 14 4.19 14 4.29C16.97 5.17 19 7.9 19 11V17L21 19ZM12 22C10.9 22 10 21.1 10 20H14C14 21.1 13.1 22 12 22Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                            <NotificationBell className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center min-w-[20px]" showCount={true} />
                                        </div>
                                    </Link>
                                </Tooltip>
                                <NotificationBell />
                            </div>
                            <MainMenu />
                        </div>
                    </div>
                </header>
            ) : showTopNav && !isAuthenticated ? (
                <header className={cn(
                    "fixed top-0 left-0 right-0 z-50 w-full h-14 px-3 grid grid-cols-[auto_1fr] gap-2 bg-background/80 backdrop-blur-sm border-b border-border theme-aware transition-transform duration-300 ease-in-out",
                    shouldShowTopNav ? "translate-y-0" : "-translate-y-full"
                )}>
                    <div className="flex items-center gap-3">
                        <BrandComp />
                    </div>

                    <div className="flex items-center justify-end gap-2 col-start-2">
                        <Link href="/auth">
                            <Button variant="default" size="sm">
                                {isMobile ? "Login" : "Sign In"}
                            </Button>
                        </Link>
                    </div>
                </header>
            ) : null}
        </>
    );
    // <header className="w-full mx-auto h-14 px-3 md:px-6 md:hidden grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] gap-2 md:gap-4 bg-background theme-aware border-b">
    //     <div className="flex items-center gap-3">
    //         <Button
    //             variant="cool"
    //             size="sm"
    //             onClick={onToggleSidebar}
    //             className="text-foreground p-2 h-10 w-10 rounded-full hover:bg-card flex"
    //             aria-label="Toggle sidebar"
    //         >
    //             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="!size-7">
    //             <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
    //             </svg>
    //         </Button>
    //         <BrandComp />
    //     </div>

    //     <div className="hidden md:flex items-center justify-center px-2 md:px-4 min-w-0">
    //         <SearchBar className="w-full max-w-md" />
    //     </div>

    //     <div className="flex items-center justify-end gap-2 md:gap-4 col-start-2 md:col-start-3">
    //         <div className="flex items-center gap-2">
    //                 <Link
    //                     href="/#"
    //                     className={cn(
    //                         "flex items-center md:w-fit w-10 h-10 rounded-full transition-all group relative text-lg md:px-3 p-2 bg-card/70 hover:bg-card text-card-foreground"
    //                     )}
    //                 >
    //                     <div className="relative flex items-center gap-1">
    //                         <Plus className="!size-6" />
    //                         <span className="hidden md:flex">Create</span>
    //                     </div>
    //                 </Link>
    //             <Tooltip text="For Business" side="bottom">
    //                 <Link
    //                     href="/#"
    //                     className={cn(
    //                         "flex items-center w-12 h-10 rounded-lg transition-all group relative text-lg px-3 py-2.5 hover:bg-muted"
    //                     )}
    //                 >
    //                     <div className="relative text-primary">
    //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.992 17h3m3 0h-3m0 0v-3m0 3v3"></path><path d="M4 9.4V4.6a.6.6 0 0 1 .6-.6h4.8a.6.6 0 0 1 .6.6v4.8a.6.6 0 0 1-.6.6H4.6a.6.6 0 0 1-.6-.6Zm0 10v-4.8a.6.6 0 0 1 .6-.6h4.8a.6.6 0 0 1 .6.6v4.8a.6.6 0 0 1-.6.6H4.6a.6.6 0 0 1-.6-.6Zm10-10V4.6a.6.6 0 0 1 .6-.6h4.8a.6.6 0 0 1 .6.6v4.8a.6.6 0 0 1-.6.6h-4.8a.6.6 0 0 1-.6-.6Z"></path></g></svg>
    //                     </div>
    //                 </Link>
    //             </Tooltip>

    //             <div className="flex items-center gap-2">
    //                 <Tooltip text="Activities" side="bottom">
    //                     <Link
    //                         href="/activities"
    //                         className={cn(
    //                             "flex items-center w-12 h-10 rounded-lg transition-all group relative text-lg px-3 py-2.5 hover:bg-muted"
    //                         )}
    //                     >
    //                         <div className="relative">
    //                             <svg
    //                                 className="size-6 shrink-0"
    //                                 viewBox="0 0 24 24"
    //                                 fill="none"
    //                                 xmlns="http://www.w3.org/2000/svg"
    //                             >
    //                                 <path
    //                                     d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 19V20H3V19L5 17V11C5 7.9 7.03 5.17 10 4.29C10 4.19 10 4.1 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.1 14 4.19 14 4.29C16.97 5.17 19 7.9 19 11V17L21 19ZM12 22C10.9 22 10 21.1 10 20H14C14 21.1 13.1 22 12 22Z"
    //                                     fill="currentColor"
    //                                 />
    //                             </svg>
    //                             <NotificationBell className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center min-w-[20px]" showCount={true} />
    //                         </div>
    //                     </Link>
    //                 </Tooltip>
    //                 <NotificationBell />
    //             </div>
    //             <MainMenu />
    //         </div>
    //     </div>
    // </header>
}