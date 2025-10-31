"use client";

import { useRouter } from "next/navigation";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { Images, Megaphone, AudioWaveform, UsersRound, MessagesSquare, GalleryVerticalEnd, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface MoreMenuProps {
  className?: string;
  showText?: boolean;
}

export function MoreMenu({ className, showText }: MoreMenuProps) {
  const { user } = useLayoutContext();
  const router = useRouter();

  const menuItems = [
    {
      id: "notifications",
      label: "Activities",
      icon: (
        <svg
          className="shrink-0 !size-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.7491 9.70957V9.00497C18.7491 5.13623 15.7274 2 12 2C8.27256 2 5.25087 5.13623 5.25087 9.00497V9.70957C5.25087 10.5552 5.00972 11.3818 4.5578 12.0854L3.45036 13.8095C2.43882 15.3843 3.21105 17.5249 4.97036 18.0229C9.57274 19.3257 14.4273 19.3257 19.0296 18.0229C20.789 17.5249 21.5612 15.3843 20.5496 13.8095L19.4422 12.0854C18.9903 11.3818 18.7491 10.5552 18.7491 9.70957Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ),
      href: "/activities",
      disabled: false,
      hasNotificationDot: true,
    },
    {
      id: "library",
      label: "Library",
      icon: <Images className="shrink-0 !size-6" />,
      href: `/@${user?.username || "guest"}/library`,
      disabled: true,
      hasNotificationDot: false,
    },
    {
      id: "shop",
      label: "Shop",
      icon: <ShoppingCart className="shrink-0 !size-6" />,
      href: "/shop/",
      disabled: false,
      hasNotificationDot: false,
    },
    // {
    //   id: "beet",
    //   label: "Beet Ai",
    //   icon: <AudioWaveform className="shrink-0 !size-6" />,
    //   href: "/coming-soon",
    //   disabled: true,
    //   hasNotificationDot: false,
    // },
    {
      id: "challenges",
      label: "Challenges",
      icon: (
        <svg
          className="shrink-0 !size-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.25 18.2509H9C7.9 18.2509 7 19.1509 7 20.2509V20.5009H6C5.59 20.5009 5.25 20.8409 5.25 21.2509C5.25 21.6609 5.59 22.0009 6 22.0009H18C18.41 22.0009 18.75 21.6609 18.75 21.2509C18.75 20.8409 18.41 20.5009 18 20.5009H17V20.2509C17 19.1509 16.1 18.2509 15 18.2509H12.75V15.9609C12.5 15.9909 12.25 16.0009 12 16.0009C11.75 16.0009 11.5 15.9909 11.25 15.9609V18.2509Z"
            fill="currentColor"
          />
          <path
            d="M18.4793 11.64C19.1393 11.39 19.7193 10.98 20.1793 10.52C21.1093 9.49 21.7193 8.26 21.7193 6.82C21.7193 5.38 20.5893 4.25 19.1493 4.25H18.5893C17.9393 2.92 16.5793 2 14.9993 2H8.9993C7.4193 2 6.0593 2.92 5.4093 4.25H4.8493C3.4093 4.25 2.2793 5.38 2.2793 6.82C2.2793 8.26 2.8893 9.49 3.8193 10.52C4.2793 10.98 4.8593 11.39 5.5193 11.64C6.5593 14.2 9.0593 16 11.9993 16C14.9393 16 17.4393 14.2 18.4793 11.64ZM14.8393 8.45L14.2193 9.21C14.1193 9.32 14.0493 9.54 14.0593 9.69L14.1193 10.67C14.1593 11.27 13.7293 11.58 13.1693 11.36L12.2593 11C12.1193 10.95 11.8793 10.95 11.7393 11L10.8293 11.36C10.2693 11.58 9.8393 11.27 9.8793 10.67L9.9393 9.69C9.9493 9.54 9.8793 9.32 9.7793 9.21L9.1593 8.45C8.7693 7.99 8.9393 7.48 9.5193 7.33L10.4693 7.09C10.6193 7.05 10.7993 6.91 10.8793 6.78L11.4093 5.96C11.7393 5.45 12.2593 5.45 12.5893 5.96L13.1193 6.78C13.1993 6.91 13.3793 7.05 13.5293 7.09L14.4793 7.33C15.0593 7.48 15.2293 7.99 14.8393 8.45Z"
            fill="currentColor"
          />
        </svg>
      ),
      href: "/coming-soon",
      disabled: true,
      hasNotificationDot: false,
    },
    {
      id: "courses",
      label: "My courses",
      icon: (
        <svg
          className="shrink-0 !size-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.15 6.17C20.74 5.95 19.88 5.72 18.71 6.54L17.24 7.58C17.13 4.47 15.78 3.25 12.5 3.25H6.5C3.08 3.25 1.75 4.58 1.75 8V16C1.75 18.3 3 20.75 6.5 20.75H12.5C15.78 20.75 17.13 19.53 17.24 16.42L18.71 17.46C19.33 17.9 19.87 18.04 20.3 18.04C20.67 18.04 20.96 17.93 21.15 17.83C21.56 17.62 22.25 17.05 22.25 15.62V8.38C22.25 6.95 21.56 6.38 21.15 6.17ZM11 11.38C9.97 11.38 9.12 10.54 9.12 9.5C9.12 8.46 9.97 7.62 11 7.62C12.03 7.62 12.88 8.46 12.88 9.5C12.88 10.54 12.03 11.38 11 11.38Z"
            fill="currentColor"
          />
        </svg>
      ),
      href: "/coming-soon",
      disabled: true,
      hasNotificationDot: false,
    },
    {
      id: "channels",
      label: "Channels",
      icon: <Megaphone className="shrink-0 !size-6" />,
      href: "/channel",
      disabled: true,
      hasNotificationDot: false,
    },
    // {
    //   id: "discussions",
    //   label: "Discussions",
    //   icon: <MessagesSquare className="shrink-0 !size-6" />,
    //   href: "/coming-soon",
    //   disabled: true,
    //   hasNotificationDot: false,
    // },
    {
      id: "community",
      label: "Communities",
      icon: (
        <GalleryVerticalEnd
          className="shrink-0 !size-6" />
      ),
      href: "/communities",
      disabled: true,
      hasNotificationDot: false,
    },
    {
      id: "groups",
      label: "Groups",
      icon: (
        <UsersRound
          className="shrink-0 !size-6" />
      ),
      href: "/chat/groups",
      disabled: true,
      hasNotificationDot: false,
    },
    {
      id: "learn",
      label: "Learn",
      icon: (
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
      ),
      href: "/learn",
      disabled: false,
      hasNotificationDot: false,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="cool"
          className={cn(
            "relative rounded-xl p-0 hover:bg-transparent dark:hover:bg-transparent text-gray-600 hover:text-black dark:text-[#fafafa]/70 dark:hover:text-white",
            // showText ? "h-auto w-full justify-start gap-3 px-0" : "h-10 w-10",
            className
          )}
        >
          <div className={cn("flex items-center gap-3", showText ? "px-3 py-1 w-full" : "mx-auto w-10 h-10 justify-center")}>
            <div className="flex-shrink-0">
              <svg
                fill="currentColor"
                width="26px"
                height="26px"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto !size-7"
              >
                <g id="Layer_2" data-name="Layer 2">
                  <g id="invisible_box" data-name="invisible box">
                    <rect width="48" height="48" fill="none" />
                  </g>
                  <g id="icons_Q2" data-name="icons Q2">
                    <path d="M16,6v8a2,2,0,0,1-2,2H6a2,2,0,0,1-2-2V6A2,2,0,0,1,6,4h8A2,2,0,0,1,16,6ZM28,4H20a2,2,0,0,0-2,2v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V6A2,2,0,0,0,28,4ZM42,4H34a2,2,0,0,0-2,2v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V6A2,2,0,0,0,42,4ZM14,18H6a2,2,0,0,0-2,2v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V20A2,2,0,0,0,14,18Zm14,0H20a2,2,0,0,0-2,2v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V20A2,2,0,0,0,28,18Zm14,0H34a2,2,0,0,0-2,2v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V20A2,2,0,0,0,42,18ZM14,32H6a2,2,0,0,0-2,2v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V34A2,2,0,0,0,14,32Zm14,0H20a2,2,0,0,0-2,2v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V34A2,2,0,0,0,28,32Zm14,0H34a2,2,0,0,0-2,2v8a2,2,0,0,0,2,2h8a2,2,0,0,0,2-2V34A2,2,0,0,0,42,32Z" />
                  </g>
                </g>
              </svg>
            </div>
            {showText && (
              <span className="text-foreground text-foreground hover:!text-foreground animate-in fade-in-0 slide-in-from-left-2 duration-200">
                More Bit&apos;s
              </span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 rounded-lg border shadow-lg bg-white dark:bg-gray-900"
        align="end"
        sideOffset={8}
      >
        <div className="p-2 space-y-1">
          <div className="text-lg text-muted-foreground font-medium text-center">More Bit Features</div>
          <div className="space-y-1 grid grid-cols-3">
            {menuItems.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => {
                  if (!item.disabled) {
                    router.push(item.href);
                  }
                }}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg relative text-foreground hover:!text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="relative">
                  {item.icon}
                  {item.hasNotificationDot && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <span className="text-xs">{item.label}</span>
                {item.disabled && (
                  <span className="ml-auto w-2 h-2 bg-red-500 absolute top-2 right-3 rounded-full animate-pulse" title="Coming Soon!">
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
