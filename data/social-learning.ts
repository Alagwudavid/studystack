import { SocialPost, User, Achievement, StudyCommunity, PostType, categoryArea, Comment } from "@/types/social-learning";

// Sample users
export const sampleUsers: User[] = [
    {
        id: "user1",
        username: "sofia_chukwu",
        displayName: "Sofia Chukwu",
        avatar: "/user-placeholder.png",
        bio: "Passionate language learner exploring Spanish, French, and Italian 🌍",
        type: "plus",
        verified: true,
        level: 15,
        xp: 12450,
        joinDate: "2023-06-15",
        location: "Barcelona, Spain",
        languages: ["Spanish", "French", "English"],
        categories: ["language"],
        achievements: [],
        followers: 1240,
        following: 380,
        streak: {
            current: 45,
            longest: 89,
            lastActive: "2024-01-27"
        },
        preferences: {
            publicProfile: true,
            showProgress: true,
            mentorshipAvailable: false
        }
    },
    {
        id: "user2",
        username: "prof_chen",
        displayName: "Dr. Marcus Chen",
        avatar: "/placeholder-user.jpg",
        bio: "Mathematics professor and AI researcher. Making complex concepts simple 📊",
        type: "expert",
        verified: true,
        level: 28,
        xp: 34560,
        joinDate: "2023-03-20",
        location: "MIT, Cambridge",
        languages: ["English", "Mandarin"],
        categories: ["mathematics", "technology"],
        achievements: [],
        followers: 5680,
        following: 120,
        streak: {
            current: 120,
            longest: 240,
            lastActive: "2024-01-27"
        },
        preferences: {
            publicProfile: true,
            showProgress: true,
            mentorshipAvailable: true
        }
    },
    {
        id: "user3",
        username: "art_mentor_sarah",
        displayName: "Sarah Kim",
        avatar: "/placeholder-user.jpg",
        bio: "Digital artist and mentor helping others discover their creative potential 🎨",
        type: "founder",
        verified: false,
        level: 22,
        xp: 18900,
        joinDate: "2023-08-10",
        location: "Seoul, South Korea",
        languages: ["Korean", "English", "Japanese"],
        categories: ["arts"],
        achievements: [],
        followers: 890,
        following: 456,
        streak: {
            current: 78,
            longest: 156,
            lastActive: "2024-01-27"
        },
        preferences: {
            publicProfile: true,
            showProgress: true,
            mentorshipAvailable: true
        }
    },
    {
        id: "user4",
        username: "codemaster_alex",
        displayName: "Alex Rivera",
        avatar: "/placeholder-user1.png",
        bio: "Senior Software Engineer & Programming Instructor. Teaching coding to the next generation 💻",
        type: "expert",
        verified: true,
        level: 32,
        xp: 45200,
        joinDate: "2023-01-15",
        location: "San Francisco, CA",
        languages: ["English", "Spanish"],
        categories: ["technology"],
        achievements: [],
        followers: 8940,
        following: 89,
        streak: {
            current: 200,
            longest: 365,
            lastActive: "2024-01-27"
        },
        preferences: {
            publicProfile: true,
            showProgress: true,
            mentorshipAvailable: true
        }
    },
    {
        id: "user5",
        username: "linguist_emma",
        displayName: "Emma Thompson",
        avatar: "/placeholder-user.jpg",
        bio: "Polyglot & Language Creation Expert. Helping others master multiple languages 🌐",
        type: "expert",
        verified: true,
        level: 29,
        xp: 38750,
        joinDate: "2023-02-28",
        location: "London, UK",
        languages: ["English", "French", "German", "Italian", "Mandarin"],
        categories: ["language"],
        achievements: [],
        followers: 6540,
        following: 234,
        streak: {
            current: 180,
            longest: 245,
            lastActive: "2024-01-27"
        },
        preferences: {
            publicProfile: true,
            showProgress: true,
            mentorshipAvailable: true
        }
    }
];

// Sample achievements
export const sampleAchievements: Achievement[] = [
    {
        id: "ach1",
        title: "First Steps",
        description: "Complete your first lesson",
        icon: "🎯",
        category: "learning",
        rarity: "common",
        xpReward: 50,
        unlockedAt: "2024-01-15T10:00:00Z"
    },
    {
        id: "ach2",
        title: "Social Butterfly",
        description: "Make 10 posts in the community",
        icon: "🦋",
        category: "social",
        rarity: "rare",
        xpReward: 200,
        unlockedAt: "2024-01-20T15:30:00Z"
    },
    {
        id: "ach3",
        title: "Streak Master",
        description: "Maintain a 30-day learning streak",
        icon: "🔥",
        category: "milestone",
        rarity: "epic",
        xpReward: 500,
        unlockedAt: "2024-01-25T09:15:00Z"
    }
];

