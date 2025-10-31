import React, { useState } from "react"
import { BarChart3, Heart, MessageCircle, Share, Users } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SocialPost } from "@/types/social-learning"
import { BaseCardWrapper } from "./BaseCardWrapper"

interface PollCardProps {
    post: SocialPost
    isDetailView?: boolean
}

export function PollCard({ post, isDetailView = false }: PollCardProps) {
    const [isLiked, setIsLiked] = useState(post.isLiked ?? false)
    const [likeCount, setLikeCount] = useState(post.engagement.reactions?.like || 0)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [hasVoted, setHasVoted] = useState(false)

    const handleLike = () => {
        setIsLiked(!isLiked)
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    }

    const handleVote = (option: string) => {
        if (!hasVoted) {
            setSelectedOption(option)
            setHasVoted(true)
        }
    }

    const totalVotes = post.poll?.votes ? Object.values(post.poll.votes).reduce((a, b) => a + b, 0) : 0

    return (
        <BaseCardWrapper post={post} isDetailView={isDetailView}>
            <CardContent className="p-0 pt-4">
                {/* Poll Header */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        Poll
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground ml-auto">
                        <Users className="w-3 h-3 mr-1" />
                        {totalVotes} votes
                    </div>
                </div>

                {/* Content */}
                {post.content && (
                    <div className="text-foreground leading-relaxed mb-4">
                        {post.content}
                    </div>
                )}

                {/* Poll Section */}
                {post.poll && (
                    <div className="space-y-3">
                        <div className="bg-card/30 rounded-2xl p-4 border-2">
                            <h4 className="font-medium mb-4 text-foreground">
                                {post.poll.question}
                            </h4>

                            <div className="space-y-3">
                                {post.poll.options.map((option, index) => {
                                    const votes = post.poll?.votes?.[option] || 0
                                    const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
                                    const isSelected = selectedOption === option
                                    const isWinning = hasVoted && votes === Math.max(...Object.values(post.poll?.votes || {}))

                                    return (
                                        <div key={index} className="relative">
                                            <button
                                                onClick={() => handleVote(option)}
                                                disabled={hasVoted}
                                                className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-300 ${hasVoted
                                                        ? isSelected
                                                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                                                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between relative z-10">
                                                    <span className={`font-medium ${isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-foreground'}`}>
                                                        {option}
                                                    </span>
                                                    {hasVoted && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium">{percentage}%</span>
                                                            <span className="text-xs text-muted-foreground">({votes})</span>
                                                            {isWinning && <Badge className="text-xs bg-purple-500">Leading</Badge>}
                                                        </div>
                                                    )}
                                                </div>

                                                {hasVoted && (
                                                    <div className="mt-2">
                                                        <Progress
                                                            value={percentage}
                                                            className="h-2"
                                                        />
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Poll Info */}
                            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                                <span>{totalVotes} total votes</span>
                                {post.poll.endTime && (
                                    <span>
                                        Ends: {new Date(post.poll.endTime).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.slice(0, 4).map((tag, index) => (
                            <span key={index} className="text-sky-500 font-semibold cursor-pointer p-1 rounded-lg hover:bg-card/30 transition-all">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

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