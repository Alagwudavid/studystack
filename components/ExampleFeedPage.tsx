import React, { useState } from "react"
import { FeedGenerator } from "@/components/FeedGenerator"
import { socialLearningPosts } from "@/data/social-learning"
import { FeedPresets } from "@/lib/feedAlgorithm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type FeedMode = 'engagement' | 'discovery' | 'news' | 'default'

export default function ExampleFeedPage() {
    const [feedMode, setFeedMode] = useState<FeedMode>('default')

    const getFeedConfig = () => {
        switch (feedMode) {
            case 'engagement':
                return FeedPresets.engagement
            case 'discovery':
                return FeedPresets.discovery
            case 'news':
                return FeedPresets.news
            default:
                return { adsFrequency: 3 }
        }
    }

    const getModeDescription = () => {
        switch (feedMode) {
            case 'engagement':
                return "Prioritizes popular posts with high engagement"
            case 'discovery':
                return "Emphasizes diversity and learning resources"
            case 'news':
                return "Latest news and trending content first"
            default:
                return "Standard algorithmic feed with ads every 3 posts"
        }
    }

    return (
        <div className="container mx-auto max-w-2xl py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Smart Social Learning Feed</h1>
                <p className="text-muted-foreground mb-4">
                    Advanced feed algorithm with different modes and smart content placement
                </p>

                {/* Feed Mode Selector */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {(['default', 'engagement', 'discovery', 'news'] as FeedMode[]).map((mode) => (
                        <Button
                            key={mode}
                            variant={feedMode === mode ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFeedMode(mode)}
                            className="capitalize"
                        >
                            {mode}
                            {mode === feedMode && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                    Active
                                </Badge>
                            )}
                        </Button>
                    ))}
                </div>

                <p className="text-sm text-muted-foreground">
                    <strong>Current mode:</strong> {getModeDescription()}
                </p>
            </div>

            <FeedGenerator
                posts={socialLearningPosts}
                algorithmConfig={getFeedConfig()}
                className="space-y-6"
            />
        </div>
    )
}