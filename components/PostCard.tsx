import React, { useState, useMemo } from "react"
import { Heart, MessageCircle, X, CircleCheck, Award, MoreVertical, Clock, Users, Star, Trophy, Zap, ExternalLink, SquareArrowOutUpRight, Plus, Link2Icon } from "lucide-react"
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { VerifiedBadge } from "@/components/verified-badge"
import { MediaGallery } from '@/components/MediaGallery'
import { HoverableUser } from "@/components/HoverableUser"
import { useRouter } from "next/navigation"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SocialPost } from "@/types/social-learning"
import { Tooltip } from "@/components/ui/tooltip"
import Link from "next/link"

interface PostCardProps {
    post: SocialPost
    isDetailView?: boolean
}

const PostTypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case "achievement":
            return <Trophy className="size-4 mr-1" />
        case "tip":
            return <Star className="size-4 mr-1" />
        case "question":
            return <MessageCircle className="size-4 mr-1" />
        case "project":
            return <Zap className="size-4 mr-1" />
        case "collaboration":
            return <Users className="size-4 mr-1" />
        case "milestone":
            return <Trophy className="size-4 mr-1" />
        case "resource":
            return <ExternalLink className="size-4 mr-1" />
        case "study-session":
            return <Clock className="size-4 mr-1" />
        case "poll":
            return <MessageCircle className="size-4 mr-1" />
        default:
            return <MessageCircle className="size-4 mr-1" />
    }
}

const ReactionButton = ({
    icon,
    activeIcon,
    count,
    label,
    isActive,
    onClick,
    activeColor = "text-red-500"
}: {
    icon: React.ReactNode
    activeIcon?: React.ReactNode
    count?: string | number
    label?: string
    isActive: boolean
    onClick: () => void
    activeColor?: string
}) => (
    <Button
        variant="post_action"
        size="post_fit"
        className={`gap-1 p-2 w-full hover:bg-card flex items-center justify-start ${isActive ? activeColor : "text-foreground"} transition-colors`}
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
    >
        <div className="">{isActive ? (activeIcon || icon) : icon}</div>
        <span className="text-foreground">{count}</span>
    </Button>
)





