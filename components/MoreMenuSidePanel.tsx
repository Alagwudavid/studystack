"use client";

import Link from "next/link";
import { X, AudioWaveform, Sparkles, Trophy, BookOpen, Compass, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MoreMenuSidePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MoreMenuSidePanel({ isOpen, onClose }: MoreMenuSidePanelProps) {
    const moreMenuItems = [
        {
            id: "ai",
            label: "AI Assistant",
            icon: AudioWaveform,
            href: "/ai",
            description: "Get help with coding and learning",
            color: "text-purple-500"
        },
        {
            id: "spark",
            label: "Spark Ideas",
            icon: Sparkles,
            href: "/spark",
            description: "Discover new project ideas",
            color: "text-yellow-500"
        },
        {
            id: "challenges",
            label: "Challenges",
            icon: Trophy,
            href: "/challenges",
            description: "Test your skills with coding challenges",
            color: "text-orange-500"
        },
        {
            id: "learn",
            label: "Learn",
            icon: BookOpen,
            href: "/learn",
            description: "Explore learning resources",
            color: "text-blue-500"
        },
        {
            id: "explore",
            label: "Explore",
            icon: Compass,
            href: "/explore",
            description: "Discover new content and creators",
            color: "text-green-500"
        },
        {
            id: "podcast",
            label: "Podcast",
            icon: Mic,
            href: "/podcast",
            description: "Listen to tech talks and interviews",
            color: "text-red-500"
        }
    ];

    return (
        <>
            {/* Backdrop - positioned to not cover the sidebar */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 left-[400px] lg:left-[400px]"
                    onClick={onClose}
                />
            )}

            {/* Side Panel */}
            {isOpen && (
                <div
                    className={cn(
                        "fixed top-0 h-screen w-80 bg-background text-foreground border-r border-border z-40",
                        "left-20 lg:left-20" // Always position beside collapsed sidebar
                    )}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between h-10 p-4">
                        {/* <h2 className="text-lg font-semibold text-white">More Options</h2>
                        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
                            <X className="h-4 w-4" />
                        </Button> */}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <div className="grid gap-4">
                            {moreMenuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={onClose}
                                        className="flex items-start gap-4 py-2.5 px-3 rounded-lg hover:bg-accent/50 transition-colors group"
                                    >
                                        <div className="flex-shrink-0">
                                            <Icon className={cn("h-6 w-6", item.color)} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-sm group-hover:text-foreground transition-colors">
                                                {item.label}
                                            </h3>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Featured Section */}
                    <div className="p-4 border-t border-border mt-auto">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Featured</h3>
                        <div className="space-y-2">
                            <Link
                                href="/featured/bootcamp"
                                onClick={onClose}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                            >
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm">Web Development Bootcamp</span>
                            </Link>
                            <Link
                                href="/featured/community"
                                onClick={onClose}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                            >
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm">Community Spotlight</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
