"use client";

import { useLayoutContext } from "@/contexts/LayoutContext";
import { FloatingSidebar } from "./FloatingSidebar";
import { DropdownSidebar } from "./DropdownSidebar";
import { useScreenSize } from "@/hooks/use-screen-size";

interface SideBarProps {
  className?: string;
}

export function SideBar({ className }: SideBarProps) {
  const { isDropdownSidebarOpen, setDropdownSidebarOpen } = useLayoutContext();
  const { showFloatingSidebar, showTopNav } = useScreenSize();

  return (
    <>
      {/* Mobile: show dropdown sidebar when toggled */}
      {showTopNav && (
        <DropdownSidebar
          isOpen={isDropdownSidebarOpen}
          onClose={() => setDropdownSidebarOpen(false)}
          className={className}
        />
      )}

      {/* Tablet and Desktop: show floating sidebar */}
      {showFloatingSidebar && (
        <FloatingSidebar className={className} />
      )}
    </>
  );
}
