"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, TrendingUp, Globe } from "lucide-react";
import { communities } from "@/data/communities";

const CommunityClient = () => {
    const recentPosts = [
        {
            user: "Amara K.",
            avatar: "/placeholder-user.jpg",
            community: "Swahili Learners",
            title: "Daily Swahili Phrase: Hakuna Matata!",
            content:
                "Let's practice using this famous phrase in different contexts...",
            likes: 45,
            comments: 12,
            time: "2 hours ago",
        },
        {
            user: "Kwame A.",
            avatar: "/placeholder-user.jpg",
            community: "Yoruba Culture & Language",
            title: "Understanding Yoruba Proverbs",
            content:
                'Today I learned a beautiful proverb: "Bi a ba n gun igi bi aja..."',
            likes: 32,
            comments: 8,
            time: "4 hours ago",
        },
        {
            user: "Desta M.",
            avatar: "/placeholder-user.jpg",
            community: "Amharic Study Group",
            title: "Weekly Challenge: Describe Your Day",
            content:
                "This week's challenge is to describe your daily routine in Amharic...",
            likes: 28,
            comments: 15,
            time: "1 day ago",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-[#fafafa] mb-2">
                    Language Communities
                </h1>
                <p className="text-gray-600 dark:text-[#fafafa]/70">
                    Connect with learners and native speakers from around the world
                </p>
            </div>
            {/* Stats Bar */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Overview</h2>
                <div className="space-y-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <Card className="p-4 text-center bg-gradient-to-br from-threads-primary/10 to-threads-primary/5 border-threads-primary/20">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                            <TrendingUp className="h-4 w-4 text-threads-primary" />
                            <span className="text-xl font-bold text-threads-primary">2.4M</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Total Visits</p>
                    </Card>

                    <Card className="p-4 text-center bg-gradient-to-br from-threads-secondary/10 to-threads-secondary/5 border-threads-secondary/20">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                            <Users className="h-4 w-4 text-threads-secondary" />
                            <span className="text-xl font-bold text-threads-secondary">156K</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Learners</p>
                    </Card>

                    <Card className="p-4 text-center bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                            <Globe className="h-4 w-4 text-accent" />
                            <span className="text-xl font-bold text-accent">25</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Languages</p>
                    </Card>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Communities Grid */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {communities.map((community) => (
                            <Card
                                key={community.name}
                                className="rounded-2xl hover:shadow-lg dark:bg-[#0d1117] dark:border-gray-700 dark:hover:border-[#7037e4] transition-all duration-200"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#072ac8] hover:bg-[#1e96fc] dark:bg-[#7037e4] dark:hover:bg-[#8ddeed] dark:hover:text-[#030318] text-white group-hover:bg-[#1e96fc] dark:group-hover:bg-[#8ddeed] dark:group-hover:text-[#030318] flex items-center justify-center">
                                                <img
                                                    src={`/flag/${community.flag}.png`}
                                                    alt={`${community.flag} flag`}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg dark:text-[#fafafa]">
                                                    {community.name}
                                                </CardTitle>
                                                <div className="flex items-center space-x-1">
                                                    <span className="text-sm uppercase">{community.moderators} mods</span>
                                                    {community.trending && (
                                                        <Badge className="bg-[#fcf300] text-[#072ac8] dark:bg-[#8ddeed] dark:text-[#030318] hover:bg-[#ffc600] dark:hover:bg-[#8ddeed]/80 rounded-full">
                                                            <TrendingUp className="w-3 h-3 mr-1" />
                                                            Trending
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-[#fafafa]/70 text-sm mb-4">
                                        {community.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-[#fafafa]/60">
                                            <div className="flex items-center space-x-1">
                                                <Users className="w-4 h-4" />
                                                <span>{community.members.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <MessageCircle className="w-4 h-4" />
                                                <span>{community.posts}</span>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="rounded-xl bg-[#072ac8] hover:bg-[#1e96fc] dark:bg-[#7037e4] dark:hover:bg-[#8ddeed] dark:hover:text-[#030318] text-white"
                                        >
                                            Join Community
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
                {/* Recent Activity Sidebar */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* Community Regulations */}
                    <Card className="rounded-2xl dark:bg-[#0d1117] dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Users className="w-5 h-5 text-[#1e96fc] dark:text-[#8ddeed]" />
                                <span className="dark:text-[#fafafa]">
                                    Community Regulations
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-[#fafafa]/70 space-y-2">
                                <li>Be respectful and supportive to all members</li>
                                <li>No spam, advertising, or self-promotion</li>
                                <li>Use appropriate language and content</li>
                                <li>Stay on topic and contribute constructively</li>
                                <li>Report any inappropriate behavior to moderators</li>
                            </ul>
                        </CardContent>
                    </Card>
                    {/* Recent Activity */}
                    <Card className="rounded-2xl dark:bg-[#0d1117] dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Globe className="w-5 h-5 text-[#1e96fc] dark:text-[#8ddeed]" />
                                <span className="dark:text-[#fafafa]">Recent Activity</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentPosts.map((post, index) => (
                                <div
                                    key={index}
                                    className="border-b border-gray-100 dark:border-[#7037e4]/20 last:border-b-0 pb-4 last:pb-0"
                                >
                                    <div className="flex items-start space-x-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage
                                                src={post.avatar || "/placeholder.svg"}
                                                alt={post.user}
                                            />
                                            <AvatarFallback className="bg-[#a2d6f9] text-[#072ac8] dark:bg-[#7037e4] dark:text-[#fafafa]">
                                                {post.user.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="font-medium text-sm text-gray-800 dark:text-[#fafafa]">
                                                    {post.user}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-[#fafafa]/60">
                                                    in {post.community}
                                                </span>
                                            </div>
                                            <h4 className="font-medium text-sm text-gray-800 dark:text-[#fafafa] mb-1">
                                                {post.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-[#fafafa]/70 mb-2">
                                                {post.content}
                                            </p>
                                            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-[#fafafa]/50">
                                                <span>{post.likes} likes</span>
                                                <span>{post.comments} comments</span>
                                                <span>{post.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CommunityClient;
