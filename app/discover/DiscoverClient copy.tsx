"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import {
    ListVideo,
    Camera,
    TrendingUp,
    Users,
    Globe,
    Crown,
    Medal,
    Award,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    LibraryBig,
    Compass,
    UsersRound,
    Headphones,
    Play,
    RefreshCcw,
    BookOpen,
    MessagesSquareIcon,
    Plus,
    X,
    MoreHorizontal,
    UserPlus,
    Ban,
    Settings,
    Share,
    HelpCircle,
    Flag,
    CheckCircle,
    Zap,
} from "lucide-react";
import PostCard from "@/components/PostCard";

import { ProfileCompletionModal } from "@/components/ProfileCompletionModal";
import { Tooltip } from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { socialLearningPosts } from "@/data/social-learning";
import { storyChannels } from "@/data/suggested";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsTablet } from "@/components/ui/use-tablet";
import { TabsSwitcher } from "@/components/ui/tabs-switcher";
import Link from "next/link";
import { Dot } from "@/components/ui/dot";
import { Audiowide } from "next/font/google";

import NotificationBell from "@/components/NotificationBell";

import { useLayoutContext } from "@/contexts/LayoutContext";
import { RightSidebar } from "@/components/aside/right-sidebar";
import { AsideBar } from "@/components/aside-bar";
import { useDynamicTitle } from "@/hooks/use-dynamic-title";

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    profile_image: string | null;
    bio: string | null;
    points: number;
    level: number;
    streak_count: number;
    last_activity_date: string | null;
    created_at: string;
    updated_at: string;
}

interface DiscoverClientProps {
    serverUser?: User;
}

const audiowide = Audiowide({
    subsets: ["latin"],
    weight: "400",
});

