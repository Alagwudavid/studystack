// Enhanced data models for social learning platform

export type UserType = "plus" | "founder" | "expert" | "institution";
export type PostType = "achievement" | "tip" | "question" | "resource" | "milestone" | "project" | "study-note" | "study-session" | "collaboration" | "poll" | "code" | "repost" | "posts" | "link" | "ads" | "news" | "sponsored";
export type categoryArea = "language" | "mathematics" | "science" | "technology" | "arts" | "business" | "philosophy" | "history" | "other";

export interface User {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    bio?: string;
    type: UserType;
    verified: boolean;
    level: number;
    xp: number;
    joinDate: string;
    location?: string;
    languages: string[];
    categories: categoryArea[];
    achievements: Achievement[];
    followers: number;
    following: number;
    streak: {
        current: number;
        longest: number;
        lastActive: string;
    };
    preferences: {
        publicProfile: boolean;
        showProgress: boolean;
        mentorshipAvailable: boolean;
    };
}

export interface SocialPost {
    id: number;
    slug: string;
    author: User;
    type: PostType;
    title?: string;
    content: string;
    category?: categoryArea;
    url?: string;
    language?: {
        name: string;
        flag: string;
        color: string;
    };
    community?: {
        id: string;
        name: string;
        flag?: string;
        color: string;
    };
    media?: {
        type: "image" | "video" | "audio" | "document";
        url: string;
        thumbnail?: string;
        duration?: string;
        title?: string;
    }[];
    featured?: {
        type: "image" | "video" | "audio" | "document";
        url: string;
        thumbnail?: string;
        duration?: string;
        title?: string;
    };
    tags: string[];
    timestamp: string;
    engagement: {
        likes: number;
        comments: number;
        shares: number;
        views: number;
        awards?: number;
        reactions?: {
            like: number;
            love: number;
            celebrate: number;
        };
    };
    studyData?: {
        timeSpent?: number;
        difficulty?: "beginner" | "intermediate" | "advanced";
        skills: string[];
        resources?: string[];
    };
    collaboration?: {
        isCollaborative: boolean;
        maxParticipants?: number;
        currentParticipants?: User[];
        title?: string;
    };
    poll?: {
        question: string;
        options: string[];
        selected?: boolean;
        votes?: { [option: string]: number };
        endTime?: string;
    };
    linkData?: {
        url: string;
        title?: string;
        description?: string;
        image?: string;
    };
    codeSnippet?: {
        language: string;
        code: string;
        title?: string;
    };
    repost?: {
        reposter: User;
        quote?: string;
        originalPostId: number;
    };
    isLiked?: boolean;
    isSaved?: boolean;
}

export interface StudyCommunity {
    id: string;
    name: string;
    description: string;
    category: categoryArea;
    language?: string;
    flag?: string;
    color: string;
    members: number;
    posts: number;
    moderators: User[];
    rules: string[];
    isPrivate: boolean;
    requiresApproval: boolean;
    tags: string[];
    createdAt: string;
    trending: boolean;
    level?: "beginner" | "intermediate" | "advanced" | "all";
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: "learning" | "social" | "milestone" | "special";
    rarity: "common" | "rare" | "epic" | "legendary";
    xpReward: number;
    unlockedAt: string;
    progress?: {
        current: number;
        target: number;
    };
}

export interface StudyGroup {
    id: string;
    name: string;
    description: string;
    category: categoryArea;
    language?: string;
    level: "beginner" | "intermediate" | "advanced";
    members: User[];
    maxMembers: number;
    isPrivate: boolean;
    schedule?: {
        recurring: boolean;
        days: string[];
        time: string;
        timezone: string;
    };
    createdBy: User;
    createdAt: string;
    status: "active" | "paused" | "completed";
}

export interface LearningPath {
    id: string;
    title: string;
    description: string;
    category: categoryArea;
    language?: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    estimatedDuration: string;
    modules: LearningModule[];
    prerequisites?: string[];
    tags: string[];
    rating: number;
    enrollments: number;
    createdBy: User;
    isOfficial: boolean;
}

export interface LearningModule {
    id: string;
    title: string;
    description: string;
    type: "lesson" | "exercise" | "quiz" | "project" | "discussion";
    content?: string;
    resources?: string[];
    estimatedTime: number;
    prerequisites?: string[];
    order: number;
}

export interface Comment {
    id: string;
    author: User;
    content: string;
    timestamp: string;
    postId: number;
    parentId?: string; // For nested replies
    engagement: {
        likes: number;
        replies: number;
        reactions?: {
            like: number;
            love: number;
            celebrate: number;
        };
    };
    isLiked?: boolean;
    replies?: Comment[];
}

export interface Notification {
    id: string;
    type: "like" | "comment" | "follow" | "mention" | "achievement" | "study_reminder" | "group_invite";
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    actionUrl?: string;
    relatedUser?: User;
    relatedPost?: string;
}
