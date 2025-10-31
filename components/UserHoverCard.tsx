"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { VerifiedBadge } from "@/components/verified-badge"
import { Users, MapPin, Calendar, Plus, Check } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface UserHoverCardProps {
    user: {
        id: string | number
        username?: string
        displayName: string
        avatar: string
        bio?: string
        verified?: boolean
        type?: "plus" | "founder" | "expert" | "institution" | "user" | "creator" | "instructor"
        location?: string
        joinDate?: string
        followers?: number
        following?: number
        level?: number
        xp?: number
        streak?: {
            current: number
        }
    }
    isFollowing?: boolean
    onFollowClick?: () => void
    className?: string
}

export function UserHoverCard({
    user,
    isFollowing = false,
    onFollowClick,
    className
}: UserHoverCardProps) {
    const formatNumber = (num: number | undefined) => {
        if (!num) return "0"
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
        return num.toString()
    }

    const getAccountType = (userType: string | undefined): "user" | "creator" | "instructor" | "institution" => {
        switch (userType) {
            case "founder":
            case "expert":
                return "creator"
            case "institution":
                return "institution"
            case "instructor":
                return "instructor"
            default:
                return "user"
        }
    }

    const formatJoinDate = (dateString: string | undefined) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return `Joined ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    }

    return (
        <Card className={cn("w-80 shadow-lg border bg-muted backdrop-blur-sm rounded-3xl", className)}>
            <CardContent className="p-4 flex flex-col gap-2 w-full">
                <div className="w-full flex-1 !h-[120px] p-2 shrink-0 rounded-lg bg-primary/30"></div>

                {/* Header with avatar and basic info */}
                <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                        <AvatarImage src={user.avatar} alt={user.displayName} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Link
                                href={`/users/${user.username || user.id}`}
                                className="font-semibold text-foreground hover:underline truncate"
                            >
                                {user.displayName}
                            </Link>
                            {user.verified && (
                                <VerifiedBadge accountType={getAccountType(user.type)} />
                            )}
                        </div>

                        {user.username && (
                            <p className="text-sm text-muted-foreground truncate">
                                @{user.username}
                            </p>
                        )}
                    </div>
                </div>

                {/* Bio */}
                {user.bio && (
                    <p className="text-sm text-foreground mb-3 line-clamp-2 leading-relaxed">
                        {user.bio}
                    </p>
                )}

                {/* Location and join date */}
                {/* <div className="flex flex-row items-center justify-between gap-1 mb-3 text-xs text-muted-foreground">
                    {user.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{user.location}</span>
                        </div>
                    )}
                    {user.joinDate && (
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatJoinDate(user.joinDate)}</span>
                        </div>
                    )}
                </div> */}

                {/* Followers and following */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                        <span className="font-semibold text-foreground">
                            {formatNumber(user.following)}
                        </span>
                        <span className="text-muted-foreground">Following</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="font-semibold text-foreground">
                            {formatNumber(user.followers)}
                        </span>
                        <span className="text-muted-foreground">Followers</span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant={isFollowing ? "outline" : "default"}
                        className="flex-1"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onFollowClick?.()
                        }}
                    >
                        {isFollowing ? (
                            <>
                                <Check className="w-4 h-4 mr-1" />
                                Following
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4 mr-1" />
                                Follow
                            </>
                        )}
                    </Button>

                    {/* <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="px-3"
                    >
                        <Link href={`/users/${user.username || user.id}`}>
                            Profile
                        </Link>
                    </Button> */}
                </div>
            </CardContent>
        </Card>
    )
}