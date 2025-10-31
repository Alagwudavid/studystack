"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
    CalendarDays,
    Trophy,
    Flame,
    Zap,
    Star,
    BookOpen,
    Clock,
    Globe,
    Edit,
    Camera,
    Share2,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ContributionGrid from "@/components/ContributionGrid";
import type { User } from "@/types/user";

interface UserMediaPageProps {
    params: Promise<{
        username: string;
    }>;
}

export default function UserMediaPage({ params }: UserMediaPageProps) {
    const [username, setUsername] = useState<string>("");
    const { user: serverUser } = useAuth();
    const isMobile = useIsMobile();

    useEffect(() => {
        const getParams = async () => {
            const resolvedParams = await params;
            setUsername(resolvedParams.username);
        };
        getParams();
    }, [params]);

    if (isMobile === undefined || !username) return null;

    const userStats = {
        name: serverUser?.name || "User",
        username: serverUser?.username ? `@${serverUser.username}` : "@user",
        email: serverUser?.email || "user@example.com",
        joinDate: "March, 2024",
        totalXP: serverUser?.points || 0,
        currentStreak: serverUser?.streak_count || 0,
        longestStreak: 89,
        languagesLearning: 3,
        lessonsCompleted: 234,
        timeSpent: "127 hours",
        level: serverUser?.level || 15,
        rank: "Sapphire League",
        position: 3,
        friends: 28,
        achievements: 24,
    };

    const languages = [
        {
            name: "Swahili",
            flag: "🇹🇿",
            level: 8,
            progress: 75,
            xp: 5420,
            streak: 47,
            lessonsCompleted: 89,
        },
        {
            name: "Yoruba",
            flag: "🇳🇬",
            level: 5,
            progress: 45,
            xp: 3200,
            streak: 23,
            lessonsCompleted: 56,
        },
        {
            name: "Amharic",
            flag: "🇪🇹",
            level: 3,
            progress: 30,
            xp: 1800,
            streak: 12,
            lessonsCompleted: 34,
        },
    ];

    const achievements = [
        {
            id: 1,
            title: "First Steps",
            description: "Complete your first lesson",
            icon: "🏯",
            earned: true,
            date: "March 15, 2024",
        },
        {
            id: 2,
            title: "Week Warrior",
            description: "Maintain a 7-day streak",
            icon: "🔥",
            earned: true,
            date: "March 22, 2024",
        },
        {
            id: 3,
            title: "Language Explorer",
            description: "Start learning 3 languages",
            icon: "🌍",
            earned: true,
            date: "April 5, 2024",
        },
        {
            id: 4,
            title: "XP Master",
            description: "Earn 10,000 XP",
            icon: "⚡",
            earned: true,
            date: "May 18, 2024",
        },
        {
            id: 5,
            title: "Perfect Week",
            description: "Complete all lessons for a week",
            icon: "✨",
            earned: true,
            date: "June 2, 2024",
        },
        {
            id: 6,
            title: "Century Club",
            description: "Complete 100 lessons",
            icon: "💯",
            earned: false,
            date: null,
        },
    ];

    const recentActivity = [
        {
            type: "lesson",
            title: "Completed: Swahili Greetings",
            xp: 15,
            time: "2 hours ago",
            icon: BookOpen,
        },
        {
            type: "achievement",
            title: "Earned: Perfect Week",
            xp: 50,
            time: "1 day ago",
            icon: Trophy,
        },
        {
            type: "streak",
            title: "47-day streak milestone!",
            xp: 25,
            time: "2 days ago",
            icon: Flame,
        },
        {
            type: "level",
            title: "Reached Level 8 in Swahili",
            xp: 100,
            time: "3 days ago",
            icon: Star,
        },
    ];

    return (
        <div className="py-6 space-y-8 text-white min-h-screen">
            {/* Created Playlists Section */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-6">Created playlists</h2>

                {/* Playlist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {/* Sample Playlists */}
                    {[
                        {
                            title: "Learning Web Development With PHP and MySQL",
                            module: "Module 1, Part 1",
                            videos: 22,
                            thumbnail: "🐘"
                        },
                        {
                            title: "Introduction to PYTHON Programming",
                            module: "Module 1, Part 1",
                            videos: 255,
                            thumbnail: "🐍"
                        },
                        {
                            title: "PYTHON CODE ALONG WITH ME",
                            module: "DAY 1",
                            videos: 70,
                            thumbnail: "🐍"
                        },
                        {
                            title: "Web Development Using JavaScript",
                            module: "Module 1, Part 1",
                            videos: 103,
                            thumbnail: "⚡"
                        },
                        {
                            title: "Introduction to Python Programming - Full Course",
                            videos: 203,
                            thumbnail: "🐍"
                        }
                    ].map((playlist, index) => (
                        <div key={index} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors cursor-pointer">
                            <div className="aspect-video bg-gray-800 flex items-center justify-center text-4xl relative">
                                {playlist.thumbnail}
                                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                    {playlist.videos} videos
                                </div>
                            </div>
                            <div className="p-3">
                                <h3 className="font-medium text-sm text-white line-clamp-2 mb-1">
                                    {playlist.title}
                                </h3>
                                {playlist.module && (
                                    <p className="text-xs text-gray-400 mb-1">
                                        {playlist.module}
                                    </p>
                                )}
                                <p className="text-xs text-gray-400">
                                    View full playlist
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Videos Section */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-6">Videos</h2>
                <div className="text-center text-gray-400 py-12">
                    <div className="text-4xl mb-4">🎬</div>
                    <p className="text-sm text-gray-500">Recent videos will appear here</p>
                </div>
            </div>
        </div>
    );
}
