import { SocialPost, PostType } from "@/types/social-learning"

export interface FeedAlgorithmConfig {
    adsFrequency: number // Insert ad after every N posts
    priorityTypes: PostType[] // Post types to prioritize at the top
    diversityWeight: number // How much to diversify content (0-1)
    engagementWeight: number // How much engagement affects ranking (0-1)
    recencyWeight: number // How much recency affects ranking (0-1)
    maxConsecutiveSameType: number // Max consecutive posts of same type
}

export interface FeedItem {
    id: string
    type: 'post' | 'ad' | 'sponsored'
    post: SocialPost
    isInjected?: boolean
    score?: number // Algorithm score for ranking
}

export class FeedAlgorithm {
    private config: FeedAlgorithmConfig

    constructor(config: Partial<FeedAlgorithmConfig> = {}) {
        this.config = {
            adsFrequency: 3,
            priorityTypes: ['achievement', 'milestone', 'news'],
            diversityWeight: 0.3,
            engagementWeight: 0.4,
            recencyWeight: 0.3,
            maxConsecutiveSameType: 2,
            ...config
        }
    }

    /**
     * Generate optimized feed with algorithmic placement
     */
    generateFeed(posts: SocialPost[]): FeedItem[] {
        // Separate ads from regular content
        const adPosts = posts.filter(post => post.type === 'ads' || post.type === 'sponsored')
        const regularPosts = posts.filter(post => post.type !== 'ads' && post.type !== 'sponsored')

        // Score and sort regular posts
        const scoredPosts = this.scoreAndRankPosts(regularPosts)

        // Apply diversity rules
        const diversifiedPosts = this.applyDiversityRules(scoredPosts)

        // Insert ads algorithmically
        return this.insertAds(diversifiedPosts, adPosts)
    }

    /**
     * Score posts based on engagement, recency, and type priority
     */
    private scoreAndRankPosts(posts: SocialPost[]): SocialPost[] {
        const now = new Date()

        const scoredPosts = posts.map(post => {
            let score = 0

            // Engagement score (likes + comments + shares)
            const engagementScore = (
                (post.engagement.likes || 0) +
                (post.engagement.comments || 0) * 2 +
                (post.engagement.shares || 0) * 3
            ) / 100 // Normalize

            // Recency score (newer posts score higher)
            const postTime = this.parseTimestamp(post.timestamp)
            const hoursAgo = (now.getTime() - postTime.getTime()) / (1000 * 60 * 60)
            const recencyScore = Math.max(0, 1 - (hoursAgo / 24)) // Score decreases over 24 hours

            // Priority type bonus
            const priorityScore = this.config.priorityTypes.includes(post.type) ? 1 : 0

            // Combined score
            score = (
                engagementScore * this.config.engagementWeight +
                recencyScore * this.config.recencyWeight +
                priorityScore * (1 - this.config.engagementWeight - this.config.recencyWeight)
            )

            return { ...post, algorithmScore: score }
        })

        // Sort by score
        return scoredPosts.sort((a, b) => (b.algorithmScore || 0) - (a.algorithmScore || 0))
    }

    /**
     * Apply diversity rules to prevent too many consecutive posts of same type
     */
    private applyDiversityRules(posts: SocialPost[]): SocialPost[] {
        const result: SocialPost[] = []
        const remaining = [...posts]
        let lastType: PostType | null = null
        let consecutiveCount = 0

        while (remaining.length > 0) {
            let nextPost: SocialPost | null = null
            let nextIndex = -1

            // Try to find a post of different type if we've hit the limit
            if (consecutiveCount >= this.config.maxConsecutiveSameType) {
                for (let i = 0; i < remaining.length; i++) {
                    if (remaining[i].type !== lastType) {
                        nextPost = remaining[i]
                        nextIndex = i
                        break
                    }
                }
            }

            // If no different type found or no limit hit, take the highest scored
            if (!nextPost) {
                nextPost = remaining[0]
                nextIndex = 0
            }

            // Update counters
            if (nextPost.type === lastType) {
                consecutiveCount++
            } else {
                consecutiveCount = 1
                lastType = nextPost.type
            }

            result.push(nextPost)
            remaining.splice(nextIndex, 1)
        }

        return result
    }

    /**
     * Insert ads at specified frequency
     */
    private insertAds(posts: SocialPost[], adPosts: SocialPost[]): FeedItem[] {
        const items: FeedItem[] = []
        let adIndex = 0

        posts.forEach((post, index) => {
            // Add regular post
            items.push({
                id: `post-${post.id}`,
                type: 'post',
                post,
                isInjected: false
            })

            // Insert ad after every N posts
            if ((index + 1) % this.config.adsFrequency === 0 && adIndex < adPosts.length) {
                items.push({
                    id: `ad-${adPosts[adIndex].id}-${index}`,
                    type: adPosts[adIndex].type as 'ad' | 'sponsored',
                    post: adPosts[adIndex],
                    isInjected: true
                })
                adIndex++
            }
        })

        return items
    }

    /**
     * Parse timestamp string to Date object
     */
    private parseTimestamp(timestamp: string): Date {
        const now = new Date()

        if (timestamp.includes('h')) {
            const hours = parseInt(timestamp.replace('h', ''))
            return new Date(now.getTime() - (hours * 60 * 60 * 1000))
        } else if (timestamp.includes('m')) {
            const minutes = parseInt(timestamp.replace('m', ''))
            return new Date(now.getTime() - (minutes * 60 * 1000))
        } else if (timestamp.includes('d')) {
            const days = parseInt(timestamp.replace('d', ''))
            return new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))
        }

        return now
    }

    /**
     * Update algorithm configuration
     */
    updateConfig(newConfig: Partial<FeedAlgorithmConfig>) {
        this.config = { ...this.config, ...newConfig }
    }

    /**
     * Get current configuration
     */
    getConfig(): FeedAlgorithmConfig {
        return { ...this.config }
    }
}

// Export preset configurations
export const FeedPresets = {
    engagement: {
        adsFrequency: 4,
        priorityTypes: ['achievement', 'milestone'],
        engagementWeight: 0.6,
        recencyWeight: 0.2,
        diversityWeight: 0.2,
        maxConsecutiveSameType: 2
    },

    discovery: {
        adsFrequency: 3,
        priorityTypes: ['tip', 'resource', 'collaboration'],
        engagementWeight: 0.2,
        recencyWeight: 0.3,
        diversityWeight: 0.5,
        maxConsecutiveSameType: 1
    },

    news: {
        adsFrequency: 5,
        priorityTypes: ['news', 'achievement'],
        engagementWeight: 0.3,
        recencyWeight: 0.5,
        diversityWeight: 0.2,
        maxConsecutiveSameType: 3
    }
} as const