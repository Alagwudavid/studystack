import React, { useState, useMemo } from "react"
import { Heart, MessageCircle, Share, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SocialPost } from "@/types/social-learning"
import { BaseCardWrapper } from "./BaseCardWrapper"
import { MediaGallery } from "@/components/MediaGallery"
import Link from "next/link"

interface StandardPostCardProps {
    post: SocialPost
    isDetailView?: boolean
}

export function StandardPostCard({ post, isDetailView = false }: StandardPostCardProps) {
    const [isLiked, setIsLiked] = useState(post.isLiked ?? false)
    const [isSaved, setIsSaved] = useState(post.isSaved ?? false)
    const [showFullContent, setShowFullContent] = useState(false)
    const [likeCount, setLikeCount] = useState(post.engagement.reactions?.like || 0)

    const handleLike = () => {
        setIsLiked(!isLiked)
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    }

    const contentPreview = post.content.length > 280
        ? post.content.substring(0, 280) + "..."
        : post.content

    const shouldShowReadMore = useMemo(() => {
        if (post.type === 'ads' || post.type === 'sponsored' || post.type === 'link') {
            return false
        }
        return (post.id % 2) === 0
    }, [post.id, post.type])

    return (
        <BaseCardWrapper post={post} isDetailView={isDetailView}>
            <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                    {/* Content */}
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

                    {/* Tags */}
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

                    {/* Media Gallery */}
                    <MediaGallery media={(post.media || []).filter(item => item.type === 'image' || item.type === 'video') as Array<{ type: 'image' | 'video', url: string, title?: string }>} />
                </div>

                {/* Engagement Stats */}
                <div className="mt-4 border-t pt-2 flex flex-row gap-2 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href={"#"} className="text-sm">{likeCount} reactions</Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={"#"} className="text-sm">{post.engagement.comments || 0} comments</Link>
                        <span>•</span>
                        <Link href={"#"} className="text-sm">{post.engagement.shares || 0} shares</Link>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 mt-2 pt-2 border-t gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-1 hover:bg-card ${isLiked ? "text-red-500" : "text-foreground"} transition-colors`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleLike();
                        }}
                    >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm">Like</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 hover:bg-card">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">Comment</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 hover:bg-card">
                        <Share className="w-5 h-5" />
                        <span className="text-sm">Share</span>
                    </Button>
                </div>

                {/* Read More Section */}
                {shouldShowReadMore ? (
                    <Link href={`/posts/${post.slug}`} className="w-full bg-transparent text-primary flex justify-center items-center space-x-1 border-2 border-primary p-1 px-2 mt-2 rounded-full duration-500 transition-all">
                        <span className="text-lg">Read more</span>
                    </Link>
                ) : (
                    <div className="mt-2 pt-2 border-t space-y-3">
                        <div className="w-full bg-transparent text-primary flex justify-start items-center space-x-2 duration-500 transition-all">
                            <Link href={`/#`} className="text-sm hover:underline">Load more comments</Link>
                        </div>
                        {/* Comment Preview Section */}
                        <div className="flex gap-3 items-start">
                            <Avatar className="w-8 h-8 flex-shrink-0">
                                <AvatarImage src="/user-placeholder.png" alt="User avatar" />
                                <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                                    U
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 relative block">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">You</span>
                                    <span className="text-xs text-muted-foreground">now</span>
                                </div>
                                <span className="line-clamp-2 text-sm">Add a comment...</span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </BaseCardWrapper>
    )
}