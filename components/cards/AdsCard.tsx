import React, { useState } from "react"
import { ExternalLink, Heart, MessageCircle, Share, Eye } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SocialPost } from "@/types/social-learning"
import { BaseCardWrapper } from "./BaseCardWrapper"

interface AdsCardProps {
    post: SocialPost
    isDetailView?: boolean
}

export function AdsCard({ post, isDetailView = false }: AdsCardProps) {
    const [isLiked, setIsLiked] = useState(post.isLiked ?? false)
    const [likeCount, setLikeCount] = useState(post.engagement.reactions?.like || 0)

    const handleLike = () => {
        setIsLiked(!isLiked)
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    }

    return (
        <BaseCardWrapper post={post} isDetailView={isDetailView}>
            <CardContent className="p-0 pt-4">
                {/* Ad Label */}
                <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                        Sponsored
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                        <Eye className="w-3 h-3 mr-1" />
                        {post.engagement.views?.toLocaleString()} views
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-[240px,auto] gap-3">
                        {post.featured && (
                            <div className="rounded-lg overflow-hidden bg-muted">
                                <div className="relative group/featured">
                                    {post.featured.type === 'image' && (
                                        <>
                                            <img
                                                src={post.featured.url}
                                                alt={post.featured.title || 'Advertisement'}
                                                className="w-full max-h-80 md:max-h-40 aspect-auto object-cover"
                                            />
                                            <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full hidden group-hover/featured:flex duration-500 ease-in-out">
                                                {post.featured.title}
                                            </span>
                                        </>
                                    )}
                                    {post.featured.type === 'video' && (
                                        <video
                                            src={post.featured.url}
                                            controls
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="space-y-1 mt-3">
                            <span className="text-sm text-muted-foreground line-clamp-1">
                                {post.url || 'www.sponsor.com'}
                            </span>
                            <div className="text-foreground leading-relaxed line-clamp-4">
                                {post.content}
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="space-y-2">
                        <Button
                            className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Learn More
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Minimal Engagement Stats */}
                <div className="mt-4 border-t pt-2 flex flex-row gap-2 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{likeCount} reactions</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-sm">{post.engagement.comments || 0} comments</span>
                    </div>
                </div>

                {/* Simplified Action Buttons */}
                <div className="grid grid-cols-3 mt-2 pt-2 border-t gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-1 hover:bg-card ${isLiked ? "text-red-500" : "text-muted-foreground"} transition-colors`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleLike();
                        }}
                    >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm">Like</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 hover:bg-card text-muted-foreground">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">Comment</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 hover:bg-card text-muted-foreground">
                        <Share className="w-4 h-4" />
                        <span className="text-sm">Share</span>
                    </Button>
                </div>
            </CardContent>
        </BaseCardWrapper>
    )
}