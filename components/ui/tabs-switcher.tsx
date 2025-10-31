"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsMobile } from "./use-mobile";

interface TabsSwitcherProps {
  tabs: Array<{
    value: string;
    label: string;
    placeholder: string;
    link: string | string[];
  }>;
  className?: string;
}

export function TabsSwitcher({ tabs, className }: TabsSwitcherProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  return (
    <div className={cn("flex items-center space-x-2 rounded-lg bg-muted p-1", className)}>
      {tabs.map((tab) => {
        const isActive = Array.isArray(tab.link)
          ? tab.link.includes(pathname)
          : pathname === tab.link;

        // Always pass a string to <Link> (take the first if it's an array)
        const href = Array.isArray(tab.link) ? tab.link[0] : tab.link;

        return (
          <Link
            key={tab.value}
            href={href}
            className={cn(
              "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            {!isMobile && tab.placeholder}
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