const DiscoverClient = ({ serverUser }: DiscoverClientProps) => {

    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    const [currentVideoIndex, setCurrentVideoIndex] = useState<{
        [channelId: number]: number;
    }>({});
    const [isTransitioning, setIsTransitioning] = useState<{
        [channelId: number]: boolean;
    }>({});
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const { setServerUser } = useAuth();
    const { user, isAuthenticated } = useLayoutContext();

    // Use dynamic title hook to update page title with notification count
    useDynamicTitle({
        baseTitle: "For you | Home - Bitroot",
    });

    // Use the context authentication state
    const isUserAuthenticated = isAuthenticated;
    // Set server user in auth context if provided
    useEffect(() => {
        if (serverUser) {
            setServerUser(serverUser);
        }
    }, [serverUser, setServerUser]);

    // Helper function to get current video for a channel
    const getCurrentVideoForChannel = (channel: any) => {
        if (!channel || !channel.videos || !Array.isArray(channel.videos)) {
            return null;
        }

        const currentIndex = currentVideoIndex[channel.id];

        if (currentIndex !== undefined && channel.videos[currentIndex]) {
            return channel.videos[currentIndex];
        }

        // Default behavior: show the first video
        return channel.videos[0];
    };

    // Helper function to get current video index for a channel
    const getCurrentVideoIndex = (channel: any) => {
        if (!channel || !channel.videos || !Array.isArray(channel.videos)) {
            return 0;
        }

        const currentIndex = currentVideoIndex[channel.id];

        if (currentIndex !== undefined) {
            return currentIndex;
        }

        // Default behavior: show the first video
        return 0;
    };

    // Function to handle video switch with animation
    const handleVideoSwitch = (channelId: number, videoIndex: number) => {
        // Find the complete channel object
        const channel = storyChannels.find((c) => c.id === channelId);
        if (!channel) return;

        // Don't switch if already on this video
        const currentIndex = getCurrentVideoIndex(channel);
        if (currentIndex === videoIndex) return;

        // Start transition
        setIsTransitioning((prev) => ({
            ...prev,
            [channelId]: true,
        }));

        // After a short delay, update the video index
        setTimeout(() => {
            setCurrentVideoIndex((prev) => ({
                ...prev,
                [channelId]: videoIndex,
            }));

            // End transition after another short delay
            setTimeout(() => {
                setIsTransitioning((prev) => ({
                    ...prev,
                    [channelId]: false,
                }));
            }, 150);
        }, 150);
    };

    // Handle scroll event for suggested container
    useEffect(() => {
        const suggestedContainer = document.getElementById("suggested-container");

        const handleScroll = () => {
            if (suggestedContainer) {
                // Check if scrolled to the left end
                setShowLeftButton(suggestedContainer.scrollLeft > 10);

                // Check if scrolled to the right end
                const isAtRightEnd =
                    Math.abs(
                        suggestedContainer.scrollWidth -
                        suggestedContainer.clientWidth -
                        suggestedContainer.scrollLeft
                    ) < 10;
                setShowRightButton(!isAtRightEnd);
            }
        };

        // Initial check
        if (suggestedContainer) {
            handleScroll();
            suggestedContainer.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (suggestedContainer) {
                suggestedContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    return (
        <section className="min-h-screen flex flex-col items-center">
            <section className="p-4 w-full mb-3">
                {/* Video Carousel Header */}
                <div className="grid grid-cols-[1fr_auto] items-center mb-6">
                    <div className="flex items-center space-x-3">
                        {/* Brand Logo */}
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 flex items-center justify-center">
                                <ListVideo className="text-primary size-7" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">
                                    New Playlists
                                </h2>
                                <p className="text-sm text-gray-400">
                                    {storyChannels.length} new
                                </p>
                            </div>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-1 hover:bg-muted rounded-full transition-colors">
                                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>View all</DropdownMenuItem>
                            <DropdownMenuItem>Hide</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Video Carousel */}
                <div className="relative w-full mb-6">
                    {/* Left Navigation Button */}
                    {showLeftButton && (
                        <button
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black shadow-md rounded-full p-2 text-white hidden md:flex items-center justify-center"
                            aria-label="Scroll left"
                            onClick={() => {
                                const container = document.getElementById(
                                    "suggested-container"
                                );
                                if (container) container.scrollLeft -= 300;
                            }}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                    )}

                    {/* Video Container */}
                    <div
                        id="suggested-container"
                        className="w-full overflow-x-auto pb-4 px-1 scrollbar-custom"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        {/* Video Grid */}
                        <div className="grid grid-flow-col auto-cols-[320px] gap-4 min-w-max">
                            {storyChannels.map((channel) => {
                                const currentVideo = getCurrentVideoForChannel(channel);
                                const currentIndex = getCurrentVideoIndex(channel);

                                return (
                                    <div
                                        key={channel.id}
                                        className="relative group overflow-hidden flex flex-col h-80"
                                    >
                                        {/* Video Thumbnail */}
                                        <div
                                            className={`flex-1 relative transition-all duration-300 overflow-hidden bg-gradient-to-b from-blue-900 to-blue-800 rounded-xl ${isTransitioning[channel.id]
                                                ? "opacity-0 translate-x-2"
                                                : "opacity-100 translate-x-0"
                                                }`}
                                        >
                                            {/* Background Image */}
                                            <div
                                                className="absolute inset-0 bg-cover bg-center"
                                                style={{
                                                    backgroundImage: `url(${currentVideo?.thumbnail ||
                                                        "/stories/placeholder-user-1.jpg"
                                                        })`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                }}
                                            />

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

                                            {/* Video Navigation Dots */}
                                            {channel.videos && channel.videos.length > 1 && (
                                                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                                    {channel.videos.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleVideoSwitch(channel.id, index);
                                                            }}
                                                            className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex
                                                                ? "bg-white"
                                                                : "bg-white/50 hover:bg-white/75"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            {/* Video Info Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center space-x-2">
                                                        {channel.verified && (
                                                            <CheckCircle className="h-4 w-4 text-blue-400" />
                                                        )}
                                                        <span className="text-white text-sm font-semibold">
                                                            {channel.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <span className="text-white/80 text-xs">
                                                            {currentVideo?.duration}
                                                        </span>
                                                    </div>
                                                </div>

                                                <h3 className="text-white text-sm font-semibold leading-tight line-clamp-2 mb-2">
                                                    {currentVideo?.title}
                                                </h3>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-white/60 text-xs">
                                                            {currentVideo?.views} views
                                                        </span>
                                                        <span className="text-white/60 text-xs">•</span>
                                                        <span className="text-white/60 text-xs">
                                                            {currentVideo?.timeAgo}
                                                        </span>
                                                    </div>

                                                    {/* YouTube-style Play Button */}
                                                    <div className="bg-red-600 hover:bg-red-700 rounded-full p-2 transition-colors">
                                                        <Play className="h-4 w-4 text-white fill-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Channel Info */}
                                        <div className="p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Avatar className="w-10 h-10">
                                                        <AvatarImage
                                                            src={channel.avatar}
                                                            alt={channel.name}
                                                        />
                                                        <AvatarFallback className="bg-white/20 text-white text-xs">
                                                            {channel.name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <span className="text-white text-xs font-semibold truncate block">
                                                            {channel.name}
                                                        </span>
                                                        <span className="text-white/60 text-xs">
                                                            {channel.followers} followers
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                {/* <div className="flex items-center space-x-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="bg-black/50 hover:bg-black/70 rounded-full p-1 transition-colors">
                                <MoreHorizontal className="h-3 w-3 text-white" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem>
                                <UserPlus className="mr-2 h-4 w-4" />
                                <span>Follow {channel.name}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share className="mr-2 h-4 w-4" />
                                <span>Share</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <HelpCircle className="mr-2 h-4 w-4" />
                                <span>Why am I seeing this?</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div> */}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Navigation Button */}
                    {showRightButton && (
                        <button
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black shadow-md rounded-full p-2 text-white hidden md:flex items-center justify-center"
                            aria-label="Scroll right"
                            onClick={() => {
                                const container = document.getElementById(
                                    "suggested-container"
                                );
                                if (container) container.scrollLeft += 300;
                            }}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </section>
        </section>
    );
};

export default DiscoverClient;
