import React, { useState } from "react"
import { TrendingUp, Heart, MessageCircle, Share, Clock, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SocialPost } from "@/types/social-learning"
import { BaseCardWrapper } from "./BaseCardWrapper"

interface NewsCardProps {
    post: SocialPost
    isDetailView?: boolean
}

export function NewsCard({ post, isDetailView = false }: NewsCardProps) {
    const [isLiked, setIsLiked] = useState(post.isLiked ?? false)
    const [likeCount, setLikeCount] = useState(post.engagement.reactions?.like || 0)
    const [showFullContent, setShowFullContent] = useState(false)

    const handleLike = () => {
        setIsLiked(!isLiked)
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    }

    const contentPreview = post.content.length > 200
        ? post.content.substring(0, 200) + "..."
        : post.content

    return (
        <BaseCardWrapper post={post} isDetailView={isDetailView}>
            <CardContent className="p-0 pt-4">
                {/* News Header */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                        <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <Badge variant="destructive" className="text-xs">
                        Breaking News
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground ml-auto">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.timestamp}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-[auto,240px] gap-3">
                        <div className="space-y-2">
                            {/* News Title */}
                            {post.title && (
                                <h3 className="font-bold text-lg text-foreground leading-tight">
                                    {post.title}
                                </h3>
                            )}

                            {/* News Content */}
                            <div className="text-foreground leading-relaxed">
                                <span className="font-semibold text-base">
                                    {showFullContent ? post.content : contentPreview}
                                </span>
                                {post.content.length > 200 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowFullContent(!showFullContent);
                                        }}
                                        className="text-blue-600 hover:text-blue-700 ml-2 font-medium text-sm"
                                    >
                                        {showFullContent ? "Show less" : "Read full article"}
                                    </button>
                                )}
                            </div>

                            {/* Source */}
                            {post.url && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <ExternalLink className="w-3 h-3" />
                                    <span>Source: {new URL(post.url).hostname}</span>
                                </div>
                            )}
                        </div>

                        {/* Featured Image */}
                        {post.featured && (
                            <div className="rounded-lg overflow-hidden bg-muted">
                                <div className="relative group/featured">
                                    {post.featured.type === 'image' && (
                                        <>
                                            <img
                                                src={post.featured.url}
                                                alt={post.featured.title || 'News image'}
                                                className="w-full md:max-h-40 aspect-video object-cover"
                                            />
                                            <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full hidden group-hover/featured:flex duration-500 ease-in-out">
                                                {post.featured.title}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 5).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Enhanced Engagement Stats */}
                <div className="mt-4 border-t pt-2 flex flex-row gap-2 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{likeCount} reactions</span>
                        <span className="text-sm text-muted-foreground">{post.engagement.views?.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm">{post.engagement.comments || 0} comments</span>
                        <span>•</span>
                        <span className="text-sm">{post.engagement.shares || 0} shares</span>
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
                        <span className="text-sm">Discuss</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 hover:bg-card">
                        <Share className="w-5 h-5" />
                        <span className="text-sm">Share</span>
                    </Button>
                </div>
            </CardContent>
        </BaseCardWrapper>
    )
}