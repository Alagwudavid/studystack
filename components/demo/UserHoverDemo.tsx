import { socialLearningPosts } from "@/data/social-learning"
import PostCard from "@/components/PostCard"

/**
 * This page demonstrates the user hover functionality in action.
 * 
 * Features implemented:
 * 1. UserHoverCard component - displays user details in a popup
 * 2. HoverableUser component - handles hover timing and positioning
 * 3. PostCard integration - user avatars and names show hover cards
 * 
 * How to test:
 * 1. Hover over a user's avatar or name in any post
 * 2. Wait ~500ms for the popup to appear
 * 3. The popup shows user details including:
 *    - Avatar and name with verified badge
 *    - Bio (if available)
 *    - Join date and location
 *    - Follower/following counts
 *    - Follow button (toggles state)
 *    - Link to profile
 * 
 * Interaction details:
 * - 500ms delay before showing
 * - 300ms delay before hiding
 * - Smart positioning (adjusts if would go off screen)
 * - Can hover over the card itself to keep it open
 * - Click outside or leave to close
 */

export default function UserHoverDemo() {
    return (
        <div className="max-w-2xl mx-auto space-y-4 p-4">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">User Hover Demo</h1>
                <p className="text-muted-foreground">
                    Hover over user avatars and names to see the popup cards
                </p>
            </div>

            {/* Show first few posts as examples */}
            {socialLearningPosts.slice(0, 3).map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}