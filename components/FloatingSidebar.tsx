"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Menu,
} from "lucide-react";
import { sidebarMenuItems, type MenuItem } from "@/data/sidebar-menu-items";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";
import { useScreenSize } from "@/hooks/use-screen-size";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { MainMenu } from "./main-menu";
import { CreatePostModal } from "@/components/CreatePostModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationBadge from "@/components/NotificationBadge";


interface FloatingSidebarProps {
  className?: string;
}

export function FloatingSidebar({ className }: FloatingSidebarProps) {
  const { user } = useLayoutContext();
  const { unreadCount } = useWebSocketContext();
  const { sidebarHasText, sidebarIsCollapsed, sidebarWidth } = useScreenSize();
  const pathname = usePathname();

  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [manuallyToggled, setManuallyToggled] = useState(false);

  // Determine if text should show based on screen size and manual toggle
  const showText = manuallyToggled ? !sidebarHasText : sidebarHasText;

  // Calculate dynamic sidebar width based on showText state
  const dynamicSidebarWidth = showText ? { width: "18rem" } : { width: "4rem" };

  // Use shared menu items
  const menuItems = sidebarMenuItems;

  return (
    <motion.div
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      className={cn(
        "bg-background text-foreground flex flex-col h-screen sidebar-transition overflow-y-auto scrollbar-custom scrollbar-hide shrink-0 border-r",
        "transition-all duration-300 ease-in-out",
        className
      )}
      style={dynamicSidebarWidth}
    >
      {/* Header with Menu toggle */}
      <div className={cn("flex items-center justify-between pt-4 px-4", !showText && "justify-center")}>
        {showText && (
          <h2 className="font-semibold text-base text-foreground font-mono">
            <svg className="!size-8" viewBox="0 0 0.61 0.55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
              <rect fill="#D10B2C" width="0.61" height="0.55" rx="0.1" ry="0.1"/>
              <polygon fill="#FEFEFE" fill-rule="nonzero" points="0.37,0.12 0.37,0.21 0.27,0.21 0.27,0.43 0.07,0.43 0.07,0.34 0.18,0.34 0.18,0.12 "/>
              <polygon fill="#FEFEFE" fill-rule="nonzero" points="0.47,0.12 0.47,0.2 0.53,0.2 0.53,0.28 0.47,0.28 0.47,0.36 0.54,0.36 0.54,0.44 0.39,0.44 0.39,0.12 "/>
            </g>
            </svg>
          </h2>
        )}
        {/* Only show toggle on larger screens where manual control makes sense */}
        {/* {!sidebarIsCollapsed && ( */}
        <Tooltip text={`${showText ? "Collapse" : "Expand"}`} side="right">
          <button
            onClick={() => setManuallyToggled(!manuallyToggled)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {showText ? <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path d="M9 3.5v17m7-5.5l-3-3l3-3"></path><path d="M3 9.4c0-2.24 0-3.36.436-4.216a4 4 0 0 1 1.748-1.748C6.04 3 7.16 3 9.4 3h5.2c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C21 6.04 21 7.16 21 9.4v5.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C17.96 21 16.84 21 14.6 21H9.4c-2.24 0-3.36 0-4.216-.436a4 4 0 0 1-1.748-1.748C3 17.96 3 16.84 3 14.6z"></path></g></svg> : <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path d="M9 3.5v17M14 9l3 3l-3 3"></path><path d="M3 9.4c0-2.24 0-3.36.436-4.216a4 4 0 0 1 1.748-1.748C6.04 3 7.16 3 9.4 3h5.2c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C21 6.04 21 7.16 21 9.4v5.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C17.96 21 16.84 21 14.6 21H9.4c-2.24 0-3.36 0-4.216-.436a4 4 0 0 1-1.748-1.748C3 17.96 3 16.84 3 14.6z"></path></g></svg>}
          </button>
        </Tooltip>
        {/* )} */}
      </div>
      <div className="p-2">
        {showText ? (
          <button
            onClick={() => setShowCreatePostModal(true)}
            className={cn(
              "flex items-center justify-center transition-all duration-200 group relative",
              "gap-2 w-full rounded-full p-2.5",
              "bg-sky-500 text-white hover:bg-sky-600"
            )}
          >
            <Plus className="h-6 w-6" />
            <span className="text-lg">Create</span>
          </button>
        ) : (
          <div className="flex items-center justify-center">
            <Tooltip text={"Create"} side="right">
              <button
                onClick={() => setShowCreatePostModal(true)}
                className={cn(
                  "flex items-center transition-all duration-200 group relative",
                  "w-12 h-12 justify-center rounded-lg",
                  "bg-sky-500 text-white hover:bg-sky-600"
                )}
              >
                <Plus className="h-7 w-7" />
              </button>
            </Tooltip>
          </div>
        )}
      </div>
      {/* {showText ? (<div
        className="w-full px-2 mb-4"
      >
        <button
          onClick={() => setShowCreatePostModal(true)}
          className={cn(
            "flex items-center justify-center transition-all duration-200 group relative",
            "gap-2 w-full rounded-lg px-3 p-2",
            "bg-sky-500 text-white hover:bg-sky-600"
          )}
        >
          <Plus className="h-6 w-6" />
          {showText && <span className="text-base">Create</span>}
        </button>
      </div>)
        : (<div
          className="flex items-center justify-center px-2 mb-4"
        >
          <Tooltip text={"Create"} side="right">
            <button
              onClick={() => setShowCreatePostModal(true)}
              className={cn(
                "flex items-center transition-all duration-200 group relative",
                "w-12 h-12 justify-center rounded-lg",
                "bg-sky-500 text-white hover:bg-sky-600"
              )}
            >
              <Plus className="h-6 w-6" />
            </button>
          </Tooltip>
        </div>)} */}
      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-custom scrollbar-hide">
        <div className={cn("mb-3 px-2")}>
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              // Handle main-menu item specially
              // if (item.id === "main-menu") {
              //   const mainMenuElement = (
              //     <div
              //       className={cn(
              //         "flex items-center transition-all duration-300 group relative",
              //         showText ? "gap-3 w-full mx-auto rounded-full p-2.5" : "w-12 h-12 justify-center rounded-lg items-center"
              //       )}
              //     >
              //       <MainMenu
              //         className="w-full h-full flex items-center justify-center"
              //         showText={false}
              //         avatarSize="!h-8 !w-8"
              //       />
              //     </div>
              //   );

              //   return !showText ? (
              //     <div
              //       key={item.id}
              //       className="flex items-center justify-center"
              //     >
              //       <Tooltip text={item.label} side="right">
              //         {mainMenuElement}
              //       </Tooltip>
              //     </div>
              //   ) : (
              //     <div key={item.id} className="w-full">
              //       <MainMenu className="w-full" showText={showText} avatarSize="!h-7 !w-7" />
              //     </div>
              //   );
              // }

              const Icon = item.icon;
              const actualHref = item.href;
              const isActive = pathname.startsWith(actualHref) && actualHref !== "#";

              const handleClick = (e: React.MouseEvent) => {
                if (item.disabled) {
                  e.preventDefault();
                  return;
                }
              };

              const linkElement = (
                <Link
                  href={actualHref}
                  tabIndex={item.disabled ? -1 : 0}
                  aria-disabled={item.disabled}
                  onClick={handleClick}
                  className={cn(
                    "flex items-center group relative",
                    showText ? "gap-3 w-full rounded-full p-2.5" : "w-12 h-12 justify-center rounded-lg",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted",
                    item.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="relative">
                    <Icon className="h-7 w-7" />
                    {item.id === "notifications" && !showText && (
                      <div className="absolute -bottom-1 -right-1">
                        <NotificationBadge className="text-xs" />
                      </div>
                    )}
                  </div>
                  {showText && (
                    <span className="truncate transition-all duration-300 text-lg">
                      {item.label}
                    </span>
                  )}
                  {showText && item.id === "notifications" && unreadCount > 0 && (
                    <NotificationBadge className="text-xs" />
                  )}
                </Link>
              );

              return !showText ? (
                <div
                  key={item.id}
                  className="flex items-center justify-center"
                >
                  <Tooltip text={item.label} side="right">
                    {linkElement}
                  </Tooltip>
                </div>
              ) : (
                <div key={item.id}>
                  {linkElement}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div
        className={cn(
          "flex items-center transition-all duration-300 group relative w-full p-2",
          showText ? "gap-3 mx-auto rounded-full" : "justify-center rounded-lg items-center"
        )}
      >
        {showText ? 
        <MainMenu className="w-full rounded-full" showText={showText} avatarSize="!h-8 !w-8" />
        :
         <Tooltip text={"more menu"} side="right">
          <MainMenu
            className="w-12 h-12 flex items-center justify-center"
            showText={false}
            avatarSize="!h-10 !w-10"
          />
        </Tooltip>
        }
      </div>
      {/* Create Post Modal */}
      <CreatePostModal
        open={showCreatePostModal}
        onOpenChange={setShowCreatePostModal}
        user={user || undefined}
      />
    </motion.div>
  );
}