// Sample social learning posts
export const socialLearningPosts: SocialPost[] = [
    {
        id: 1,
        slug: "jctb575yz",
        author: sampleUsers[0],
        type: "achievement",
        content: "Just wrapped up a 30-day Mathematics learning streak with my friends! 🎉 We started with the basics, and now we're tackling problem-solving together with much more confidence. The best part? Keeping each other accountable made it fun and consistent — just 15 minutes a day as a group turned into steady progress. 📚🤝",
        category: "language",
        language: {
            name: "Spanish",
            flag: "es",
            color: "#FF6B35"
        },
        community: {
            id: "spanish-learners",
            name: "Spanish Learners Hub",
            flag: "es",
            color: "#FF6B35"
        },
        media: [
            {
                type: "image",
                url: "/stories/learning-1.jpg",
                title: "My study setup"
            },
            {
                type: "image",
                url: "/stories/learning-2.jpg",
                title: "My study setup"
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600",
                title: "My study setup"
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
                title: "My study setup"
            }
        ],
        tags: ["UNILAG", "streak", "fyp", "consistency"],
        timestamp: "2h",
        engagement: {
            likes: 234,
            comments: 45,
            shares: 28,
            views: 2340,
            awards: 8,
            reactions: {
                like: 156,
                love: 45,
                celebrate: 33
            }
        },
        studyData: {
            timeSpent: 450,
            difficulty: "intermediate",
            skills: ["conversation", "vocabulary", "pronunciation"],
            resources: ["Duolingo", "SpanishPod101", "Netflix shows"]
        },
        isLiked: true,
        isSaved: false
    },
    // --- REPOST EXAMPLES ---
    {
        id: 101,
        slug: "xp9kl2m3n",
        author: sampleUsers[1], // Dr. Marcus Chen
        type: "repost",
        content: "This is a repost of Sofia's Spanish streak. Her dedication is inspiring!",
        category: "language",
        tags: ["repost", "spanish", "motivation"],
        timestamp: "1h",
        engagement: {
            likes: 12,
            comments: 2,
            shares: 1,
            views: 120,
            reactions: {
                like: 8,
                love: 2,
                celebrate: 2
            }
        },
        isLiked: false,
        isSaved: false,
        repost: {
            reposter: sampleUsers[1],
            // quote: "Her consistency is a model for all language learners!",
            originalPostId: 1
        },
        // Optionally, you can include the original post data for preview
    },
    {
        id: 102,
        slug: "qr8wt5u6v",
        author: sampleUsers[3], // Alex Rivera
        type: "repost",
        content: "Reposting Sarah's art milestone. Amazing achievement!",
        category: "arts",
        tags: ["repost", "art", "milestone"],
        timestamp: "30m",
        engagement: {
            likes: 7,
            comments: 1,
            shares: 0,
            views: 80,
            reactions: {
                like: 5,
                love: 1,
                celebrate: 1
            }
        },
        isLiked: false,
        isSaved: false,
    },
    {
        id: 2,
        slug: "bg4hj7k8l",
        author: sampleUsers[1],
        type: "tip",
        content: "📊 Quick tip for mastering calculus derivatives: Think of them as slopes! When you see f'(x), you're asking 'how steep is this curve at point x?' I use this visualization technique with my pluss and it clicks every time.",
        category: "mathematics",
        community: {
            id: "math-community",
            name: "Math Enthusiasts",
            color: "#4A90E2"
        },

        media: [
            {
                type: "image",
                url: "/stories/learning-1.jpg",
                title: "My study setup"
            },
            {
                type: "image",
                url: "/stories/learning-2.jpg",
                title: "My study setup"
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600",
                title: "My study setup"
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
                title: "My study setup"
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600",
                title: "Derivative visualization"
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600",
                title: "My study setup"
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
                title: "My study setup"
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600",
                title: "Derivative visualization"
            },
        ],
        tags: ["calculus", "derivatives", "visualization", "teaching"],
        timestamp: "4h",
        engagement: {
            likes: 189,
            comments: 32,
            shares: 15,
            views: 1890,
            awards: 24,
            reactions: {
                like: 134,
                love: 28,
                celebrate: 27
            }
        },
        studyData: {
            difficulty: "advanced",
            skills: ["calculus", "mathematical thinking"],
        },
        isLiked: false,
        isSaved: true
    },
    {
        id: 3,
        slug: "mn9op1q2r",
        author: sampleUsers[2],
        type: "repost",
        content: "Finished my digital painting of a traditional Korean hanbok! 🎨 This project helped me learn about color theory, traditional patterns, and cultural symbolism. Art is such a beautiful way to explore different cultures.",
        category: "arts",
        community: {
            id: "art-culture",
            name: "Art & Culture Exchange",
            color: "#E74C3C"
        },
        media: [
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
                title: "Traditional Hanbok Digital Art"
            }
        ],
        tags: ["digitalart", "korean", "culture", "colortheory"],
        timestamp: "6h",
        engagement: {
            likes: 345,
            comments: 67,
            shares: 23,
            views: 2890,
            reactions: {
                like: 189,
                love: 98,
                celebrate: 58
            }
        },
        studyData: {
            timeSpent: 240,
            difficulty: "intermediate",
            skills: ["digital painting", "color theory", "cultural studies"],
        },
        isLiked: true,
        isSaved: true,
        repost: {
            reposter: sampleUsers[3],
            quote: "100 artworks and a course launch! Congrats Sarah!",
            originalPostId: 6
        },
    },
    {
        id: 4,
        slug: "df3gh6i7j",
        author: sampleUsers[0],
        type: "question",
        content: "Question for my fellow language learners: How do you maintain motivation during plateau periods? I've been stuck at the same French level for weeks and feeling discouraged 😔",
        category: "language",
        language: {
            name: "French",
            flag: "fr",
            color: "#4A90E2"
        },
        community: {
            id: "language-support",
            name: "Language Learning Support Group",
            color: "#8E44AD"
        },
        tags: ["motivation", "plateau", "french", "help"],
        timestamp: "8h",
        engagement: {
            likes: 67,
            comments: 89,
            shares: 12,
            views: 1240,
            reactions: {
                like: 42,
                love: 15,
                celebrate: 10
            }
        },
        isLiked: false,
        isSaved: false
    },
    {
        id: 5,
        slug: "st4uv7w8x",
        author: sampleUsers[1],
        type: "collaboration",
        content: "🤝 Starting a Python study group for beginners! We'll meet twice a week online to work through coding challenges together. Looking for 4-5 committed learners who want to build real projects while learning.",
        category: "technology",
        community: {
            id: "python-learners",
            name: "Python Programming Community",
            color: "#27AE60"
        },
        media: [
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600",
                title: "Python coding session"
            }
        ],
        tags: ["python", "studygroup", "programming", "beginners"],
        timestamp: "12h",
        engagement: {
            likes: 145,
            comments: 28,
            shares: 19,
            views: 1567,
            awards: 18,
            reactions: {
                like: 98,
                love: 25,
                celebrate: 22
            }
        },
        collaboration: {
            isCollaborative: true,
            maxParticipants: 5,
            currentParticipants: [sampleUsers[1]]
        },
        studyData: {
            difficulty: "beginner",
            skills: ["python", "programming fundamentals", "problem solving"],
        },
        isLiked: false,
        isSaved: true
    },
    {
        id: 6,
        slug: "yz5ab8c9d",
        author: sampleUsers[2],
        type: "milestone",
        content: "🎯 Major milestone achieved! Just completed my 100th digital artwork and launched my first online art course. Thank you to this amazing community for all the support and feedback along the way!",
        category: "arts",
        community: {
            id: "art-mentors",
            name: "Art Mentors Circle",
            color: "#F39C12"
        },
        media: [
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600",
                title: "Art portfolio milestone"
            }
        ],
        tags: ["milestone", "digitalart", "teaching", "portfolio"],
        timestamp: "1d",
        engagement: {
            likes: 456,
            comments: 78,
            shares: 34,
            views: 3456,
            reactions: {
                like: 267,
                love: 124,
                celebrate: 65
            }
        },
        studyData: {
            timeSpent: 2400, // 40 hours over time
            difficulty: "advanced",
            skills: ["digital art", "course creation", "teaching"],
        },
        isLiked: true,
        isSaved: false
    },
    {
        id: 7,
        slug: "ef6gh9i0j",
        author: sampleUsers[3], // Alex Rivera - codemaster_alex
        type: "tip",
        content: "🚀 Pro tip for JavaScript developers: Use async/await instead of callback hell! Here's a clean pattern I teach in my courses. Your code will be more readable and easier to debug. Who else has made this switch?",
        category: "technology",
        community: {
            id: "javascript-devs",
            name: "JavaScript Developers",
            color: "#F7DF1E"
        },
        media: [
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
                title: "JavaScript code example"
            }
        ],
        tags: ["javascript", "async", "programming", "tutorial"],
        timestamp: "6h",
        engagement: {
            likes: 267,
            comments: 45,
            shares: 32,
            views: 3240,
            awards: 42,
            reactions: {
                like: 189,
                love: 45,
                celebrate: 33
            }
        },
        studyData: {
            timeSpent: 30,
            difficulty: "intermediate",
            skills: ["JavaScript", "Async Programming", "Clean Code"],
            resources: ["MDN Web Docs", "JavaScript.info"]
        },
        isLiked: false,
        isSaved: true
    },
    {
        id: 8,
        slug: "kl1mn4o5p",
        author: sampleUsers[4], // Emma Thompson - linguist_emma
        type: "resource",
        content: "🌍 My secret to learning 5 languages fluently: Immersion techniques you can do from home! I've created a comprehensive guide covering pronunciation hacks, memory techniques, and daily practice routines that actually work.",
        category: "language",
        community: {
            id: "polyglot-community",
            name: "Polyglot Community",
            color: "#9B59B6"
        },
        media: [
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
                title: "Language learning resources"
            }
        ],
        tags: ["polyglot", "language-learning", "immersion", "pronunciation"],
        timestamp: "8h",
        engagement: {
            likes: 334,
            comments: 67,
            shares: 89,
            views: 4567,
            awards: 78,
            reactions: {
                like: 234,
                love: 67,
                celebrate: 33
            }
        },
        studyData: {
            timeSpent: 45,
            difficulty: "advanced",
            skills: ["Language Learning", "Pronunciation", "Memory Techniques"],
            resources: ["Language Exchange Apps", "Native Content", "Pronunciation Tools"]
        },
        isLiked: true,
        isSaved: true
    },
    {
        id: 9,
        slug: "qr2st5u6v",
        author: sampleUsers[3], // Alex Rivera - codemaster_alex
        type: "poll",
        content: "",
        category: "technology",
        community: {
            id: "javascript-devs",
            name: "JavaScript Developers",
            color: "#F7DF1E"
        },
        tags: ["javascript", "framework", "poll"],
        timestamp: "3h",
        engagement: {
            likes: 89,
            comments: 34,
            shares: 12,
            views: 1234,
            reactions: {
                like: 56,
                love: 18,
                celebrate: 15
            }
        },
        poll: {
            question: "Which JavaScript framework do you prefer for building modern web applications?",
            options: ["React", "Vue.js", "Angular", "Svelte"],
            votes: {
                "React": 145,
                "Vue.js": 67,
                "Angular": 34,
                "Svelte": 23
            },
            endTime: "2024-01-28T15:30:00Z"
        },
        isLiked: false,
        isSaved: false
    },
    {
        id: 10,
        slug: "wx3yz6a7b",
        author: sampleUsers[1], // Dr. Marcus Chen
        type: "study-session",
        content: "Just wrapped up an intense 2-hour calculus review session covering limits and continuity. We worked through challenging problems and had some great 'aha!' moments. Group study really makes complex topics more digestible! 📚",
        category: "mathematics",
        community: {
            id: "math-study-group",
            name: "Mathematics Study Circle",
            color: "#4A90E2"
        },
        tags: ["calculus", "limits", "group-study", "session"],
        timestamp: "1h",
        engagement: {
            likes: 156,
            comments: 28,
            shares: 15,
            views: 1890,
            reactions: {
                like: 98,
                love: 34,
                celebrate: 24
            }
        },
        studyData: {
            timeSpent: 120,
            difficulty: "advanced",
            skills: ["calculus", "limits", "continuity"]
        },
        isLiked: true,
        isSaved: false
    },
    {
        id: 11,
        slug: "cd4ef7g8h",
        author: sampleUsers[4], // Emma Thompson - linguist_emma
        type: "resource",
        content: "Discovered an amazing podcast series for intermediate French learners! The hosts speak at a perfect pace and cover everyday topics with cultural insights. Highly recommend for anyone looking to improve listening skills.",
        category: "language",
        language: {
            name: "French",
            flag: "fr",
            color: "#4A90E2"
        },
        community: {
            id: "french-learners",
            name: "French Learning Community",
            color: "#4A90E2"
        },
        tags: ["french", "podcast", "listening", "resource"],
        timestamp: "5h",
        engagement: {
            likes: 234,
            comments: 45,
            shares: 78,
            views: 2456,
            reactions: {
                like: 167,
                love: 43,
                celebrate: 24
            }
        },
        linkData: {
            url: "https://example.com/french-podcast",
            title: "Café Français - Intermediate French Podcast",
            description: "Daily conversations about French culture, current events, and everyday life",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300"
        },
        isLiked: false,
        isSaved: true
    },
    {
        id: 12,
        slug: "ij5kl8m9n",
        author: sampleUsers[2], // Sarah Kim
        type: "collaboration",
        content: "Looking for creative partners to work on a digital art exhibition about cultural diversity! We'll create a virtual gallery showcasing art from different cultures around the world. Perfect opportunity to learn about art techniques while exploring global perspectives.",
        category: "arts",
        community: {
            id: "creative-arts",
            name: "Creative Arts Workshop",
            color: "#E74C3C"
        },
        tags: ["collaboration", "digital-art", "culture", "exhibition"],
        timestamp: "2d",
        engagement: {
            likes: 178,
            comments: 56,
            shares: 23,
            views: 1678,
            reactions: {
                like: 123,
                love: 34,
                celebrate: 21
            }
        },
        collaboration: {
            isCollaborative: true,
            maxParticipants: 8,
            currentParticipants: [sampleUsers[2]],
            title: "Global Perspectives Digital Art Exhibition"
        },
        isLiked: true,
        isSaved: true
    },
    // Link Post Examples
    {
        id: 13,
        slug: "op6qr9s0t",
        author: sampleUsers[4], // Emma Thompson
        type: "link",
        content: "Found this incredible interactive website that teaches you any language through immersive stories! The interface is beautifully designed and the learning method is so engaging. Perfect for visual learners who want to practice reading comprehension.",
        category: "language",
        community: {
            id: "language-resources",
            name: "Language Learning Resources",
            color: "#9B59B6"
        },
        tags: ["interactive", "stories", "reading", "resource"],
        timestamp: "3h",
        engagement: {
            likes: 289,
            comments: 67,
            shares: 145,
            views: 3456,
            reactions: {
                like: 234,
                love: 34,
                celebrate: 21
            }
        },
        linkData: {
            url: "https://storylanguage.com",
            title: "StoryLanguage - Learn Through Interactive Stories",
            description: "Master any language through captivating interactive stories with native audio",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
        },
        isLiked: false,
        isSaved: true
    },
    {
        id: 14,
        slug: "uv7wx0y1z",
        author: sampleUsers[1], // Dr. Marcus Chen
        type: "link",
        content: "This MIT research paper completely changed how I think about machine learning algorithms. The mathematical proofs are elegant and the practical applications are mind-blowing. A must-read for anyone serious about AI.",
        category: "technology",
        community: {
            id: "ai-research",
            name: "AI Research Community",
            color: "#27AE60"
        },
        tags: ["research", "machine-learning", "algorithms", "MIT"],
        timestamp: "5h",
        engagement: {
            likes: 456,
            comments: 89,
            shares: 234,
            views: 5678,
            reactions: {
                like: 345,
                love: 67,
                celebrate: 44
            }
        },
        linkData: {
            url: "https://arxiv.org/abs/2023.12345",
            title: "Revolutionary Approaches to Neural Network Optimization",
            description: "MIT researchers present breakthrough techniques for optimizing deep learning models",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400"
        },
        isLiked: true,
        isSaved: true
    },
    // Advertisement Post Examples
    {
        id: 15,
        slug: "ab8cd1e2f",
        author: sampleUsers[0], // Sofia Martinez (but as an advertiser)
        type: "ads",
        content: "🚀 Master Spanish 3x faster with our AI-powered conversation practice! Join over 100,000 learners who've achieved fluency using our revolutionary method. Try your first lesson FREE today!",
        category: "language",
        tags: ["spanish", "ai", "conversation", "free-trial"],
        url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
        timestamp: "2h",
        engagement: {
            likes: 127,
            comments: 23,
            shares: 45,
            views: 2345,
            reactions: {
                like: 89,
                love: 23,
                celebrate: 15
            }
        },
        isLiked: false,
        isSaved: false
    },
    {
        id: 16,
        slug: "gh9ij2k3l",
        author: sampleUsers[3], // Alex Rivera (as advertiser)
        type: "ads",
        content: "💻 Want to land your dream coding job? Our intensive 12-week bootcamp has a 95% job placement rate! Learn full-stack development from industry experts. Limited spots available - apply now!",
        category: "technology",
        tags: ["coding", "bootcamp", "job", "full-stack"],
        url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
        featured:
        {
            type: "image",
            url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
            title: "My study setup"
        }, timestamp: "4h",
        engagement: {
            likes: 234,
            comments: 56,
            shares: 78,
            views: 4567,
            reactions: {
                like: 178,
                love: 34,
                celebrate: 22
            }
        },
        isLiked: false,
        isSaved: false
    },
    // Sponsored Post Examples
    {
        id: 17,
        slug: "mn0op3q4r",
        author: sampleUsers[2], // Sarah Kim (as sponsor)
        type: "sponsored",
        content: "🎨 Unlock your creative potential with premium digital art tools! Professional artists worldwide trust our software for creating stunning masterpieces. Download your free trial and see why we're #1 in digital creativity.",
        category: "arts",
        tags: ["digital-art", "software", "creative", "professional"],
        url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
        featured:
        {
            type: "image",
            url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
            title: "My study setup"
        },
        timestamp: "6h",
        engagement: {
            likes: 345,
            comments: 78,
            shares: 123,
            views: 6789,
            reactions: {
                like: 267,
                love: 45,
                celebrate: 33
            }
        },
        isLiked: false,
        isSaved: false
    },
    {
        id: 18,
        slug: "st4uv5w6x",
        author: sampleUsers[4], // Emma Thompson (as sponsor)
        type: "sponsored",
        content: "🌍 Transform your language learning journey with our immersive VR experience! Practice conversations in virtual Paris, Tokyo, or Madrid. Revolutionary technology meets proven learning methods.",
        category: "language",
        url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
        tags: ["VR", "immersive", "conversation", "technology"],
        timestamp: "8h",
        engagement: {
            likes: 567,
            comments: 134,
            shares: 234,
            views: 8901,
            reactions: {
                like: 423,
                love: 89,
                celebrate: 55
            }
        },
        isLiked: true,
        isSaved: false
    },
    // News Post Examples
    {
        id: 19,
        slug: "yz7ab0c1d",
        author: sampleUsers[1], // Dr. Marcus Chen
        type: "news",
        title: "🚨 BREAKING",
        content: "New study reveals that bilingual individuals show 40% better problem-solving skills compared to monolinguals. The research, conducted across 15 countries, suggests that language learning significantly enhances cognitive flexibility and creative thinking.",
        category: "language",
        tags: ["research", "bilingual", "cognitive", "study"],
        timestamp: "1h",
        engagement: {
            likes: 789,
            comments: 156,
            shares: 345,
            views: 12456,
            reactions: {
                like: 567,
                love: 134,
                celebrate: 88
            }
        },
        featured:
        {
            type: "image",
            url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
            title: "My study setup"
        },
        isLiked: true,
        isSaved: true
    },
    {
        id: 20,
        slug: "ef8gh1i2j",
        author: sampleUsers[3], // Alex Rivera
        type: "news",
        title: "⚡ TECH NEWS",
        content: "GitHub announces revolutionary AI coding assistant that can write entire applications from natural language descriptions. Beta testing shows 70% reduction in development time. This could change software development forever!",
        category: "technology",
        tags: ["github", "ai", "coding", "development"],
        timestamp: "2h",
        engagement: {
            likes: 1234,
            comments: 267,
            shares: 456,
            views: 15678,
            reactions: {
                like: 890,
                love: 234,
                celebrate: 110
            }
        },
        isLiked: false,
        isSaved: true
    },
    {
        id: 21,
        slug: "kl9mn2o3p",
        author: sampleUsers[2], // Sarah Kim
        type: "news",
        title: "🎨 ART WORLD UPDATE",
        content: "Major museums worldwide are now offering virtual reality art creation workshops. The Louvre, MoMA, and Tate Modern lead this digital revolution, making art education accessible globally.",
        category: "arts",
        community: {
            id: "art-innovation",
            name: "Art & Technology Innovation",
            flag: "globe",
            color: "#9B59B6"
        },
        tags: ["museums", "VR", "art-education", "global"],
        timestamp: "4h",
        engagement: {
            likes: 456,
            comments: 89,
            shares: 167,
            views: 6789,
            reactions: {
                like: 334,
                love: 78,
                celebrate: 44
            }
        },
        isLiked: true,
        isSaved: false
    },
    // Regular Posts Examples (various types)
    {
        id: 22,
        slug: "qr0st3u4v",
        author: sampleUsers[0], // Sofia Martinez
        type: "posts",
        content: "Had the most amazing breakthrough today! Finally understood the subjunctive mood in Spanish after months of struggling. The key was connecting it to emotions and doubt rather than memorizing rules. ¡Qué emocionante! 🎉",
        category: "language",
        language: {
            name: "Spanish",
            flag: "es",
            color: "#FF6B35"
        },
        community: {
            id: "spanish-advanced",
            name: "Advanced Spanish Learners",
            flag: "es",
            color: "#FF6B35"
        },
        tags: ["breakthrough", "subjunctive", "grammar", "emotions"],
        timestamp: "1h",
        engagement: {
            likes: 234,
            comments: 45,
            shares: 67,
            views: 2345,
            reactions: {
                like: 189,
                love: 34,
                celebrate: 11
            }
        },
        isLiked: true,
        isSaved: false
    },
    {
        id: 23,
        slug: "wx1yz4a5b",
        author: sampleUsers[1], // Dr. Marcus Chen
        type: "posts",
        content: "Teaching calculus to my daughter this weekend and she asked the most profound question: 'Why do we need infinity?' Led to a 2-hour discussion about limits, reality, and the beauty of mathematics. Sometimes the best lessons come from curiosity! 📚✨",
        category: "mathematics",
        community: {
            id: "math-educators",
            name: "Math Educators Community",
            flag: "education",
            color: "#3498DB"
        },
        tags: ["teaching", "calculus", "infinity", "curiosity"],
        timestamp: "12h",
        engagement: {
            likes: 456,
            comments: 78,
            shares: 89,
            views: 4567,
            reactions: {
                like: 345,
                love: 67,
                celebrate: 44
            }
        },
        poll: {
            question: "What's the most profound math question you've been asked?",
            options: ["Why do we need infinity?", "What is zero?", "Are numbers real?", "Why does math work?"],
            votes: {
                "Why do we need infinity?": 45,
                "What is zero?": 23,
                "Are numbers real?": 67,
                "Why does math work?": 89
            },
            endTime: "2024-01-29T18:00:00Z"
        },
        isLiked: false,
        isSaved: true
    },
    {
        id: 24,
        slug: "cd2ef5g6h",
        author: sampleUsers[2], // Sarah Kim
        type: "posts",
        content: "Spent the weekend experimenting with traditional Korean brush painting techniques. The patience required is meditative, and each stroke tells a story. Art truly is a universal language that transcends cultural boundaries. 🖌️🌸",
        category: "arts",
        community: {
            id: "asian-arts-culture",
            name: "Asian Arts & Culture",
            flag: "kr",
            color: "#E67E22"
        },
        media: [
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
                title: "Korean brush painting work in progress"
            },
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600",
                title: "Traditional brushes and ink"
            }
        ],
        tags: ["korean", "traditional-art", "brush-painting", "meditation"],
        timestamp: "6h",
        engagement: {
            likes: 345,
            comments: 56,
            shares: 78,
            views: 3456,
            reactions: {
                like: 267,
                love: 56,
                celebrate: 22
            }
        },
        isLiked: true,
        isSaved: true
    },
    {
        id: 25,
        slug: "ij3kl6m7n",
        author: sampleUsers[3], // Alex Rivera
        type: "posts",
        content: "Just deployed my first machine learning model to production! 🚀 It predicts code complexity and suggests refactoring opportunities. Took 3 months of learning TensorFlow, but seeing it help real developers is incredibly rewarding. The future of coding is collaborative AI!",
        category: "technology",
        community: {
            id: "ml-developers",
            name: "ML Developers Hub",
            flag: "tech",
            color: "#9B59B6"
        },
        media: [
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
                title: "ML model deployment dashboard"
            }
        ],
        tags: ["machine-learning", "tensorflow", "deployment", "AI"],
        timestamp: "3h",
        engagement: {
            likes: 567,
            comments: 89,
            shares: 134,
            views: 5678,
            reactions: {
                like: 423,
                love: 89,
                celebrate: 55
            }
        },
        studyData: {
            timeSpent: 180,
            difficulty: "advanced",
            skills: ["Machine Learning", "TensorFlow", "Python", "Production Deployment"],
            resources: ["TensorFlow Docs", "ML Course", "Stack Overflow"]
        },
        isLiked: false,
        isSaved: true
    },
    {
        id: 26,
        slug: "pqr789stu",
        author: sampleUsers[4], // Emma Thompson
        type: "posts",
        content: "Starting my journey with Mandarin Chinese! 你好世界 🇨🇳 The tonal aspect is challenging but fascinating. Each tone completely changes the meaning - it's like music and language combined. Any tips from fellow Mandarin learners on mastering tones?",
        category: "language",
        language: {
            name: "Mandarin Chinese",
            flag: "cn",
            color: "#DC143C"
        },
        community: {
            id: "chinese-language-learners",
            name: "Chinese Language Learners",
            flag: "cn",
            color: "#DC143C"
        },
        tags: ["mandarin", "chinese", "tones", "beginner"],
        timestamp: "2h",
        engagement: {
            likes: 134,
            comments: 45,
            shares: 12,
            views: 1234,
            reactions: {
                like: 89,
                love: 34,
                celebrate: 11
            }
        },
        isLiked: false,
        isSaved: true
    },
    {
        id: 27,
        slug: "vwx123yza",
        author: sampleUsers[1], // Dr. Marcus Chen
        type: "posts",
        content: "Fascinating discovery in our physics lab today! 🔬 We demonstrated quantum entanglement to our students using polarized photons. Watching their minds get blown by 'spooky action at a distance' never gets old. Science education at its finest!",
        category: "science",
        community: {
            id: "physics-educators",
            name: "Physics Educators Network",
            flag: "science",
            color: "#16A085"
        },
        media: [
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600",
                title: "Quantum entanglement lab setup"
            }
        ],
        tags: ["quantum-physics", "education", "lab", "entanglement"],
        timestamp: "4h",
        engagement: {
            likes: 267,
            comments: 56,
            shares: 34,
            views: 2345,
            reactions: {
                like: 189,
                love: 45,
                celebrate: 33
            }
        },
        isLiked: true,
        isSaved: false
    },
    {
        id: 28,
        slug: "bcd456efg",
        author: sampleUsers[0], // Sofia Martinez
        type: "posts",
        content: "Book club discussion tonight was incredible! 📚 We analyzed the economic themes in 'The Grapes of Wrath' and connected them to modern inequality. Literature has such power to illuminate social issues across time periods. Next month: '1984' - more relevant than ever!",
        category: "business",
        community: {
            id: "literature-economics",
            name: "Literature & Economics Study Group",
            flag: "books",
            color: "#8E44AD"
        },
        tags: ["literature", "economics", "social-issues", "book-club"],
        timestamp: "1h",
        engagement: {
            likes: 178,
            comments: 67,
            shares: 23,
            views: 1789,
            reactions: {
                like: 123,
                love: 34,
                celebrate: 21
            }
        },
        isLiked: false,
        isSaved: true
    }];

