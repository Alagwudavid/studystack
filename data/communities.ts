export interface Community {
  id: string;
  name: string;
  flag: string;
  members: number;
  posts: number;
  description: string;
  trending: boolean;
  moderators: number;
  color: string;
  category: string;
  createdAt: string;
  rules: string[];
}

export const communities: Community[] = [
  {
    id: "swahili-learners",
    name: "Swahili Learners",
    flag: "tz",
    members: 12500,
    posts: 1240,
    description: "Connect with fellow Swahili learners and native speakers",
    trending: true,
    moderators: 2,
    color: "#FF6B35",
    category: "Language Learning",
    createdAt: "2023-06-15",
    rules: [
      "Be respectful to all community members",
      "Post content related to Swahili learning",
      "No spam or commercial content",
      "Help fellow learners with patience"
    ]
  },
  {
    id: "yoruba-culture",
    name: "Yoruba Culture & Language", 
    flag: "ng",
    members: 8900,
    posts: 890,
    description: "Explore Yoruba traditions, language, and cultural practices",
    trending: false,
    moderators: 4,
    color: "#4A90E2",
    category: "Culture & Heritage",
    createdAt: "2023-05-20",
    rules: [
      "Respect Yoruba culture and traditions",
      "Share authentic cultural content",
      "Support language preservation efforts",
      "Be inclusive and welcoming"
    ]
  },
  {
    id: "amharic-study",
    name: "Amharic Study Group",
    flag: "et",
    members: 5600,
    posts: 456,
    description: "Study Amharic together with structured learning sessions",
    trending: true,
    moderators: 1,
    color: "#F39C12",
    category: "Study Groups",
    createdAt: "2023-07-10",
    rules: [
      "Participate actively in study sessions",
      "Share learning resources",
      "Provide constructive feedback",
      "Maintain study discipline"
    ]
  },
  {
    id: "hausa-exchange",
    name: "Hausa Language Exchange",
    flag: "ng",
    members: 7200,
    posts: 678,
    description: "Practice Hausa with native speakers and learners",
    trending: false,
    moderators: 6,
    color: "#27AE60",
    category: "Language Exchange",
    createdAt: "2023-04-25",
    rules: [
      "Engage in meaningful conversations",
      "Correct mistakes kindly",
      "Practice regularly",
      "Share conversation topics"
    ]
  },
  {
    id: "igbo-heritage",
    name: "Igbo Heritage",
    flag: "ng",
    members: 4300,
    posts: 234,
    description: "Learn Igbo language while discovering rich cultural heritage",
    trending: false,
    moderators: 3,
    color: "#8E44AD",
    category: "Culture & Heritage",
    createdAt: "2023-08-05",
    rules: [
      "Honor Igbo traditions",
      "Share cultural stories and practices",
      "Support language revitalization",
      "Be respectful of elders and customs"
    ]
  },
  {
    id: "zulu-conversations",
    name: "Zulu Conversations",
    flag: "za",
    members: 6800,
    posts: 567,
    description: "Practice Zulu through daily conversations and discussions",
    trending: true,
    moderators: 30,
    color: "#E74C3C",
    category: "Conversation Practice",
    createdAt: "2023-03-12",
    rules: [
      "Use Zulu as much as possible",
      "Be patient with beginners",
      "Share daily conversation topics",
      "Celebrate progress together"
    ]
  },
  {
    id: "mandarin-beginners",
    name: "Mandarin Beginners Hub",
    flag: "cn",
    members: 15600,
    posts: 2100,
    description: "Perfect starting point for Mandarin Chinese learners",
    trending: true,
    moderators: 8,
    color: "#3498DB",
    category: "Beginner Friendly",
    createdAt: "2023-02-18",
    rules: [
      "Ask questions without hesitation",
      "Practice tone pronunciation",
      "Share learning resources",
      "Support fellow beginners"
    ]
  },
  {
    id: "arabic-calligraphy",
    name: "Arabic Calligraphy & Language",
    flag: "sa",
    members: 9300,
    posts: 1450,
    description: "Learn Arabic through the beautiful art of calligraphy",
    trending: false,
    moderators: 5,
    color: "#E67E22",
    category: "Arts & Language",
    createdAt: "2023-06-30",
    rules: [
      "Appreciate the art of Arabic script",
      "Share calligraphy techniques",
      "Learn language through visual arts",
      "Respect traditional methods"
    ]
  }
];

export const getCommunityById = (id: string): Community | undefined => {
  return communities.find(community => community.id === id);
};

export const getCommunitiesByCategory = (category: string): Community[] => {
  return communities.filter(community => community.category === category);
};

export const getTrendingCommunities = (): Community[] => {
  return communities.filter(community => community.trending);
};

export const getCommunitiesByLanguage = (language: string): Community[] => {
  return communities.filter(community => 
    community.name.toLowerCase().includes(language.toLowerCase())
  );
};