export default function PostCard({ post, isDetailView = false }: PostCardProps) {
    const router = useRouter()
    const [isLiked, setIsLiked] = useState(post.isLiked ?? false)
    const [isSaved, setIsSaved] = useState(post.isSaved ?? false)
    const [showFullContent, setShowFullContent] = useState(false)
    const [likeCount, setLikeCount] = useState(post.engagement.reactions?.like || 0)
    const [isFollowing, setIsFollowing] = useState(false) // Track following status

    // Determine if "Read more" should be shown (randomly for half the posts, exclude ads and link types)
    const shouldShowReadMore = useMemo(() => {
        if (post.type === 'ads' || post.type === 'sponsored' || post.type === 'link') {
            return false;
        }
        // Use post.id as seed for consistent randomness
        return (post.id % 2) === 0; // Show for even IDs (approximately half)
    }, [post.id, post.type]);

    const handleLike = () => {
        setIsLiked(!isLiked)
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    }

    const handleFollow = () => {
        setIsFollowing(!isFollowing)
        // Here you would typically make an API call to follow/unfollow the user
        console.log(isFollowing ? 'Unfollowed' : 'Followed', post.author.displayName)
    }

    // const handlePostClick = (e: React.MouseEvent) => {
    //     // Don't navigate if we're in detail view or clicking on interactive elements
    //     if (isDetailView) return;

    //     const target = e.target as HTMLElement;
    //     const isInteractiveElement = target.closest('button, a, [role="button"]');

    //     if (!isInteractiveElement) {
    //         router.push(`/posts/${post.slug}`);
    //     }
    // }

    // Move contentPreview above repost logic
    const contentPreview = post.content.length > 280
        ? post.content.substring(0, 280) + "..."
        : post.content;

    const { reposter, quote, originalPostId } = post.repost ?? {};

    const StyledCard = styled(Card)`
        padding: 1rem;
        border: 0px;
        // border: hsl(var(--border)) 2px solid;
        background: hsl(var(--card) / 0.3);
        box-shadow: none;
        color: hsl(var(--foreground));
        display: flex;
        flex-direction: column;
        width: 100%;
        margin: 0 auto;
        transition: colors 0.2s ease;
        position: relative;
        outline: none;
        ring: 0;
        
        &:focus {
            ring: 0;
        }
        
        ${!isDetailView && css`
            cursor: pointer;
            &:hover {
                // background: hsl(var(--card));
                // background: hsl(var(--muted) / 0.3);
            }
        `}
        
        @media (prefers-color-scheme: dark) {
            // background: hsl(var(--background));
            background: hsl(var(--muted) / 0.7);
        }
        
        @media (max-width: 768px) {
            border: 2px 0px;
        }
    `;

    return (
        <StyledCard
            tabIndex={post.id}
            className="md:rounded-2xl rounded-none"
        >
            <CardHeader className="p-0">
                <div className="flex items-center justify-between space-x-3 group">
                    <div className="flex-1 flex items-center gap-3">

                        <div
                            className="flex items-center gap-3"
                            onClick={(e) => e.stopPropagation()}
                        >
                                {post.community ? (
                                    <div className="relative">
                                        <Avatar className="w-10 h-10 shrink-0 bg-background overflow-hidden rounded-full">
                                            <AvatarImage src={post.author.avatar} alt={post.author.displayName} />
                                            <AvatarFallback>{post.author.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded bg-card overflow-hidden" style={{ backgroundColor: post.community.color + '20' }}>
                                            {post.community.flag && ['es', 'cn', 'kr', 'fr', 'tz', 'ng'].includes(post.community.flag) ? (
                                                <img
                                                    src={`/flag/${post.community.flag}.png`}
                                                    alt={post.community.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                            ) : null}
                                            <span className={`w-full h-full text-xs font-bold bg-card flex items-center justify-center ${post.community.flag && ['es', 'cn', 'kr', 'fr', 'tz', 'ng'].includes(post.community.flag) ? 'hidden' : ''}`} style={{ color: post.community.color }}>
                                                {post.community.name.charAt(0)}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <Avatar className="h-10 w-10 border shrink-0 bg-background overflow-hidden rounded-full">
                                            <AvatarImage src={post.author.avatar} alt={post.author.displayName} />
                                            <AvatarFallback>{post.author.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                )}
                            <div className="flex flex-col">
                                    <div className="flex items-center gap-1.5">
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
                                            <div className="flex items-center gap-1">
                                                <h3 className="font-medium text-foreground line-clamp-1 hover:text-muted-foreground">{post.author.displayName}</h3>
                                                {post.author.verified && <VerifiedBadge accountType="user" />}
                                            </div>
                                        </HoverableUser>
                                        {/* <span className="text-sm text-muted-foreground">@{post.author.username}</span> */}
                                        {post.community && (
                                            <>
                                                <span className="text-muted-foreground">in</span>
                                                <span className="text-sm hover:!text-muted-foreground font-semibold cursor-pointer transition-colors line-clamp-1" style={{ color: post.community.color }}>
                                                    {post.community.name}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Posted {post.timestamp} ago</span>
                                    {/* <span className="text-sm text-muted-foreground">
                                            {post.type === 'ads' ? 'Sponsored' : 'Post'}
                                        </span> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row items-center space-x-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="cool"
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
            <CardContent className={`p-0 pt-4`}>
                {/* Render different content based on post.type */}
                {post.type === 'link' ? (
                    <div className="space-y-3">
                        <div className="text-foreground leading-relaxed">
                            {showFullContent ? post.content : contentPreview}
                            {post.content.length > 280 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowFullContent(!showFullContent);
                                    }}
                                    className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
                                >
                                    {showFullContent ? "Show less" : "Show more"}
                                </button>
                            )}
                        </div>
                        {/* Link preview card */}
                        <div className="border rounded-lg p-3 bg-card/70 hover:bg-card transition-colors cursor-pointer">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <ExternalLink className="size-4" />
                                <span>External Link</span>
                            </div>
                            <h4 className="font-medium text-foreground">Link Preview Title</h4>
                            <p className="text-sm text-muted-foreground mt-1">Preview description of the linked content...</p>
                        </div>
                    </div>
                ) : post.type === 'ads' || post.type === 'sponsored' ? (
                    <div className="space-y-3">
                        {/* <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span className="text-sm text-muted-foreground">
                                {post.type === 'ads' ? 'Advertisement' : 'Sponsored'}
                            </span>
                        </div> */}
                        <div className="grid grid-cols-1 md:grid-cols-[240px,auto] gap-3">
                            {post.featured && (
                                <div className={`rounded-lg overflow-hidden bg-muted`}>
                                    <div className="relative group/featured">
                                        {post.featured.type === 'image' && (
                                            <>
                                                <img
                                                    src={post.featured.url}
                                                    alt={post.featured.title || 'Post featured'}
                                                    className="w-full max-h-80 md:max-h-40 aspect-auto"
                                                />
                                                <span className="absolute bottom-2 left-2 text-xs bg-muted/50 text-foreground capitalize px-2 py-0.5 rounded-full hidden group-hover/featured:flex duration-500 ease-in-out">{post.featured.title}</span>
                                            </>
                                        )}
                                        {post.featured.type === 'video' && (
                                            <video
                                                src={post.featured.url}
                                                controls
                                                className="w-full h-48 object-cover border"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="space-y-1 mt-3">
                                <span className="text-sm text-muted-foreground line-clamp-1">
                                    {post.url || 'www.ad.bitroot.com'}
                                </span>
                                <div className="text-foreground leading-relaxed line-clamp-4">
                                    {showFullContent ? post.content : contentPreview}
                                    {post.content.length > 280 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowFullContent(!showFullContent);
                                            }}
                                            className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
                                        >
                                            {showFullContent ? "Show less" : "Show more"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* CTA for ads/sponsored */}
                        <div className="space-y-2">
                            <Button
                                className="border rounded-xl w-full p-3 bg-card/30 text-muted-foreground hover:bg-card/50 transition-colors cursor-pointer"
                                variant="default"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Learn More
                                <ExternalLink className="size-4" />
                            </Button>
                        </div>
                    </div>
                ) : post.type === 'news' ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-[auto,240px] gap-3">
                            <div className="space-y-1 mt-3">
                                {/* <div className="flex items-center gap-2 text-xs text-foreground mb-2">
                                    <Badge variant="destructive" className="text-xs">
                                        Breaking News
                                    </Badge>
                                    <span>•</span>
                                    <span>{post.timestamp} mins read</span>
                                </div> */}
                                <div className="text-foreground leading-relaxed line-clamp-4">
                                    <span className="font-semibold text-lg">{post.title}</span>: {showFullContent ? post.content : contentPreview}
                                    {post.content.length > 200 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowFullContent(!showFullContent);
                                            }}
                                            className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
                                        >
                                            {showFullContent ? "Show less" : "Read full article"}
                                        </button>
                                    )}
                                </div>
                            </div>
                            {post.featured && (
                                <div className={`rounded-lg overflow-hidden bg-muted`}>
                                    <div className="relative group/featured">
                                        {post.featured.type === 'image' && (
                                            <>
                                                <img
                                                    src={post.featured.url}
                                                    alt={post.featured.title || 'Post featured'}
                                                    className="w-full md:max-h-40 aspect-auto"
                                                />
                                                <span className="absolute bottom-2 left-2 text-xs bg-muted/50 text-foreground capitalize px-2 py-0.5 rounded-full hidden group-hover/featured:flex duration-500 ease-in-out">{post.featured.title}</span>
                                            </>
                                        )}
                                        {post.featured.type === 'video' && (
                                            <video
                                                src={post.featured.url}
                                                controls
                                                className="w-full h-48 object-cover border"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* <div className="flex flex-row items-center justify-between space-x-3 mt-4">
                            <div className="flex flex-row items-center space-x-2">
                                <Tooltip text="Comment" side="bottom">
                                    <ReactionButton
                                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-[22px]" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"><path strokeLinejoin="round" d="M8 13.5h8m-8-5h4" /><path d="M6.099 19q-1.949-.192-2.927-1.172C2 16.657 2 14.771 2 11v-.5c0-3.771 0-5.657 1.172-6.828S6.229 2.5 10 2.5h4c3.771 0 5.657 0 6.828 1.172S22 6.729 22 10.5v.5c0 3.771 0 5.657-1.172 6.828S17.771 19 14 19c-.56.012-1.007.055-1.445.155c-1.199.276-2.309.89-3.405 1.424c-1.563.762-2.344 1.143-2.834.786c-.938-.698-.021-2.863.184-3.865" /></g></svg>}
                                        activeIcon={<svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-[22px]" viewBox="0 0 24 24"><g fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"><path strokeLinejoin="round" d="M8 13.5h8m-8-5h4" /><path d="M6.099 19q-1.949-.192-2.927-1.172C2 16.657 2 14.771 2 11v-.5c0-3.771 0-5.657 1.172-6.828S6.229 2.5 10 2.5h4c3.771 0 5.657 0 6.828 1.172S22 6.729 22 10.5v.5c0 3.771 0 5.657-1.172 6.828S17.771 19 14 19c-.56.012-1.007.055-1.445.155c-1.199.276-2.309.89-3.405 1.424c-1.563.762-2.344 1.143-2.834.786c-.938-.698-.021-2.863.184-3.865" /></g></svg>}
                                        label={"Comment"}
                                        count={post.engagement.comments || 0}
                                        isActive={false}
                                        onClick={() => { }}
                                        activeColor="text-blue-500"
                                    />
                                </Tooltip>
                                <Tooltip text={isLiked ? "Unlike" : "Like"} side="bottom">
                                    <ReactionButton
                                        icon={
                                            <Heart className={`!size-[22px] ${isLiked ? 'fill-current' : ''}`} />
                                        }
                                        activeIcon={
                                            <Heart className="!size-[22px] fill-current" />
                                        }
                                        count={post.engagement.likes || 0}
                                        isActive={isLiked ?? false}
                                        onClick={handleLike}
                                        activeColor="text-red-500"
                                    />
                                </Tooltip>
                                <Tooltip text={"Engagement"} side="bottom">
                                    <ReactionButton
                                        icon={
                                            <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-[22px]" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" d="M6 12H4.125c-.6 0-1.087.487-1.087 1.087v7.076c0 .6.487 1.087 1.087 1.087h1.873c.6 0 1.087-.487 1.087-1.087v-7.076c0-.6-.487-1.087-1.087-1.087m6.939-4.625h-1.873c-.6 0-1.087.487-1.087 1.087v11.701c0 .6.486 1.087 1.086 1.087h1.874c.6 0 1.087-.487 1.087-1.087V8.462c0-.6-.487-1.087-1.087-1.087m6.937-4.625h-1.873c-.6 0-1.087.487-1.087 1.087v16.326c0 .6.487 1.087 1.087 1.087h1.873c.6 0 1.087-.487 1.087-1.087V3.837c0-.6-.487-1.087-1.087-1.087" /></svg>
                                        }
                                        activeIcon={
                                            <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-[22px]" viewBox="0 0 24 24"><path fill="currentColor" d="M6 12H4.125c-.6 0-1.087.487-1.087 1.087v7.076c0 .6.487 1.087 1.087 1.087h1.873c.6 0 1.087-.487 1.087-1.087v-7.076c0-.6-.487-1.087-1.087-1.087m6.939-4.625h-1.873c-.6 0-1.087.487-1.087 1.087v11.701c0 .6.486 1.087 1.086 1.087h1.874c.6 0 1.087-.487 1.087-1.087V8.462c0-.6-.487-1.087-1.087-1.087m6.937-4.625h-1.873c-.6 0-1.087.487-1.087 1.087v16.326c0 .6.487 1.087 1.087 1.087h1.873c.6 0 1.087-.487 1.087-1.087V3.837c0-.6-.487-1.087-1.087-1.087" />
                                            </svg>
                                        }
                                        count={post.engagement.shares}
                                        isActive={false}
                                        onClick={() => { }}
                                    />
                                </Tooltip>
                                <Tooltip text={"Share post"} side="bottom">
                                    <ReactionButton
                                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-[22px]" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></g></svg>}
                                        activeIcon={<svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-[22px]" viewBox="0 0 24 24"><g fill="currentColor"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></g></svg>}
                                        count={post.engagement.shares}
                                        isActive={false}
                                        onClick={() => { }}
                                        activeColor="text-green-500"
                                    />
                                </Tooltip>
                            </div>
                        </div> */}
                    </>
                ) : (
                    <div className="space-y-3">
                        <div className="text-foreground leading-relaxed">
                            {showFullContent ? post.content : contentPreview}
                            {post.content.length > 280 && (
                                <Link
                                    href={`/posts/${post.slug}`}
                                    className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
                                >
                                    Read more
                                </Link>
                            )}
                        </div>
                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.tags.slice(0, 4).map((tag, index) => (
                                    <span key={index} className="text-sky-500 font-semibold cursor-pointer p-1 rounded-lg hover:bg-card/30 transition-all">
                                        #{tag}
                                    </span>
                                ))}
                                {post.tags.length > 4 && (
                                    <span className="text-foreground">
                                        +{post.tags.length - 4} more
                                    </span>
                                )}
                            </div>
                        )}
                        <MediaGallery media={(post.media || []).filter(item => item.type === 'image' || item.type === 'video') as Array<{ type: 'image' | 'video', url: string, title?: string }>} />
                        {post.poll && (
                            <div className="">
                                <div className="space-y-2 p-4 border-2 rounded-2xl bg-card/30">
                                    <h4 className="font-medium mb-3">{post.poll.question}</h4>
                                    {post.poll.options.map((option, index) => {
                                        const votes = post.poll?.votes?.[option] || 0;
                                        const totalVotes = post.poll?.votes ? Object.values(post.poll.votes).reduce((a, b) => a + b, 0) : 0;
                                        const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

                                        return (
                                            <div key={index} className={`relative overflow-hidden`}>
                                                <div className={`relative overflow-hidden flex items-center justify-between p-2 bg-muted rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}>
                                                    <div className="flex items-center gap-2">{index === 3 && (<CircleCheck className="w-6 h-6" />)}
                                                        <span className="font-medium">{option}</span></div>

                                                    <span className="text-sm text-muted-foreground flex items-center">{percentage}%
                                                        {/* ({votes}) */}
                                                    </span>
                                                    {index === 3 &&
                                                        (<div
                                                            className="absolute left-0 top-0 z-10 opacity-50 h-full !bg-primary !rounded-r-none rounded-xl transition-all duration-300"
                                                            style={{ width: `${percentage}%` }}
                                                        />)
                                                    }
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="flex flex-row items-center gap-1 text-sm text-muted-foreground">
                                        <span>{Object.values(post.poll?.votes || {}).reduce((a, b) => a + b, 0)} votes</span>
                                        <span>•</span>
                                        {post.poll.endTime && (
                                            <p className="text-sm text-muted-foreground">
                                                Ends: {new Date(post.poll.endTime).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div className="mt-4 border-t pt-2 flex flex-row gap-2 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href={"#"} className="text-sm">{likeCount} reactions</Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={"#"} className="text-sm">200 comments</Link>
                        <span>•</span>
                        <Link href={"#"} className="text-sm">0 shares</Link>
                    </div>
                </div>
                <div className="grid grid-cols-4 mt-2 pt-2 border-t">
                    {/* <div className="flex flex-row items-center space-x-3"> */}
                    <div className="grid grid-cols-[40px_auto] items-center">
                        <Button
                            variant="post_action"
                            size="post_fit"
                            className={`gap-1 p-2 w-full hover:bg-card flex items-center justify-start ${isLiked ? "text-red-500" : "text-foreground"} transition-colors rounded-r-none`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLike();
                            }}
                        >
                            <div>
                                {isLiked ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-[22px]" viewBox="0 0 48 48"><path fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.99 10.99 0 0 0 15 8"></path></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-[22px]" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.99 10.99 0 0 0 15 8"></path></svg>
                                )}
                            </div>
                            <span className="text-foreground sr-only">Like</span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="post_action"
                                    size="post_fit"
                                    className="w-full p-2 hover:bg-card border-l border-border rounded-l-none"
                                    onClick={(e) => e.stopPropagation()}
                                // style={{width: "20px"}}
                                >
                                    <span className="text-foreground">React</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-[22px]" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10l5 5 5-5z" /></svg>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="border-2 bg-muted shadow-sm flex flex-row items-center" align="start">
                                <DropdownMenuItem className="hover:bg-card cursor-pointer flex flex-col items-center justify-center gap-0">
                                    <span className="text-xl">❤️</span>
                                    <span>Love</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-card cursor-pointer flex flex-col items-center justify-center gap-0">
                                    <span className="text-xl">😂</span>
                                    <span>Haha</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-card cursor-pointer flex flex-col items-center justify-center gap-0">
                                    <span className="text-xl">😮</span>
                                    <span>Wow</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-card cursor-pointer flex flex-col items-center justify-center gap-0">
                                    <span className="text-xl">😢</span>
                                    <span>Sad</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-card cursor-pointer flex flex-col items-center justify-center gap-0">
                                    <span className="text-xl">😡</span>
                                    <span>Angry</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <ReactionButton
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-[22px]" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 1 0-9-9c0 1.488.36 2.89 1 4.127L3 21l4.873-1c1.236.639 2.64 1 4.127 1"></path></svg>}
                        label={"Comment"}
                        count={"Comment"}
                        isActive={false}
                        onClick={() => { }}
                        activeColor="text-blue-500"
                    />
                    <Tooltip text={"Repost"} side="bottom">
                        <ReactionButton
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-[22px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                                </svg>
                            }
                            activeIcon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-[22px]" viewBox="0 0 24 24"><path fill="currentColor" d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875z" /><circle cx="20" cy="4" r="2" fill="red" /><circle cx="12" cy="9" r="2" fill="red" /><circle cx="5" cy="14" r="2" fill="red" /></svg>
                            }
                            count={post.engagement.shares}
                            isActive={false}
                            onClick={() => { }}
                        />
                    </Tooltip>
                    <ReactionButton
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-[22px]" viewBox="0 0 24 24"><path fill="currentColor" d="M20.04 2.323c1.016-.355 1.992.621 1.637 1.637l-5.925 16.93c-.385 1.098-1.915 1.16-2.387.097l-2.859-6.432l4.024-4.025a.75.75 0 0 0-1.06-1.06l-4.025 4.024l-6.432-2.859c-1.063-.473-1-2.002.097-2.387z"></path></svg>}
                        count={"Share"}
                        isActive={false}
                        onClick={() => { }}
                        activeColor="text-green-500"
                    />
                </div>
                {shouldShowReadMore && (
                    <Link href={`/posts/${post.slug}`} className="w-full bg-transparent text-primary flex justify-center items-center space-x-1 border-2 border-primary p-1 px-2 mt-2 rounded-full duration-500 transition-all">
                        <span className="text-lg">Read more</span>
                    </Link>
                ) 
                // :
                //     (<div className="mt-2 pt-2 border-t space-y-3">
                //         <div className="w-full bg-transparent text-primary flex justify-start items-center space-x-2 duration-500 transition-all">
                //             {/* <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24"><path fill="currentColor" d="M20 5a1 1 0 0 0-1-1h-5a1 1 0 0 0 0 2h2.57l-3.28 3.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0L18 7.42V10a1 1 0 0 0 1 1a1 1 0 0 0 1-1Zm-9.29 8.29a1 1 0 0 0-1.42 0L6 16.57V14a1 1 0 0 0-1-1a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 0-2H7.42l3.29-3.29a1 1 0 0 0 0-1.42"></path></svg> */}
                //             <Link href={`/#`} className="text-sm hover:underline">Load more comments</Link>
                //         </div>
                //         <div className="flex gap-3 items-start">
                //             <Avatar className="w-8 h-8 flex-shrink-0">
                //                 <AvatarImage src="/user-placeholder.png" alt="Your avatar" />
                //                 <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                //                     You
                //                 </AvatarFallback>
                //             </Avatar>
                //             <div className="flex-1 relative block">
                //                 <div className="flex items-center gap-2">
                //                     <span className="text-sm">User 1</span>
                //                     <span className="text-primary text-sm flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m17.942 6.076l2.442 2.442a1.22 1.22 0 0 1-.147 1.855l-1.757.232a1.7 1.7 0 0 0-.94.452c-.72.696-1.453 1.428-2.674 2.637c-.21.212-.358.478-.427.769l-.94 3.772a1.22 1.22 0 0 1-1.978.379l-3.04-3.052l-3.052-3.04a1.22 1.22 0 0 1 .379-1.978l3.747-.964a1.8 1.8 0 0 0 .77-.44c1.379-1.355 1.88-1.855 2.66-2.698c.233-.25.383-.565.428-.903l.232-1.783a1.22 1.22 0 0 1 1.856-.146zm-9.51 9.498L3.256 20.75"></path></svg>Pinned</span>
                //                 </div>
                //                 <span className="line-clamp-2 text-sm">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque et possimus totam nostrum non, nulla eveniet officia similique? Iusto sint delectus quisquam amet odit itaque debitis dolor corrupti! Doloremque, laborum?</span>
                //             </div>
                //         </div>
                //         <div className="flex gap-3 items-center">
                //             <Avatar className="w-10 h-10 flex-shrink-0">
                //                 <AvatarImage src="/user-placeholder.png" alt="Your avatar" />
                //                 <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                //                     You
                //                 </AvatarFallback>
                //             </Avatar>
                //             <div className="flex-1 relative">
                //                 <div className="bg-muted/30 rounded-full px-2 py-1 flex items-center gap-1 border-2">
                //                     <input
                //                         type="text"
                //                         // value={newComment}
                //                         // onChange={(e) => setNewComment(e.target.value)}
                //                         placeholder="Add a comment, @ to mention..."
                //                         className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/70"
                //                     // onKeyDown={(e) => {
                //                     //     if (e.key === 'Enter' && !e.shiftKey) {
                //                     //         e.preventDefault();
                //                     //         handleAddComment(e);
                //                     //     }
                //                     // }}
                //                     />
                //                     <button
                //                         // onClick={handleAddComment}
                //                         // disabled={!newComment.trim()}
                //                         className={
                //                             // cn(
                //                             "w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-card"
                //                             // newComment.trim()
                //                             //     ? "bg-blue-500 text-white hover:bg-blue-600"
                //                             //     : "bg-muted text-muted-foreground cursor-not-allowed"
                //                             // )
                //                         }
                //                     >
                //                         <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-5" viewBox="0 0 24 24"><path fill="currentColor" d="M20.04 2.323c1.016-.355 1.992.621 1.637 1.637l-5.925 16.93c-.385 1.098-1.915 1.16-2.387.097l-2.859-6.432l4.024-4.025a.75.75 0 0 0-1.06-1.06l-4.025 4.024l-6.432-2.859c-1.063-.473-1-2.002.097-2.387z"></path></svg>
                //                     </button>
                //                     <button
                //                         // onClick={handleAddComment}
                //                         // disabled={!newComment.trim()}
                //                         className={
                //                             // cn(
                //                             "w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-card"
                //                             // newComment.trim()
                //                             //     ? "bg-blue-500 text-white hover:bg-blue-600"
                //                             //     : "bg-muted text-muted-foreground cursor-not-allowed"
                //                             // )
                //                         }
                //                     >
                //                         <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-5" viewBox="0 0 24 24"><path fill="currentColor" d="M11 14v8H7a3 3 0 0 1-3-3v-4a1 1 0 0 1 1-1zm8 0a1 1 0 0 1 1 1v4a3 3 0 0 1-3 3h-4v-8zM16.5 2a3.5 3.5 0 0 1 3.163 5H20a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-7V7h-2v5H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h.337A3.5 3.5 0 0 1 4 5.5C4 3.567 5.567 2 7.483 2c1.755-.03 3.312 1.092 4.381 2.934l.136.243c1.033-1.914 2.56-3.114 4.291-3.175zm-9 2a1.5 1.5 0 0 0 0 3h3.143C9.902 5.095 8.694 3.98 7.5 4m8.983 0c-1.18-.02-2.385 1.096-3.126 3H16.5a1.5 1.5 0 1 0-.017-3"></path></svg>
                //                     </button>
                //                 </div>
                //             </div>
                //         </div>
                //     </div>)
                    }
            </CardContent>
        </StyledCard>
    )
};
