import React, { useState } from "react"
import { Trophy, Heart, MessageCircle, Share } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SocialPost } from "@/types/social-learning"
import { BaseCardWrapper } from "./BaseCardWrapper"
import { MediaGallery } from "@/components/MediaGallery"

interface AchievementCardProps {
    post: SocialPost
    isDetailView?: boolean
}

export function AchievementCard({ post, isDetailView = false }: AchievementCardProps) {
    const [isLiked, setIsLiked] = useState(post.isLiked ?? false)
    const [likeCount, setLikeCount] = useState(post.engagement.reactions?.like || 0)

    const handleLike = () => {
        setIsLiked(!isLiked)
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    }

    return (
        <BaseCardWrapper post={post} isDetailView={isDetailView}>
            <CardContent className="p-0 pt-4">
                {/* Achievement Badge */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                        <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        Achievement Unlocked
                    </Badge>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <div className="text-foreground leading-relaxed">
                        {post.content}
                    </div>

                    {/* Study Data */}
                    {post.studyData && (
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Trophy className="w-4 h-4 text-yellow-600" />
                                <span className="font-medium text-sm">Learning Stats</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {post.studyData.timeSpent && (
                                    <div>Time Spent: <span className="font-medium">{post.studyData.timeSpent}min</span></div>
                                )}
                                {post.studyData.difficulty && (
                                    <div>Level: <span className="font-medium capitalize">{post.studyData.difficulty}</span></div>
                                )}
                            </div>
                            {post.studyData.skills && (
                                <div className="mt-2">
                                    <div className="flex flex-wrap gap-1">
                                        {post.studyData.skills.map((skill, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

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

                    {/* Media */}
                    <MediaGallery media={(post.media || []).filter(item => item.type === 'image' || item.type === 'video') as Array<{ type: 'image' | 'video', url: string, title?: string }>} />
                </div>

                {/* Engagement Stats */}
                <div className="mt-4 border-t pt-2 flex flex-row gap-2 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">{likeCount} reactions</span>
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
                        <span className="text-sm">Comment</span>
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