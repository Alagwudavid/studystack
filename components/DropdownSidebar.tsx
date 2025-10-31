"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  SearchIcon,
  Star,
  X,
  PlusSquare,
} from "lucide-react";
import { sidebarMenuItems } from "@/data/sidebar-menu-items";
import { useStaggeredAnimation } from "@/hooks/use-staggered-animation";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { MainMenu } from "./main-menu";
import { MoreMenu } from "./MoreMenu";
import { CreatePostModal } from "@/components/CreatePostModal";
import NotificationBadge from "@/components/NotificationBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Audiowide } from "next/font/google";

const audiowide = Audiowide({ subsets: ["latin"], weight: "400" });



interface DropdownSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function DropdownSidebar({ isOpen, onClose, className }: DropdownSidebarProps) {
  const pathname = usePathname();
  const { user } = useLayoutContext();
  const { unreadCount } = useWebSocketContext();
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  // Use shared menu items
  const menuItems = sidebarMenuItems;

  // Staggered animation for menu items when dropdown opens
  const { isLoading, isItemVisible } = useStaggeredAnimation({
    items: menuItems,
    delayBetween: 60,
    initialDelay: 100,
  });

  // Skeleton component for loading state
  const MenuItemSkeleton = () => (
    <div className="flex items-center gap-3 w-full rounded-lg p-3">
      <Skeleton className="h-6 w-6 shrink-0" />
      <Skeleton className="h-4 flex-1" />
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]"
            onClick={onClose}
          />

          {/* Dropdown Sidebar */}
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.4
            }}
            className={cn(
              "fixed left-0 top-0 w-64 h-screen bg-background text-foreground z-[60] overflow-y-auto scrollbar-custom",
              "flex flex-col",
              className
            )}
          >
            {/* Navigation */}
            <nav className="flex-1 flex flex-col p-4">
              {/* Create Button */}
              <div className="mb-4">
                <button
                  onClick={() => setShowCreatePostModal(true)}
                  className="flex items-center justify-center gap-2 w-full rounded-lg px-3 py-2 bg-sky-500 text-white hover:bg-sky-600 transition-all duration-200"
                >
                  <PlusSquare className="h-6 w-6" />
                  <span className="text-base">Create</span>
                </button>
              </div>

              {/* Main Navigation */}
              <div className="space-y-2">
                {isLoading
                  ? // Show skeletons while loading
                  Array.from({ length: menuItems.length }).map((_, index) => (
                    <MenuItemSkeleton key={`skeleton-${index}`} />
                  ))
                  : // Show actual menu items with staggered animation
                  menuItems.map((item, index) => {
                    // Handle main-menu item specially
                    if (item.id === "main-menu") {
                      const isVisible = isItemVisible(index);

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -10 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.06,
                            ease: [0.4, 0, 0.2, 1]
                          }}
                          className="w-full"
                        >
                          <MainMenu className="w-full" showText={true} avatarSize="!h-7 !w-7" />
                        </motion.div>
                      );
                    }

                    const Icon = item.icon;
                    const actualHref = item.href;
                    const isActive = pathname.startsWith(actualHref) && actualHref !== "#";
                    const isVisible = isItemVisible(index);

                    const handleClick = (e: React.MouseEvent) => {
                      if (item.disabled) {
                        e.preventDefault();
                        return;
                      }
                      // Close dropdown after navigation
                      onClose();
                    };

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -10 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.06,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                      >
                        <Link
                          href={actualHref}
                          tabIndex={item.disabled ? -1 : 0}
                          aria-disabled={item.disabled}
                          onClick={handleClick}
                          className={cn(
                            "flex items-center gap-3 w-full rounded-lg p-3 transition-all duration-300 group relative",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-primary/80 hover:text-primary-foreground",
                            item.disabled && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div className="relative">
                            <Icon className="size-6 shrink-0" />
                          </div>
                          <span className="text-foreground truncate transition-all duration-300">
                            {item.label}
                          </span>
                          {item.id === "notifications" && unreadCount > 0 && (
                            <NotificationBadge className="text-xs" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })
                }
              </div>
            </nav>
          </motion.div>

          {/* Create Post Modal */}
          <CreatePostModal
            open={showCreatePostModal}
            onOpenChange={setShowCreatePostModal}
            user={user || undefined}
          />
        </>
      )}
    </AnimatePresence>
  );
}