"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import {
    CirclePlus, Camera, TrendingUp, Users, Globe, Crown, Medal, Award,
    ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Swords, LibraryBig, Compass, UsersRound,
    Headphones, Play, RefreshCcw, BookOpen, MessagesSquareIcon, Plus
} from "lucide-react";
import PostCard from "@/components/PostCard";

import { socialLearningPosts } from "@/data/social-learning";
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
import type { User } from "@/types/user";

interface UserClientProps {
    serverUser?: User;
    username: string;
}

const audiowide = Audiowide({
    subsets: ["latin"],
    weight: "400",
});

const UserClient = ({ serverUser, username }: UserClientProps) => {

    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const { setServerUser } = useAuth();
    const { user, isAuthenticated } = useLayoutContext();

    // Use dynamic title hook to update page title with notification count
    useDynamicTitle({
        baseTitle: 'Profile - Bitroot'
    });

    // Use the context authentication state
    const isUserAuthenticated = isAuthenticated;
    // Set server user in auth context if provided
    useEffect(() => {
        if (serverUser) {
            setServerUser(serverUser);
        }
    }, [serverUser, setServerUser]);

    return (
        <div className="bg-background">
            <span>Private contents (Drafts)</span>
        </div>
    );
};

export default UserClient;
