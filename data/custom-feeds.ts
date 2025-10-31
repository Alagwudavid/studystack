// Custom feed system for the social learning platform
export interface CustomFeed {
    id: string;
    name: string;
    icon?: string;
    color: string;
    description?: string;
    filters: {
        categories: string[];
        postTypes: string[];
        communities: string[];
        instructors: string[];
        tags?: string[];
    };
    isDefault?: boolean;
    createdBy?: string;
}

export interface FeedFilter {
    categories: string[];
    postTypes: string[];
    communities: string[];
    instructors: string[];
    tags?: string[];
}

export const defaultCustomFeeds: CustomFeed[] = [
    {
        id: "for-you",
        name: "For you",
        color: "#6B73FF",
        description: "See whats trending",
        filters: {
            categories: [],
            postTypes: [],
            communities: [],
            instructors: []
        },
        isDefault: true
    },
    {
        id: "language-learning",
        name: "Language Learning",
        color: "#FF6B35",
        description: "Posts focused on language learning and practice",
        filters: {
            categories: ["language"],
            postTypes: ["achievement", "tip", "question", "milestone"],
            communities: ["spanish-learners", "language-support"],
            instructors: []
        }
    },
    {
        id: "stem-focus",
        name: "STEM Focus",
        color: "#4A90E2",
        description: "Science, Technology, Engineering, and Mathematics content",
        filters: {
            categories: ["mathematics", "science", "technology"],
            postTypes: ["tip", "project", "collaboration", "study-note"],
            communities: ["math-community", "tech-hub"],
            instructors: []
        }
    },
    {
        id: "creative-arts",
        name: "Creative Arts",
        color: "#E74C3C",
        description: "Creative and artistic learning content",
        filters: {
            categories: ["arts"],
            postTypes: ["project", "milestone", "achievement"],
            communities: ["art-culture"],
            instructors: []
        }
    },
    {
        id: "study-groups",
        name: "Study Groups",
        color: "#27AE60",
        description: "Collaborative learning and study group activities",
        filters: {
            categories: [],
            postTypes: ["collaboration"],
            communities: [],
            instructors: []
        }
    },
    {
        id: "achievements",
        name: "Achievements",
        color: "#F39C12",
        description: "Celebrate learning achievements and milestones",
        filters: {
            categories: [],
            postTypes: ["achievement", "milestone"],
            communities: [],
            instructors: []
        }
    },
    {
        id: "instructor-posts",
        name: "From Instructors",
        color: "#8E44AD",
        description: "Posts from verified educators and instructors",
        filters: {
            categories: [],
            postTypes: ["tip", "resource", "study-note"],
            communities: [],
            instructors: ["verified-instructors"] // This would be populated with actual instructor IDs
        }
    },
    {
        id: "beginner-friendly",
        name: "Beginner Friendly",
        color: "#2ECC71",
        description: "Content perfect for learning beginners",
        filters: {
            categories: [],
            postTypes: ["tip", "resource", "question"],
            communities: [],
            instructors: [],
            tags: ["beginner", "basics", "getting-started"]
        }
    }
];

// Helper functions for filtering posts
export const filterPostsByFeed = (posts: any[], feed: CustomFeed): any[] => {
    return posts.filter(post => {
        // Filter by categories
        if (feed.filters.categories.length > 0) {
            if (!feed.filters.categories.includes(post.category)) {
                return false;
            }
        }

        // Filter by post types
        if (feed.filters.postTypes.length > 0) {
            if (!feed.filters.postTypes.includes(post.type)) {
                return false;
            }
        }

        // Filter by communities
        if (feed.filters.communities.length > 0) {
            if (!post.community || !feed.filters.communities.includes(post.community.id)) {
                return false;
            }
        }

        // Filter by instructors
        if (feed.filters.instructors.length > 0) {
            if (post.author.type !== "instructor" && post.author.type !== "educator") {
                return false;
            }
        }

        // Filter by tags
        if (feed.filters.tags && feed.filters.tags.length > 0) {
            const hasMatchingTag = feed.filters.tags.some(tag =>
                post.tags.some((postTag: string) =>
                    postTag.toLowerCase().includes(tag.toLowerCase())
                )
            );
            if (!hasMatchingTag) {
                return false;
            }
        }

        return true;
    });
};

export const getFeedById = (id: string): CustomFeed | undefined => {
    return defaultCustomFeeds.find(feed => feed.id === id);
};

export const getFeedByName = (name: string): CustomFeed | undefined => {
    return defaultCustomFeeds.find(feed => feed.name === name);
};
