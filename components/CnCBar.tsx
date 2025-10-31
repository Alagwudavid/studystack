"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLayoutContext } from "@/contexts/LayoutContext";

interface CnCBarProps {
  className?: string;
}

export function CnCBar({ className }: CnCBarProps) {
  const { user, isCnCBarVisible } = useLayoutContext();

  // Don't render if not visible
  if (!isCnCBarVisible) {
    return null;
  }

  const menuItems = [
    {
      id: "computer-science",
      label: "Computer Science",
      profileSrc: "user-1.jpg",
      href: "/#",
      disabled: false,
      hasNotificationDot: false,
    },
    {
      id: "better-health",
      label: "Better Health",
      profileSrc: "user-2.jpg",
      href: "/#",
      disabled: false,
      hasNotificationDot: false,
    },
    {
      id: "unn-info",
      label: "UNN Info",
      profileSrc: "user-3.jpg",
      href: "/#",
      disabled: false,
      hasNotificationDot: false,
    },
    {
      id: "explore-nigeria",
      label: "Explore Nigeria",
      profileSrc: "user-4.jpg",
      href: "/#",
      disabled: false,
      hasNotificationDot: true,
    },
    {
      id: "physics-world",
      label: "Physics World",
      profileSrc: "user-1.jpg",
      href: "/#",
      disabled: false,
      hasNotificationDot: true,
    },
    {
      id: "arise-news",
      label: "Arise News",
      profileSrc: "user-3.jpg",
      href: "/#",
      disabled: false,
      hasNotificationDot: true,
    },
    {
      id: "chat-gpt",
      label: "Chat GPT",
      profileSrc: "user-2.jpg",
      href: `/#`,
      disabled: false,
      hasNotificationDot: true,
    },
  ];

  return (
    <div
      className={cn(
        "h-[calc(100vh-64px)] bg-background text-foreground border-r shrink-0 w-14 max-md:hidden transition-all duration-500",
        "overflow-hidden overflow-y-auto scrollbar-custom",
        className
      )}
    >
      {/* Header */}
      <div className="h-14 w-full flex items-center justify-center border-b ">
        <div className="">
          <Plus className="!size-6 text-sky-500" />
        </div>
      </div>

      {/* Channel Navigation */}
      <nav className="w-full p-2">
        <div className="flex flex-col space-y-1">
          {menuItems.map((item) => {
            const handleClick = (e: React.MouseEvent) => {
              if (item.disabled) {
                e.preventDefault();
                return;
              }
            };

            return (
              <Link
                key={item.id}
                href={item.href}
                tabIndex={item.disabled ? -1 : 0}
                aria-disabled={item.disabled}
                onClick={handleClick}
                className={cn(
                  "flex items-center h-10 rounded transition-all relative text-lg p-2",
                  "text-gray-600 dark:text-[#fafafa]/70 hover:bg-primary/70 hover:text-white",
                  "justify-center",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="relative shrink-0">
                  <div className="w-7 h-7 overflow-hidden border-2 rounded">
                    <img
                      src={`/stories/${item.profileSrc}`}
                      className="w-full h-full object-cover"
                      alt={item.label}
                    />
                  </div>
                  {item.hasNotificationDot && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
