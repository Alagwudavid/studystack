// Interest interface for the database structure
export interface Interest {
    id: number; // Primary key
    real_id: string; // Custom ID like 'xYu427'
    label: string; // Interest name
    user_id?: string | null; // User who added it (null for default)
    username?: string | null; // Username who added it (null for default)
    is_added_by_user: boolean; // true if added by user, false if default
    created_at?: string;
    updated_at?: string;
}

// Legacy interface for backward compatibility
export interface LegacyInterest {
    id: string;
    label: string;
}

// Common interests for personal accounts (kept for reference/fallback)
export const personalInterests: LegacyInterest[] = [
    // Languages
    { id: "spanish", label: "Spanish" },
    { id: "french", label: "French" },
    { id: "mandarin", label: "Mandarin" },
    { id: "japanese", label: "Japanese" },
    { id: "korean", label: "Korean" },
    { id: "german", label: "German" },
    { id: "italian", label: "Italian" },
    { id: "portuguese", label: "Portuguese" },
    { id: "arabic", label: "Arabic" },
    { id: "russian", label: "Russian" },
    { id: "swahili", label: "Swahili" },
    { id: "yoruba", label: "Yoruba" },
    { id: "amharic", label: "Amharic" },
    { id: "hausa", label: "Hausa" },

    // Arts & Culture
    { id: "digital-art", label: "Digital Art" },
    { id: "traditional-art", label: "Traditional Art" },
    { id: "music", label: "Music" },
    { id: "photography", label: "Photography" },
    { id: "design", label: "Design" },
    { id: "culture", label: "Cultural Studies" },
    { id: "history", label: "History" },
    { id: "literature", label: "Literature" },

    // Technology
    { id: "programming", label: "Programming" },
    { id: "web-development", label: "Web Development" },
    { id: "mobile-development", label: "Mobile Development" },
    { id: "data-science", label: "Data Science" },
    { id: "ai-ml", label: "AI & Machine Learning" },
    { id: "cybersecurity", label: "Cybersecurity" },
    { id: "blockchain", label: "Blockchain" },

    // Science & Math
    { id: "mathematics", label: "Mathematics" },
    { id: "physics", label: "Physics" },
    { id: "chemistry", label: "Chemistry" },
    { id: "biology", label: "Biology" },
    { id: "psychology", label: "Psychology" },
    { id: "astronomy", label: "Astronomy" },

    // Business & Career
    { id: "entrepreneurship", label: "Entrepreneurship" },
    { id: "marketing", label: "Marketing" },
    { id: "finance", label: "Finance" },
    { id: "management", label: "Management" },
    { id: "sales", label: "Sales" },
    { id: "consulting", label: "Consulting" },

    // Personal Development
    { id: "productivity", label: "Productivity" },
    { id: "mindfulness", label: "Mindfulness" },
    { id: "fitness", label: "Fitness" },
    { id: "cooking", label: "Cooking" },
    { id: "travel", label: "Travel" },
    { id: "reading", label: "Reading" },

    // Philosophy & Thinking
    { id: "philosophy", label: "Philosophy" },
    { id: "critical-thinking", label: "Critical Thinking" },
    { id: "ethics", label: "Ethics" },
    { id: "logic", label: "Logic" },

    // Additional interests for search
    { id: "writing", label: "Writing" },
    { id: "gaming", label: "Gaming" },
    { id: "sports", label: "Sports" },
    { id: "yoga", label: "Yoga" },
    { id: "meditation", label: "Meditation" },
    { id: "gardening", label: "Gardening" },
    { id: "diy", label: "DIY & Crafts" },
    { id: "interior-design", label: "Interior Design" },
    { id: "fashion", label: "Fashion" },
    { id: "beauty", label: "Beauty & Skincare" },
    { id: "health", label: "Health & Wellness" },
    { id: "nutrition", label: "Nutrition" },
    { id: "parenting", label: "Parenting" },
    { id: "pets", label: "Pets & Animals" },
    { id: "environment", label: "Environment" },
    { id: "sustainability", label: "Sustainability" },
    { id: "volunteering", label: "Volunteering" },
    { id: "social-justice", label: "Social Justice" },
    { id: "politics", label: "Politics" },
    { id: "economics", label: "Economics" },
    { id: "investing", label: "Investing" },
    { id: "real-estate", label: "Real Estate" },
    { id: "cryptocurrency", label: "Cryptocurrency" },
    { id: "networking", label: "Networking" },
    { id: "public-speaking", label: "Public Speaking" },
    { id: "leadership", label: "Leadership" },
    { id: "teamwork", label: "Teamwork" },
    { id: "communication", label: "Communication" },
    { id: "creativity", label: "Creativity" },
    { id: "innovation", label: "Innovation" },
    { id: "problem-solving", label: "Problem Solving" },
    { id: "research", label: "Research" },
    { id: "teaching", label: "Teaching" },
    { id: "learning", label: "Learning" },
    { id: "self-improvement", label: "Self Improvement" },
    { id: "time-management", label: "Time Management" },
    { id: "goal-setting", label: "Goal Setting" },
    { id: "motivation", label: "Motivation" },
    { id: "confidence", label: "Confidence Building" },
    { id: "relationships", label: "Relationships" },
    { id: "dating", label: "Dating" },
    { id: "marriage", label: "Marriage" },
    { id: "family", label: "Family" },
    { id: "friendship", label: "Friendship" },
    { id: "spirituality", label: "Spirituality" },
    { id: "religion", label: "Religion" },
    { id: "theology", label: "Theology" },
    { id: "anthropology", label: "Anthropology" },
    { id: "sociology", label: "Sociology" },
    { id: "archeology", label: "Archaeology" },
    { id: "geography", label: "Geography" },
    { id: "geology", label: "Geology" },
    { id: "marine-biology", label: "Marine Biology" },
    { id: "botany", label: "Botany" },
    { id: "zoology", label: "Zoology" },
    { id: "medicine", label: "Medicine" },
    { id: "nursing", label: "Nursing" },
    { id: "therapy", label: "Therapy" },
    { id: "counseling", label: "Counseling" },
    { id: "social-work", label: "Social Work" },
    { id: "law", label: "Law" },
    { id: "criminal-justice", label: "Criminal Justice" },
    { id: "international-relations", label: "International Relations" },
    { id: "public-policy", label: "Public Policy" },
    { id: "urban-planning", label: "Urban Planning" },
    { id: "architecture", label: "Architecture" },
    { id: "engineering", label: "Engineering" },
    { id: "mechanical-engineering", label: "Mechanical Engineering" },
    { id: "electrical-engineering", label: "Electrical Engineering" },
    { id: "civil-engineering", label: "Civil Engineering" },
    { id: "software-engineering", label: "Software Engineering" },
    { id: "biomedical-engineering", label: "Biomedical Engineering" },
    { id: "environmental-engineering", label: "Environmental Engineering" },
    { id: "aerospace", label: "Aerospace" },
    { id: "automotive", label: "Automotive" },
    { id: "robotics", label: "Robotics" },
    { id: "iot", label: "Internet of Things" },
    { id: "cloud-computing", label: "Cloud Computing" },
    { id: "devops", label: "DevOps" },
    { id: "ui-ux", label: "UI/UX Design" },
    { id: "graphic-design", label: "Graphic Design" },
    { id: "video-editing", label: "Video Editing" },
    { id: "animation", label: "Animation" },
    { id: "3d-modeling", label: "3D Modeling" },
    { id: "game-development", label: "Game Development" },
    { id: "virtual-reality", label: "Virtual Reality" },
    { id: "augmented-reality", label: "Augmented Reality" },
    { id: "film-making", label: "Film Making" },
    { id: "acting", label: "Acting" },
    { id: "theater", label: "Theater" },
    { id: "dance", label: "Dance" },
    { id: "singing", label: "Singing" },
    { id: "musical-instruments", label: "Musical Instruments" },
    { id: "composition", label: "Music Composition" },
    { id: "audio-production", label: "Audio Production" },
    { id: "podcasting", label: "Podcasting" },
    { id: "journalism", label: "Journalism" },
    { id: "blogging", label: "Blogging" },
    { id: "content-creation", label: "Content Creation" },
    { id: "social-media", label: "Social Media" },
    { id: "influencer-marketing", label: "Influencer Marketing" },
    { id: "affiliate-marketing", label: "Affiliate Marketing" },
    { id: "e-commerce", label: "E-commerce" },
    { id: "dropshipping", label: "Dropshipping" },
    { id: "amazon-fba", label: "Amazon FBA" },
    { id: "forex", label: "Forex Trading" },
    { id: "stock-trading", label: "Stock Trading" },
    { id: "options-trading", label: "Options Trading" },
    { id: "day-trading", label: "Day Trading" },
    { id: "swing-trading", label: "Swing Trading" },
    { id: "value-investing", label: "Value Investing" },
    { id: "growth-investing", label: "Growth Investing" },
    { id: "dividend-investing", label: "Dividend Investing" },
    { id: "retirement-planning", label: "Retirement Planning" },
    { id: "insurance", label: "Insurance" },
    { id: "tax-planning", label: "Tax Planning" },
    { id: "budgeting", label: "Budgeting" },
    { id: "debt-management", label: "Debt Management" },
    { id: "credit-improvement", label: "Credit Improvement" },
    { id: "home-buying", label: "Home Buying" },
    { id: "property-investment", label: "Property Investment" },
    { id: "flipping-houses", label: "House Flipping" },
    { id: "rental-properties", label: "Rental Properties" },
    { id: "commercial-real-estate", label: "Commercial Real Estate" },
];