// Sample study communities for social learning
export const socialStudyCommunities: StudyCommunity[] = [
    {
        id: "spanish-learners",
        name: "Spanish Learners Hub",
        description: "A vibrant community for Spanish language learners of all levels",
        category: "language",
        language: "Spanish",
        flag: "es",
        color: "#FF6B35",
        members: 15420,
        posts: 2340,
        moderators: [sampleUsers[0]],
        rules: [
            "Be respectful and supportive of all learners",
            "Practice Spanish as much as possible",
            "Share resources and tips freely",
            "No spam or self-promotion without permission"
        ],
        isPrivate: false,
        requiresApproval: false,
        tags: ["spanish", "conversation", "grammar", "culture"],
        createdAt: "2023-05-15",
        trending: true,
        level: "all"
    },
    {
        id: "math-study-group",
        name: "Mathematics Study Circle",
        description: "Collaborative space for mathematics learners and enthusiasts",
        category: "mathematics",
        color: "#4A90E2",
        members: 8900,
        posts: 1560,
        moderators: [sampleUsers[1]],
        rules: [
            "Show your work when asking for help",
            "Explain concepts clearly when helping others",
            "Use proper mathematical notation",
            "Be patient with beginners"
        ],
        isPrivate: false,
        requiresApproval: false,
        tags: ["algebra", "calculus", "geometry", "statistics"],
        createdAt: "2023-06-20",
        trending: true,
        level: "all"
    },
    {
        id: "creative-arts",
        name: "Creative Arts Workshop",
        description: "Express yourself through art while learning new techniques and cultural perspectives",
        category: "arts",
        color: "#E74C3C",
        members: 6750,
        posts: 890,
        moderators: [sampleUsers[2]],
        rules: [
            "Share your creative process, not just final results",
            "Provide constructive feedback on others' work",
            "Respect different artistic styles and cultures",
            "Credit sources and inspirations"
        ],
        isPrivate: false,
        requiresApproval: false,
        tags: ["digital art", "traditional art", "design", "culture"],
        createdAt: "2023-07-10",
        trending: false,
        level: "all"
    },
    {
        id: "python-beginners",
        name: "Python Programming for Beginners",
        description: "Learn Python programming from scratch with supportive community",
        category: "technology",
        color: "#27AE60",
        members: 12340,
        posts: 1890,
        moderators: [sampleUsers[1]],
        rules: [
            "Ask questions without hesitation",
            "Share code snippets when seeking help",
            "Help debug others' code when possible",
            "Practice coding regularly"
        ],
        isPrivate: false,
        requiresApproval: false,
        tags: ["python", "programming", "coding", "beginners"],
        createdAt: "2023-04-25",
        trending: true,
        level: "beginner"
    },
    {
        id: "study-accountability",
        name: "Study Accountability Partners",
        description: "Find study partners and accountability buddies across all categories",
        category: "other",
        color: "#8E44AD",
        members: 4560,
        posts: 670,
        moderators: [sampleUsers[0], sampleUsers[2]],
        rules: [
            "Commit to your study goals",
            "Check in regularly with your accountability partner",
            "Be honest about your progress",
            "Support others in their learning journey"
        ],
        isPrivate: false,
        requiresApproval: true,
        tags: ["accountability", "study habits", "motivation", "goals"],
        createdAt: "2023-09-05",
        trending: false,
        level: "all"
    },
    {
        id: "art-innovation",
        name: "Art & Technology Innovation",
        description: "Exploring the intersection of art and cutting-edge technology",
        category: "arts",
        color: "#9B59B6",
        members: 8940,
        posts: 734,
        moderators: [sampleUsers[2]],
        rules: [
            "Share innovative art-tech projects",
            "Discuss VR/AR in creative spaces",
            "Collaborate on digital art experiments",
            "Respect diverse artistic perspectives"
        ],
        isPrivate: false,
        requiresApproval: false,
        tags: ["digital-art", "VR", "innovation", "technology"],
        createdAt: "2023-07-10",
        trending: true,
        level: "intermediate"
    },
    {
        id: "chinese-language-learners",
        name: "Chinese Language Learners",
        description: "Community for Mandarin Chinese learners worldwide",
        category: "language",
        language: "Chinese",
        flag: "cn",
        color: "#DC143C",
        members: 18750,
        posts: 2456,
        moderators: [sampleUsers[4]],
        rules: [
            "Practice Chinese regularly in posts",
            "Help with tone pronunciation",
            "Share learning resources freely",
            "Be patient with beginners"
        ],
        isPrivate: false,
        requiresApproval: false,
        tags: ["mandarin", "chinese", "tones", "culture"],
        createdAt: "2023-05-08",
        trending: true,
        level: "all"
    },
    {
        id: "physics-educators",
        name: "Physics Educators Network",
        description: "Physics teachers and enthusiasts sharing knowledge and experiments",
        category: "science",
        color: "#16A085",
        members: 6780,
        posts: 890,
        moderators: [sampleUsers[1]],
        rules: [
            "Share lab experiments and demonstrations",
            "Discuss physics education methods",
            "Post science news and discoveries",
            "Help students with physics concepts"
        ],
        isPrivate: false,
        requiresApproval: false,
        tags: ["physics", "education", "experiments", "science"],
        createdAt: "2023-06-20",
        trending: false,
        level: "intermediate"
    },
    {
        id: "literature-economics",
        name: "Literature & Economics Study Group",
        description: "Analyzing economic themes in literature and their modern relevance",
        category: "business",
        color: "#8E44AD",
        members: 4560,
        posts: 567,
        moderators: [sampleUsers[0]],
        rules: [
            "Connect literary works to economic concepts",
            "Discuss books monthly",
            "Share reading recommendations",
            "Analyze social and economic themes"
        ],
        isPrivate: false,
        requiresApproval: false,
        tags: ["literature", "economics", "books", "social-analysis"],
        createdAt: "2023-08-15",
        trending: false,
        level: "advanced"
    }
];

