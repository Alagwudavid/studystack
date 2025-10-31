"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface ThemePreviewProps {
  theme: "light" | "dark" | "system";
  isActive?: boolean;
}

export function ThemePreview({ theme, isActive }: ThemePreviewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getPreviewColors = () => {
    switch (theme) {
      case "light":
        return {
          bg: "bg-[#fafafa]",
          surface: "bg-[#ffffff]",
          primary: "bg-[#C51E3A]", // Red for light mode
          accent: "bg-[#8ddeed]",
          text: "bg-gray-800",
        };
      case "dark":
        return {
          bg: "bg-[#010B13]",
          surface: "bg-[#010B13]",
          primary: "bg-[#7037e4]", // Purple for dark mode
          accent: "bg-[#8ddeed]",
          text: "bg-[#fafafa]",
        };
      case "system":
        if (!mounted) {
          // Return light theme during SSR to prevent hydration mismatch
          return {
            bg: "bg-[#fafafa]",
            surface: "bg-[#ffffff]",
            primary: "bg-[#C51E3A]", // Red for light mode
            accent: "bg-[#8ddeed]",
            text: "bg-gray-800",
          };
        }
        const systemIsDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        return systemIsDark
          ? {
            bg: "bg-[#010B13]",
            surface: "bg-[#010B13]",
            primary: "bg-[#7037e4]", // Purple for dark mode
            accent: "bg-[#8ddeed]",
            text: "bg-[#fafafa]",
          }
          : {
            bg: "bg-[#fafafa]",
            surface: "bg-[#ffffff]",
            primary: "bg-[#C51E3A]", // Red for light mode
            accent: "bg-[#8ddeed]",
            text: "bg-gray-800",
          };
      default:
        return {
          bg: "bg-[#fafafa]",
          surface: "bg-[#ffffff]",
          primary: "bg-[#C51E3A]", // Red for light mode
          accent: "bg-[#8ddeed]",
          text: "bg-gray-800",
        };
    }
  };

  const colors = getPreviewColors();

  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 z-50">
      <Card className={`w-16 h-10 p-1 ${colors.bg} border shadow-lg`}>
        <div className="flex h-full gap-0.5">
          {/* Sidebar preview */}
          <div className={`w-2 h-full ${colors.primary} rounded-sm`}></div>
          {/* Main content preview */}
          <div className="flex-1 flex flex-col gap-0.5">
            <div className={`h-1.5 ${colors.surface} rounded-sm`}></div>
            <div className={`h-1 ${colors.accent} rounded-sm w-3/4`}></div>
            <div className={`h-0.5 ${colors.text} rounded-sm w-1/2`}></div>
            <div className={`h-0.5 ${colors.text} rounded-sm w-2/3`}></div>
          </div>
        </div>
        {isActive && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        )}
      </Card>
    </div>
  );
}
