"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  MoreHorizontal,
  UsersRound,
  PlusSquare,
  Telescope,
  SquarePlay,
  AudioWaveform,
  Megaphone,
  Star,
  Plus,
  Play,
  MessageCircle,
  BriefcaseBusiness,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { MainMenu } from "@/components/main-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAdvancedScroll from "@/hooks/use-advanced-scroll";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreMenu } from "./MoreMenu";

// Course Icon Component
const CoursesIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.15 6.17C20.74 5.95 19.88 5.72 18.71 6.54L17.24 7.58C17.13 4.47 15.78 3.25 12.5 3.25H6.5C3.08 3.25 1.75 4.58 1.75 8V16C1.75 18.3 3 20.75 6.5 20.75H12.5C15.78 20.75 17.13 19.53 17.24 16.42L18.71 17.46C19.33 17.9 19.87 18.04 20.3 18.04C20.67 18.04 20.96 17.93 21.15 17.83C21.56 17.62 22.25 17.05 22.25 15.62V8.38C22.25 6.95 21.56 6.38 21.15 6.17ZM11 11.38C9.97 11.38 9.12 10.54 9.12 9.5C9.12 8.46 9.97 7.62 11 7.62C12.03 7.62 12.88 8.46 12.88 9.5C12.88 10.54 12.03 11.38 11 11.38Z"
      fill="currentColor"
    />
  </svg>
);
const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    className="shrink-0 !size-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M7.33008 14.49L9.71008 11.4C10.0501 10.96 10.6801 10.88 11.1201 11.22L12.9501 12.66C13.3901 13 14.0201 12.92 14.3601 12.49L16.6701 9.51001"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);
const LearnIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    className="shrink-0 !size-6"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.5 16V18.5C20.5 20.43 18.93 22 17 22H7C5.07 22 3.5 20.43 3.5 18.5V17.85C3.5 16.28 4.78 15 6.35 15H19.5C20.05 15 20.5 15.45 20.5 16Z"
      fill="currentColor"
    />
    <path
      d="M15.5 2H8.5C4.5 2 3.5 3 3.5 7V14.58C4.26 13.91 5.26 13.5 6.35 13.5H19.5C20.05 13.5 20.5 13.05 20.5 12.5V7C20.5 3 19.5 2 15.5 2ZM13 10.75H8C7.59 10.75 7.25 10.41 7.25 10C7.25 9.59 7.59 9.25 8 9.25H13C13.41 9.25 13.75 9.59 13.75 10C13.75 10.41 13.41 10.75 13 10.75ZM16 7.25H8C7.59 7.25 7.25 6.91 7.25 6.5C7.25 6.09 7.59 5.75 8 5.75H16C16.41 5.75 16.75 6.09 16.75 6.5C16.75 6.91 16.41 7.25 16 7.25Z"
      fill="currentColor"
    />
  </svg>
);
interface MenuItemType {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  href: string;
  count?: number | null;
  disabled?: boolean;
  hasNotificationDot?: boolean;
  onClick?: () => void;
}

export function BottomNav() {
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  // Use the layout context instead of auth context
  const { user, isAuthenticated } = useLayoutContext();

  useEffect(() => {
    // Find the main scrollable container
    scrollContainerRef.current = document.querySelector('main[class*="overflow-y-auto"]');
  }, []);

  // Use advanced scroll hook to control bottom nav visibility
  const { scrollY, isAtTop, scrollDirection } = useAdvancedScroll({
    threshold: 20, // Increased threshold for more stable behavior
    debounceMs: 150, // Longer debounce for smoother transitions
    scrollContainer: scrollContainerRef.current,
  });

  // Use the context authentication state
  const isUserAuthenticated = isAuthenticated;

  // More stable bottom nav visibility logic
  // Show when: at top, scrolling up, or direction is idle
  // Hide when: scrolling down and not at top
  const shouldShowBottomNav = isAtTop || scrollDirection === 'up' || scrollDirection === 'idle';

  const menuItems: MenuItemType[] = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="size-5" />,
      activeIcon: <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>,
      href: "/home",
      disabled: false,
    },
    {
      id: "following",
      label: "Following",
      icon: <UsersRound className="size-5" />,
      activeIcon: <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
      href: "/following",
      disabled: false,
    },
    {
      id: "events",
      label: "Events",
      icon: <Star className="size-5" />,
      activeIcon: <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
      href: "/events",
      disabled: false,
    },
    {
      id: "activities",
      label: "Activities",
      icon: <Inbox className="size-5" />,
      activeIcon: <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 12h-6l-2 3h-4l-2-3H2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6ZM2 8v2h6l2 3h4l2-3h6V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /></svg>,
      href: "/activities",
      disabled: false,
    },
  ];

  return (
    <>
      {user ? (
        <div className={cn(
          "fixed bottom-0 left-0 right-0 h-16 max-w-full bg-background border-t border-gray-300 dark:border-gray-700 z-40 md:hidden transition-transform duration-300 ease-in-out",
          shouldShowBottomNav
            ? "translate-y-0"
            : "translate-y-full"
        )}>
          <nav className="h-full">
            <ul className="flex flex-row justify-between w-full h-full items-center p-1">
              {menuItems.map((item) => {
                const isActive =
                  pathname.startsWith(item.href) && item.href !== "#";

                const handleClick = (e: React.MouseEvent) => {
                  if (item.disabled) {
                    e.preventDefault();
                    return;
                  }
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                    return;
                  }
                };

                return (
                  <li
                    key={item.id}
                    className="flex-1 p-1 flex items-center justify-center"
                  >
                    <Link href={item.href} legacyBehavior>
                      <a
                        className={cn(
                          "w-fit flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-200 theme-aware py-2 px-3 text-xs relative",
                          isActive
                            ? "hover:bg-primary text-primary hover:text-primary-foreground"
                            : "text-gray-600 dark:text-[#fafafa]/70 hover:bg-primary/70 hover:text-white"
                          // item.disabled && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={handleClick}
                      >
                        {isActive ? (item.activeIcon || item.icon) : item.icon}
                        <span className="font-medium line-clamp-1 font-mono text-xs">
                          {item.label}
                        </span>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>)
        : null
      }
    </>
  );
}