export const getCommunityById = (id: string): StudyCommunity | undefined => {
    return socialStudyCommunities.find(community => community.id === id);
};

export const getCommunitiesBycategory = (category: categoryArea): StudyCommunity[] => {
    return socialStudyCommunities.filter(community => community.category === category);
};

export const getTrendingCommunities = (): StudyCommunity[] => {
    return socialStudyCommunities.filter(community => community.trending);
};

export const getPostsByType = (type: PostType): SocialPost[] => {
    return socialLearningPosts.filter(post => post.type === type);
};

export const getPostsBycategory = (category: categoryArea): SocialPost[] => {
    return socialLearningPosts.filter(post => post.category === category);
};

// Sample comments data
export const sampleComments: Comment[] = [
    // Comments for post 1 (jctb575yz - Spanish streak)
    {
        id: "c1",
        author: sampleUsers[1],
        content: "This is so inspiring! I've been struggling to maintain consistency with my math studies. Any tips on how you stayed motivated during the tough days?",
        timestamp: "1h",
        postId: 1,
        engagement: {
            likes: 12,
            replies: 2,
            reactions: {
                like: 8,
                love: 3,
                celebrate: 1
            }
        },
        isLiked: false,
        replies: [
            {
                id: "c1r1",
                author: sampleUsers[0],
                content: "Thanks! The key was setting a really small daily goal - just 15 minutes. On tough days, I'd do even less, but I never skipped completely. Having study partners helped too!",
                timestamp: "45m",
                postId: 1,
                parentId: "c1",
                engagement: {
                    likes: 8,
                    replies: 0,
                    reactions: {
                        like: 6,
                        love: 2,
                        celebrate: 0
                    }
                },
                isLiked: true
            },
            {
                id: "c1r2",
                author: sampleUsers[2],
                content: "I second this! Small consistent steps are better than big sporadic efforts.",
                timestamp: "30m",
                postId: 1,
                parentId: "c1",
                engagement: {
                    likes: 4,
                    replies: 0,
                    reactions: {
                        like: 4,
                        love: 0,
                        celebrate: 0
                    }
                },
                isLiked: false
            }
        ]
    },
    {
        id: "c2",
        author: sampleUsers[3],
        content: "Congratulations on the milestone! I'm curious about which resources you found most effective for mathematics problem-solving?",
        timestamp: "2h",
        postId: 1,
        engagement: {
            likes: 7,
            replies: 1,
            reactions: {
                like: 5,
                love: 1,
                celebrate: 1
            }
        },
        isLiked: true,
        replies: [
            {
                id: "c2r1",
                author: sampleUsers[0],
                content: "Khan Academy was great for fundamentals, but working through problem sets with friends made the biggest difference. We'd explain solutions to each other which really solidified understanding.",
                timestamp: "1h",
                postId: 1,
                parentId: "c2",
                engagement: {
                    likes: 6,
                    replies: 0,
                    reactions: {
                        like: 5,
                        love: 1,
                        celebrate: 0
                    }
                },
                isLiked: false
            }
        ]
    },
    {
        id: "c3",
        author: sampleUsers[4],
        content: "30 days is amazing! Your study setup looks so organized. Would love to see a detailed breakdown of your daily routine 📚",
        timestamp: "3h",
        postId: 1,
        engagement: {
            likes: 15,
            replies: 0,
            reactions: {
                like: 12,
                love: 2,
                celebrate: 1
            }
        },
        isLiked: true
    },

    // Comments for post 2 (bg4hj7k8l - Calculus tip)
    {
        id: "c4",
        author: sampleUsers[0],
        content: "This visualization approach is genius! I've been struggling with derivatives for weeks. Can you recommend any good resources for more visual explanations?",
        timestamp: "30m",
        postId: 2,
        engagement: {
            likes: 18,
            replies: 1,
            reactions: {
                like: 14,
                love: 3,
                celebrate: 1
            }
        },
        isLiked: false,
        replies: [
            {
                id: "c4r1",
                author: sampleUsers[1],
                content: "Try 3Blue1Brown on YouTube! His calculus series uses incredible visualizations. Also, GeoGebra is great for interactive exploration of derivatives.",
                timestamp: "15m",
                postId: 2,
                parentId: "c4",
                engagement: {
                    likes: 24,
                    replies: 0,
                    reactions: {
                        like: 20,
                        love: 3,
                        celebrate: 1
                    }
                },
                isLiked: true
            }
        ]
    },
    {
        id: "c5",
        author: sampleUsers[4],
        content: "As someone who teaches language, I love seeing how teaching techniques transfer across subjects. The 'slope thinking' is similar to how I explain grammar patterns!",
        timestamp: "1h",
        postId: 2,
        engagement: {
            likes: 9,
            replies: 0,
            reactions: {
                like: 7,
                love: 2,
                celebrate: 0
            }
        },
        isLiked: true
    },

    // Comments for post 4 (df3gh6i7j - French plateau question)
    {
        id: "c6",
        author: sampleUsers[4],
        content: "Plateaus are so frustrating but totally normal! Try changing your input - switch from textbooks to podcasts, or from formal lessons to casual conversation practice. Sometimes a different angle breaks through the wall.",
        timestamp: "2h",
        postId: 4,
        engagement: {
            likes: 23,
            replies: 2,
            reactions: {
                like: 18,
                love: 4,
                celebrate: 1
            }
        },
        isLiked: true,
        replies: [
            {
                id: "c6r1",
                author: sampleUsers[0],
                content: "This is exactly what I needed to hear! I've been doing the same routine for months. Time to mix it up with some French Netflix shows 🎬",
                timestamp: "1h",
                postId: 4,
                parentId: "c6",
                engagement: {
                    likes: 12,
                    replies: 0,
                    reactions: {
                        like: 10,
                        love: 2,
                        celebrate: 0
                    }
                },
                isLiked: false
            },
            {
                id: "c6r2",
                author: sampleUsers[1],
                content: "I second the Netflix suggestion! 'Call My Agent!' is perfect for intermediate learners - engaging plot helps you push through when you don't understand everything.",
                timestamp: "45m",
                postId: 4,
                parentId: "c6",
                engagement: {
                    likes: 8,
                    replies: 0,
                    reactions: {
                        like: 7,
                        love: 1,
                        celebrate: 0
                    }
                },
                isLiked: true
            }
        ]
    },
    {
        id: "c7",
        author: sampleUsers[2],
        content: "Have you tried finding a conversation partner? Sometimes plateaus happen because we're not challenging ourselves with real communication. iTalki and HelloTalk are great for finding native speakers.",
        timestamp: "4h",
        postId: 4,
        engagement: {
            likes: 16,
            replies: 1,
            reactions: {
                like: 13,
                love: 2,
                celebrate: 1
            }
        },
        isLiked: false,
        replies: [
            {
                id: "c7r1",
                author: sampleUsers[0],
                content: "I've been too shy to try conversation practice, but you're right - that's probably exactly what I need. Thanks for the app recommendations!",
                timestamp: "3h",
                postId: 4,
                parentId: "c7",
                engagement: {
                    likes: 5,
                    replies: 0,
                    reactions: {
                        like: 4,
                        love: 1,
                        celebrate: 0
                    }
                },
                isLiked: true
            }
        ]
    }
];

// Utility functions for comments
export const getCommentsByPostId = (postId: number): Comment[] => {
    return sampleComments.filter(comment => comment.postId === postId && !comment.parentId);
};

export const getPostBySlug = (slug: string): SocialPost | undefined => {
    return socialLearningPosts.find(post => post.slug === slug);
};

export const getCommentById = (commentId: string): Comment | undefined => {
    const findComment = (comments: Comment[]): Comment | undefined => {
        for (const comment of comments) {
            if (comment.id === commentId) return comment;
            if (comment.replies) {
                const found = findComment(comment.replies);
                if (found) return found;
            }
        }
        return undefined;
    };
    return findComment(sampleComments);
};
