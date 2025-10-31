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
import { SearchBar } from "@/components/SearchBar";

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
        <section className="min-h-screen flex flex-col items-center justify-center">
            <div className="p-4 max-w-3xl mx-auto mb-3">
                {/* <span className="text-lg font-semibold">Discover</span> */}
                <p className="text-lg text-gray-300 mt-6 mb-8 text-center">
                    Access to educational resources that helps you find what people have to offer on the internet.
                </p>
            </div>
            <SearchBar />
            <div className="p-4 max-w-3xl w-full mx-auto mb-3">
                <div className="grid grid-cols-5 gap-3 w-full h-40">
                    <div className="w-full h-full bg-card rounded-xl">1</div>
                    <div className="w-full h-full bg-card rounded-xl">2</div>
                    <div className="w-full h-full bg-card rounded-xl">3</div>
                    <div className="w-full h-full bg-card rounded-xl">4</div>
                    <div className="w-full h-full bg-card rounded-xl">5</div>
                </div>
            </div>
            <div className="p-4 max-w-3xl mx-auto mb-3">
                Suggestions
            </div>
        </section>
    );
};

export default DiscoverClient;
