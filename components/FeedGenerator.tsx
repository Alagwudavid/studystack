import React, { useMemo } from "react"
import { SocialPost, PostType } from "@/types/social-learning"
import { FeedAlgorithm, FeedAlgorithmConfig, FeedItem } from "@/lib/feedAlgorithm"
import { AchievementCard } from "./cards/AchievementCard"
import { AdsCard } from "./cards/AdsCard"
import { NewsCard } from "./cards/NewsCard"
import { PollCard } from "./cards/PollCard"
import { StandardPostCard } from "./cards/StandardPostCard"

interface FeedGeneratorProps {
    posts: SocialPost[]
    isDetailView?: boolean
    algorithmConfig?: Partial<FeedAlgorithmConfig>
    className?: string
}

export function FeedGenerator({
    posts,
    isDetailView = false,
    algorithmConfig = {},
    className = ""
}: FeedGeneratorProps) {

    // Generate feed with advanced algorithm
    const feedItems = useMemo(() => {
        const algorithm = new FeedAlgorithm(algorithmConfig)
        return algorithm.generateFeed(posts)
    }, [posts, algorithmConfig])

    // Render appropriate card component based on post type
    const renderCard = (item: FeedItem) => {
        const { post } = item

        switch (post.type) {
            case 'achievement':
                return (
                    <AchievementCard
                        key={item.id}
                        post={post}
                        isDetailView={isDetailView}
                    />
                )

            case 'ads':
            case 'sponsored':
                return (
                    <AdsCard
                        key={item.id}
                        post={post}
                        isDetailView={isDetailView}
                    />
                )

            case 'news':
                return (
                    <NewsCard
                        key={item.id}
                        post={post}
                        isDetailView={isDetailView}
                    />
                )

            case 'poll':
                return (
                    <PollCard
                        key={item.id}
                        post={post}
                        isDetailView={isDetailView}
                    />
                )

            case 'tip':
                return (
                    <div key={item.id} className="relative">
                        <div className="absolute -left-1 top-4 w-1 h-16 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                        <StandardPostCard
                            post={post}
                            isDetailView={isDetailView}
                        />
                    </div>
                )

            case 'question':
                return (
                    <div key={item.id} className="relative">
                        <div className="absolute -left-1 top-4 w-1 h-16 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
                        <StandardPostCard
                            post={post}
                            isDetailView={isDetailView}
                        />
                    </div>
                )

            case 'collaboration':
                return (
                    <div key={item.id} className="relative">
                        <div className="absolute -left-1 top-4 w-1 h-16 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                        <StandardPostCard
                            post={post}
                            isDetailView={isDetailView}
                        />
                    </div>
                )

            case 'milestone':
                return (
                    <div key={item.id} className="relative">
                        <div className="absolute -left-1 top-4 w-1 h-16 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                        <StandardPostCard
                            post={post}
                            isDetailView={isDetailView}
                        />
                    </div>
                )

            case 'resource':
                return (
                    <div key={item.id} className="relative">
                        <div className="absolute -left-1 top-4 w-1 h-16 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
                        <StandardPostCard
                            post={post}
                            isDetailView={isDetailView}
                        />
                    </div>
                )

            case 'repost':
                return (
                    <div key={item.id} className="relative">
                        <div className="absolute -left-1 top-4 w-1 h-16 bg-gradient-to-b from-gray-400 to-gray-500 rounded-full"></div>
                        <div className="bg-card border-l-4 border-gray-400 pl-3">
                            <StandardPostCard
                                post={post}
                                isDetailView={isDetailView}
                            />
                        </div>
                    </div>
                )

            // Default cases
            case 'posts':
            case 'project':
            case 'study-note':
            case 'study-session':
            case 'code':
            case 'link':
            default:
                return (
                    <StandardPostCard
                        key={item.id}
                        post={post}
                        isDetailView={isDetailView}
                    />
                )
        }
    }

    return (
        <div className={`space-y-4 ${className}`}>
            {feedItems.map((item) => renderCard(item))}

            {feedItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <p>No posts to display</p>
                </div>
            )}
        </div>
    )
}

// Export individual card components for direct use
export {
    AchievementCard,
    AdsCard,
    NewsCard,
    PollCard,
    StandardPostCard
}