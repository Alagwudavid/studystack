export interface Story {
    id: number;
    title: string;
    image: string;
    category: string;
    timeAgo: string;
    isBreaking?: boolean;
}

export interface Channel {
    id: number;
    name: string;
    avatar: string;
    stories: Story[];
    viewedStories: number[]; // Array of story IDs that have been viewed
}

export const storyChannels: Channel[] = [
    {
        id: 1,
        name: "TechNews",
        avatar: "/stories/user-1.jpg",
        viewedStories: [1, 2], // User has viewed first 2 stories
        stories: [
            {
                id: 1,
                title: "Breaking: Major Tech Conference Announced",
                image: "/stories/placeholder-user-1.jpg",
                category: "Technology",
                timeAgo: "2h",
                isBreaking: true
            },
            {
                id: 2,
                title: "New iPhone Features Revealed",
                image: "/stories/placeholder-user-2.jpg",
                category: "Technology",
                timeAgo: "4h"
            },
            {
                id: 3,
                title: "AI Revolution in Software Development",
                image: "/stories/placeholder-user-3.jpg",
                category: "Technology",
                timeAgo: "6h"
            }
        ]
    },
    {
        id: 2,
        name: "WorldNews",
        avatar: "/stories/user-2.jpg",
        viewedStories: [4], // User has viewed first story only
        stories: [
            {
                id: 4,
                title: "Global Climate Summit Reaches Historic Agreement",
                image: "/stories/placeholder-user-2.jpg",
                category: "Environment",
                timeAgo: "3h"
            },
            {
                id: 5,
                title: "International Trade Deal Signed",
                image: "/stories/placeholder-user-1.jpg",
                category: "Politics",
                timeAgo: "5h"
            },
            {
                id: 6,
                title: "UN Security Council Emergency Meeting",
                image: "/stories/placeholder-user-4.jpg",
                category: "Politics",
                timeAgo: "8h"
            },
            {
                id: 7,
                title: "Global Economic Outlook 2025",
                image: "/stories/placeholder-user-3.jpg",
                category: "Economy",
                timeAgo: "10h"
            }
        ]
    },
    {
        id: 3,
        name: "ScienceDaily",
        avatar: "/stories/user-3.jpg",
        viewedStories: [8, 9, 10], // User has viewed all stories
        stories: [
            {
                id: 8,
                title: "New AI Breakthrough in Medical Research",
                image: "/stories/placeholder-user-3.jpg",
                category: "Science",
                timeAgo: "1h"
            },
            {
                id: 9,
                title: "Space Mission to Mars Updates",
                image: "/stories/placeholder-user-1.jpg",
                category: "Space",
                timeAgo: "7h"
            },
            {
                id: 10,
                title: "Cancer Research Breakthrough",
                image: "/stories/placeholder-user-2.jpg",
                category: "Medical",
                timeAgo: "12h"
            }
        ]
    },
    {
        id: 4,
        name: "SportsCenter",
        avatar: "/stories/user-4.jpg",
        viewedStories: [], // User hasn't viewed any stories
        stories: [
            {
                id: 11,
                title: "Olympic Games Preparation Updates",
                image: "/stories/placeholder-user-4.jpg",
                category: "Sports",
                timeAgo: "30m"
            },
            {
                id: 12,
                title: "World Cup Qualifiers Results",
                image: "/stories/placeholder-user-1.jpg",
                category: "Football",
                timeAgo: "2h"
            }
        ]
    }
];