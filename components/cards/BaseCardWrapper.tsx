import React, { useState } from "react"
import { MoreVertical, X } from "lucide-react"
import { Card, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { VerifiedBadge } from "@/components/verified-badge"
import { HoverableUser } from "@/components/HoverableUser"
import { SocialPost } from "@/types/social-learning"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BaseCardWrapperProps {
    post: SocialPost
    isDetailView?: boolean
    children: React.ReactNode
}

export function BaseCardWrapper({ post, isDetailView = false, children }: BaseCardWrapperProps) {
    const [isFollowing, setIsFollowing] = useState(false)

    const handleFollow = () => {
        setIsFollowing(!isFollowing)
        console.log(isFollowing ? 'Unfollowed' : 'Followed', post.author.displayName)
    }

    return (
        <Card className="md:rounded-2xl rounded-none border border-border bg-card hover:bg-card/50 transition-colors duration-200">
            <CardHeader className="p-4 pb-0">
                <div className="flex items-center justify-between space-x-3 group">
                    <div className="flex-1 flex items-center gap-3">
                        <div
                            className="flex items-center gap-3"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative">
                                <Avatar className="h-10 w-10 border shrink-0 bg-background overflow-hidden rounded-full">
                                    <AvatarImage src={post.author.avatar} alt={post.author.displayName} />
                                    <AvatarFallback>{post.author.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                {post.community && (
                                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border-2 border-background overflow-hidden flex items-center justify-center" style={{ backgroundColor: post.community.color + '20' }}>
                                        {post.community.flag && ['es', 'cn', 'kr', 'fr', 'tz', 'ng'].includes(post.community.flag) ? (
                                            <img
                                                src={`/flag/${post.community.flag}.png`}
                                                alt={post.community.name}
                                                className="w-full h-full object-cover rounded-full"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <span className={`text-xs font-bold ${post.community.flag && ['es', 'cn', 'kr', 'fr', 'tz', 'ng'].includes(post.community.flag) ? 'hidden' : ''}`} style={{ color: post.community.color }}>
                                            {post.community.name.charAt(0)}
                                        </span>
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <HoverableUser
                                    user={{
                                        id: post.author.id,
                                        username: post.author.username,
                                        displayName: post.author.displayName,
                                        avatar: post.author.avatar,
                                        bio: post.author.bio,
                                        verified: post.author.verified,
                                        type: post.author.type,
                                        location: post.author.location,
                                        joinDate: post.author.joinDate,
                                        followers: post.author.followers,
                                        following: post.author.following,
                                        level: post.author.level,
                                        xp: post.author.xp,
                                        streak: post.author.streak
                                    }}
                                    onFollowClick={handleFollow}
                                    isFollowing={isFollowing}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-medium text-foreground line-clamp-1 w-fit hover:text-muted-foreground">{post.author.displayName}</h3>
                                        {post.author.verified && <VerifiedBadge accountType="user" />}
                                    </div>
                                </HoverableUser>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">@{post.author.username}</span>
                                    {post.community && (
                                        <>
                                            <span className="text-muted-foreground">•</span>
                                            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors" style={{ color: post.community.color }}>
                                                {post.community.name}
                                            </span>
                                        </>
                                    )}
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row items-center space-x-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-card text-foreground flex items-center p-1 rounded-lg duration-500 transition-all"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreVertical className="!size-[22px]" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="border-2 rounded-xl bg-muted shadow-sm" align="start">
                                <DropdownMenuItem>Follow @{post.author.username}</DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-card cursor-pointer">Save post</DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-card cursor-pointer">Copy link</DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-card cursor-pointer">Report post</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link href={"#trending"} className="hover:bg-card text-foreground flex items-center p-1 rounded-lg duration-500 transition-all">
                            <X className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </CardHeader>
            {children}
        </Card>
    )
}