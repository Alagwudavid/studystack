"use client";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowUpFromDot, X, Zap, Verified, Hash, TrendingUp, Megaphone, MoreHorizontal, Flame, Users } from "lucide-react";
import { SkeletonAside } from "@/components/ui/skeleton-aside";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import FollowButton from "@/components/FollowButton";
import { SearchBar } from "../SearchBar";

interface SuggestedUser {
    id: number;
    username: string;
    name: string;
    avatar: string;
    bio?: string;
    is_professional: boolean;
    is_following: boolean;
    followers_count: number;
}

export function RightSidebar() {
    const pathname = usePathname();
    const hideAsideBar =
        ["/beet", "/settings", "/reels"].includes(pathname) ||
        ["/learn", "/community"].some((route) => pathname.startsWith(route));

    const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    // Fetch suggested users
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                setLoadingUsers(true);
                const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

                // Get auth token
                const getAuthToken = () => {
                    if (typeof window !== "undefined") {
                        return localStorage.getItem("auth_token") ||
                            sessionStorage.getItem("auth_token") ||
                            getCookie("client_auth_token");
                    }
                    return null;
                };

                const getCookie = (name: string) => {
                    if (typeof document === "undefined") return null;
                    const value = `; ${document.cookie}`;
                    const parts = value.split(`; ${name}=`);
                    if (parts.length === 2) return parts.pop()?.split(";").shift();
                    return null;
                };

                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Protection': '1',
                };

                const authToken = getAuthToken();
                if (authToken) {
                    headers['Authorization'] = `Bearer ${authToken}`;
                }

                // Use Next.js API route to avoid CORS issues
                const response = await fetch('/api/suggested/users?filter=not_following&limit=10', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.users) {
                        setSuggestedUsers(data.users);
                    }
                } else {
                    console.error('Failed to fetch suggested users:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching suggested users:', error);
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchSuggestedUsers();
    }, []);

    const handleFollowChange = (userId: number, isFollowing: boolean, followersCount: number) => {
        setSuggestedUsers(prev =>
            prev.map(user =>
                user.id === userId
                    ? { ...user, is_following: isFollowing, followers_count: followersCount }
                    : user
            )
        );
    };

    const trendingTags = [
        "#mechanical",
        "#medicine",
        "#web-3",
        "#mechatronics",
        "#90daysofJAMB"
    ];

    const stories = [
        {
            id: 1,
            source: "UNN Info",
            time: "2h",
            title:
                "200 students accepted for admissions",
            badge: "Tips",
        },
        {
            id: 2,
            source: "The Guardian",
            time: "2h",
            badge: "DIY",
            title:
                "Hamas tells mediators it approves latest Gaza ceasefire proposal – Middle East...",
        },
        {
            id: 3,
            source: "The Independent",
            time: "1h",
            title:
                "Is a man found guilty of attempted murder when seen approaching a restaurant",
            badge: "Q&A",
        },
    ];

    return (
        <aside className={`w-96 py-4 shrink-0 lg:block hidden relative overflow-y-auto scrollbar-custom scrollbar-hide h-full ${hideAsideBar ? 'lg:hidden' : ''}`}>
            <div className="space-y-6 px-2">
                {/* <Card className="bg-background border-0 rounded-none p-0 space-y-4">
                    <SearchBar />
                </Card> */}
                {/* <Card className="bg-background border-0 rounded-none p-0 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-destructive">
                            <span className="font-semibold text-lg text-foreground">
                               Live
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M6.343 4.938a1 1 0 0 1 0 1.415a8.003 8.003 0 0 0 0 11.317a1 1 0 1 1-1.414 1.414c-3.907-3.906-3.907-10.24 0-14.146a1 1 0 0 1 1.414 0m12.732 0c3.906 3.907 3.906 10.24 0 14.146a1 1 0 0 1-1.415-1.414a8.003 8.003 0 0 0 0-11.317a1 1 0 0 1 1.415-1.415M9.31 7.812a1 1 0 0 1 0 1.414a3.92 3.92 0 0 0 0 5.544a1 1 0 1 1-1.415 1.414a5.92 5.92 0 0 1 0-8.372a1 1 0 0 1 1.415 0m6.958 0a5.92 5.92 0 0 1 0 8.372a1 1 0 0 1-1.414-1.414a3.92 3.92 0 0 0 0-5.544a1 1 0 0 1 1.414-1.414m-4.186 2.77a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"></path></svg>
                        </div>
                    </div>

                    <ul className="gap-4 grid grid-cols-1">
                        {stories.map((story) => (
                            <li key={story.id} className={cn("flex-col gap-2", story.id === 1? "flex" : "hidden")}>
                                <div className="flex-1 flex flex-row items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded bg-card"></span>
                                        <span className="text-sm line-clamp-1 text-foreground font-semibold">{story.source}</span>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="text-muted-foreground">•</span>
                                            <span>{story.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="text-muted-foreground">•</span>
                                            <span>2k watching</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="w-full h-fit aspect-video animate-pulse shrink-0 rounded-lg bg-card"></span>
                            </li>
                        ))}
                    </ul>
                </Card> */}
                {/* <Card className="bg-background border rounded-2xl p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground text-lg">
                                Spaces
                            </span>
                        </div>
                        <button className="text-foreground text-sm hover:underline">
                            Open chat
                        </button>
                    </div>

                    <ul className="gap-4 grid grid-cols-2">
                        {stories.map((story) => (
                            <li key={story.id} className="flex items-center flex-col  gap-2">
                                <span className="w-20 h-20 shrink-0 rounded bg-card"></span>
                                <div className="flex-1 flex flex-col items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm line-clamp-1 text-foreground font-semibold">{story.source}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>2 new</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card> */}

                {/* Latest Bits */}
                <Card className="bg-background border rounded-2xl p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground text-lg">
                                Trending
                            </span>
                        </div>
                        <button className="text-foreground text-sm hover:underline">
                            See more
                        </button>
                    </div>

                    <ul className="space-y-4">
                        {stories.map((story) => (
                            <li key={story.id} className="flex items-center flex-row justify-between gap-2">
                                <div className="flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className="w-4 h-4 rounded bg-card"></span>
                                        <span>{story.source}</span>
                                    </div>
                                    <p className="mt-1 text-gray-800 dark:text-gray-200 font-medium leading-snug line-clamp-2">
                                        {story.title}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>{story.time}</span>
                                        <span>·</span>
                                        <span>2 readers</span>
                                    </div>
                                </div>
                                <span className="w-12 h-12 shrink-0 rounded bg-card"></span>
                            </li>
                        ))}
                    </ul>
                </Card>
                {/* Suggested Users to Follow */}
                <Card className="bg-background border-none rounded-none p-4 shadow-none space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                                Suggested follows
                            </span>
                        </div>
                        <Link href={"/explore"} className="text-foreground">view all</Link>
                    </div>

                    {loadingUsers ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-3 animate-pulse">
                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                    </div>
                                    <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : suggestedUsers.length > 0 ? (
                        <div className="space-y-3">
                            {suggestedUsers.slice(0, 5).map((user) => (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 flex-1">
                                        <Link href={`/@${user.username}`}>
                                            <Avatar className="w-10 h-10 cursor-pointer border hover:ring-2 hover:ring-blue-200 transition-all">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                                    {user.name.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1">
                                                <Link href={`/@${user.username}`} className="capitalize font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                    {user.name}
                                                </Link>
                                                {user.is_professional && (
                                                    <Verified className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {Math.floor(Math.random() * 90 + 10)}.{Math.floor(Math.random() * 10)}K followers
                                            </p>
                                        </div>
                                    </div>
                                    <FollowButton
                                        userId={user.id}
                                        username={user.username}
                                        initialIsFollowing={user.is_following}
                                        initialFollowersCount={user.followers_count}
                                        variant="outline"
                                        size="sm"
                                        showText={false}
                                        onFollowChange={(isFollowing, followersCount) =>
                                            handleFollowChange(user.id, isFollowing, followersCount)
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                No suggestions available
                            </p>
                        </div>
                    )}

                    {suggestedUsers.length > 5 && (
                        <div className="flex items-center justify-start pt-2">
                            <Link href="/explore" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                                See more suggestions
                            </Link>
                        </div>
                    )}
                </Card>

                {/* Trending Tags */}
                {/* <Card className="bg-background border-none rounded-none p-4 shadow-none space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                                Trending Tags
                            </span>
                        </div>
                        <Link href={"/explore"} className="text-foreground">view all</Link>
                    </div>
                    <div className="">
                        {trendingTags.map((topic, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer"
                            >
                                <div className="w-8 h-8 bg-base rounded-md flex items-center justify-center flex-shrink-0">
                                    <Hash className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-foreground text-sm truncate">
                                        {topic.replace('#', '')}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">
                                        {Math.floor(Math.random() * 900 + 100)}.{Math.floor(Math.random() * 10)}K Posts
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card> */}

                <Card className="bg-background border-none rounded-none p-4 shadow-none space-y-4">
                    <div>
                        <ul className="flex items-center gap-2">
                            <li>About</li>
                            <li>Help</li>
                            <li>Privacy</li>
                            <li>Terms</li>
                        </ul>
                    </div>
                    <span className="">Bitroot © 2025 from BitByBit, llc</span>
                </Card>
            </div>
        </aside>
    );
}