// Suggested interests that appear first (most popular/common)
export const suggestedInterests = [
    "programming",
    "spanish",
    "music",
    "fitness",
    "cooking",
    "travel",
    "reading",
];

// Get suggested interests with full data (backward compatibility)
export const getSuggestedInterests = () => {
    return suggestedInterests.map(id => personalInterests.find(interest => interest.id === id)).filter(Boolean);
};

// Search interests by label (backward compatibility)
export const searchInterests = (query: string) => {
    if (!query.trim()) return [];

    const lowercaseQuery = query.toLowerCase();
    return personalInterests.filter(interest =>
        interest.label.toLowerCase().includes(lowercaseQuery) &&
        !suggestedInterests.includes(interest.id)
    );
};

// Get interest by ID (backward compatibility)
export const getInterestById = (id: string) => {
    return personalInterests.find(interest => interest.id === id);
};

// New functions for working with database interests

// Get interest by database ID
export const getInterestByDatabaseId = (interests: Interest[], id: number): Interest | undefined => {
    return interests.find(interest => interest.id === id);
};

// Get interest by real_id  
export const getInterestByRealId = (interests: Interest[], realId: string): Interest | undefined => {
    return interests.find(interest => interest.real_id === realId);
};

// Search database interests by label
export const searchDatabaseInterests = (interests: Interest[], query: string): Interest[] => {
    if (!query.trim()) return [];

    const lowercaseQuery = query.toLowerCase();
    return interests.filter(interest =>
        interest.label.toLowerCase().includes(lowercaseQuery)
    );
};

// Filter suggested interests from database interests
export const getSuggestedDatabaseInterests = (interests: Interest[]): Interest[] => {
    return interests.filter(interest =>
        !interest.is_added_by_user &&
        suggestedInterests.includes(interest.real_id)
    ).sort((a, b) => {
        // Sort by suggested order
        const aIndex = suggestedInterests.indexOf(a.real_id);
        const bIndex = suggestedInterests.indexOf(b.real_id);
        return aIndex - bIndex;
    });
};

// Filter default interests from database interests
export const getDefaultDatabaseInterests = (interests: Interest[]): Interest[] => {
    return interests.filter(interest => !interest.is_added_by_user);
};

// Filter user-added interests from database interests
export const getUserAddedDatabaseInterests = (interests: Interest[]): Interest[] => {
    return interests.filter(interest => interest.is_added_by_user);
};