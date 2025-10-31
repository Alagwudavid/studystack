"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Hash,
  ChevronRight,
  Lock,
  Search,
  Smile,
  Gamepad2,
  HelpCircle,
  Cpu,
  Film,
  Plane,
  Star,
  Music,
  BookOpen,
  Globe,
  Heart,
  Zap,
  TrendingUp,
  // HatGlasses,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLayoutContext } from "@/contexts/LayoutContext";
import { useDynamicTitle } from "@/hooks/use-dynamic-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  id: number;
  name: string;
  username?: string | null;
  email: string;
  email_verified_at: string | null;
  profile_image: string | null;
  bio: string | null;
  points: number;
  level: number;
  streak_count: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

interface ChannelsClientProps {
  serverUser?: User;
}

// Filter categories matching the image
const filterCategories = [
  { id: "all", name: "All", icon: null },
  { id: "internet-culture", name: "Internet Culture", icon: Smile },
  { id: "games", name: "Games", icon: Gamepad2 },
  { id: "qa-stories", name: "Q&As & Stories", icon: HelpCircle },
  { id: "technology", name: "Technology", icon: Cpu },
  { id: "movies-tv", name: "Movies & TV", icon: Film },
  { id: "places-travel", name: "Places & Travel", icon: Plane },
  { id: "pop-culture", name: "Pop Culture", icon: Star },
  { id: "music", name: "Music", icon: Music },
  { id: "education", name: "Education", icon: BookOpen },
  { id: "world-news", name: "World News", icon: Globe },
  { id: "relationships", name: "Relationships", icon: Heart },
  { id: "science", name: "Science", icon: Zap },
  { id: "sports", name: "Sports", icon: TrendingUp },
];

// Updated channels data without unnecessary fields
const mockChannels = [
  {
    id: 1,
    name: "SpanishLearners",
    description:
      "A channel for Spanish language learners to practice, ask questions, and share resources.",
    avatar: "/stories/placeholder-user-1.jpg",
    members: 1247000,
    isPrivate: false,
    isJoined: false,
  },
  {
    id: 2,
    name: "FrenchConversation",
    description:
      "Practice French conversation skills in a friendly environment with native speakers and learners.",
    avatar: "/stories/placeholder-user-2.jpg",
    members: 892000,
    isPrivate: false,
    isJoined: true,
  },
  {
    id: 3,
    name: "GermanGrammar",
    description:
      "Get help with German grammar questions and explanations from experienced learners.",
    avatar: "/stories/placeholder-user-3.jpg",
    members: 567000,
    isPrivate: false,
    isJoined: false,
  },
  {
    id: 4,
    name: "JapaneseBeginners",
    description:
      "Start your Japanese learning journey with supportive peers and helpful resources.",
    avatar: "/stories/placeholder-user-4.jpg",
    members: 2034000,
    isPrivate: false,
    isJoined: false,
  },
  {
    id: 5,
    name: "ItalianFoodLanguage",
    description:
      "Learn Italian through food culture, recipes, and culinary vocabulary.",
    avatar: "/stories/placeholder-user-5.jpg",
    members: 756000,
    isPrivate: true,
    isJoined: true,
  },
  {
    id: 6,
    name: "ChineseCharacters",
    description:
      "Master Chinese characters and calligraphy with step-by-step guidance.",
    avatar: "/stories/placeholder-user-6.jpg",
    members: 1345000,
    isPrivate: false,
    isJoined: false,
  },
  {
    id: 7,
    name: "PortugueseSpeakers",
    description:
      "Connect with Portuguese speakers and learners from around the world.",
    avatar: "/stories/placeholder-user-1.jpg",
    members: 445000,
    isPrivate: false,
    isJoined: false,
  },
  {
    id: 8,
    name: "RussianLearning",
    description:
      "Learn Russian language and culture with native speakers and fellow learners.",
    avatar: "/stories/placeholder-user-2.jpg",
    members: 678000,
    isPrivate: false,
    isJoined: false,
  },
  {
    id: 9,
    name: "KoreanStudyGroup",
    description:
      "Study Korean together with structured lessons and practice sessions.",
    avatar: "/stories/placeholder-user-3.jpg",
    members: 923000,
    isPrivate: true,
    isJoined: false,
  },
];

const ChannelsClient = ({ serverUser }: ChannelsClientProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [channels, setChannels] = useState(mockChannels);
  const [showMoreRecommended, setShowMoreRecommended] = useState(false);
  const [showMoreSimilar, setShowMoreSimilar] = useState(false);
  const isMobile = useIsMobile();
  const { setServerUser } = useAuth();
  const { user, isAuthenticated } = useLayoutContext();

  // Use dynamic title hook to update page title
  useDynamicTitle({
    baseTitle: "Channels - Bitroot",
  });

  // Set server user in auth context if provided
  useEffect(() => {
    if (serverUser) {
      setServerUser(serverUser);
    }
  }, [serverUser, setServerUser]);

  // Filter channels based on search and category
  const filteredChannels = channels.filter((channel) => {
    const matchesSearch =
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Split channels into recommended and similar sections
  const recommendedChannels = filteredChannels.slice(0, 6);
  const similarChannels = filteredChannels.slice(6, 9);

  // Handle join/leave channel
  const handleChannelAction = (channelId: number) => {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.id === channelId
          ? { ...channel, isJoined: !channel.isJoined }
          : channel
      )
    );
  };

  // Format member count
  const formatMemberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M members`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K members`;
    }
    return `${count} members`;
  };

  return (
    <div className="min-h-screen text-foreground">
      {/* Header */}
      <div className="">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">
            Explore Channels
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Categories */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {filterCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors",
                    selectedCategory === category.id
                      ? "bg-gray-700 text-white"
                      : "border text-muted-foreground hover:bg-gray-700 hover:text-white"
                  )}
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
            <ChevronRight className="h-5 w-5 text-gray-400 ml-2" />
          </div>
        </div>

        {/* Recommended for you Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Recommended for you
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedChannels.map((channel) => (
              <Card
                key={channel.id}
                className="bg-muted border rounded-3xl hover:bg-gray-750 transition-colors"
              >
                <CardHeader className="flex flex-row items-center w-full justify-between pb-3 space-y-0">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={channel.avatar} alt={channel.name} />
                    <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                      {channel.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 ml-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-semibold text-foreground truncate">
                        {channel.name}
                      </h3>
                      {channel.isPrivate && (
                        // HatGlasses
                        <Lock className="h-3 w-3 text-primary" />
                        // <Lock className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {formatMemberCount(channel.members)}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleChannelAction(channel.id)}
                    className={cn(
                      "w-fit h-8 text-xs font-medium ml-2",
                      channel.isJoined
                        ? "bg-red-700 hover:bg-red-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    )}
                  >
                    {channel.isJoined
                      ? "Leave"
                      : channel.isPrivate
                        ? "Request"
                        : "Join"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                    {channel.description}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>Created by</span>
                    <Avatar className="w-4 h-4 flex-shrink-0">
                      <AvatarImage src={channel.avatar} alt={channel.name} />
                      <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                        {channel.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{serverUser?.username}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* <Card
                                key={channel.id}
                                className="rounded-2xl hover:shadow-lg dark:bg-[#0d1117] dark:border-gray-700 dark:hover:border-[#7037e4] transition-all duration-200"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#072ac8] hover:bg-[#1e96fc] dark:bg-[#7037e4] dark:hover:bg-[#8ddeed] dark:hover:text-[#030318] text-white group-hover:bg-[#1e96fc] dark:group-hover:bg-[#8ddeed] dark:group-hover:text-[#030318] flex items-center justify-center">
                                                <Avatar className="w-10 h-10 flex-shrink-0">
                                                  <AvatarImage src={channel.avatar} alt={channel.name} />
                                                  <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                                                    {channel.name.charAt(0).toUpperCase()}
                                                  </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg dark:text-[#fafafa]">
                                                    {channel.name}
                                                </CardTitle>
                                                <div className="flex items-center space-x-1">
                                                    {channel.trending && (
                                                        <Badge className="bg-[#fcf300] text-[#072ac8] dark:bg-[#8ddeed] dark:text-[#030318] hover:bg-[#ffc600] dark:hover:bg-[#8ddeed]/80 rounded-full">
                                                            <TrendingUp className="w-3 h-3 mr-1" />
                                                            Private
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-[#fafafa]/70 text-sm mb-4">
                                        {channel.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-[#fafafa]/60">
                                            <div className="flex items-center space-x-1">
                                                <Users className="w-4 h-4" />
                                                <span>{formatMemberCount(channel.members)}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <MessageCircle className="w-4 h-4" />
                                                <span>2 New</span>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleChannelAction(channel.id)}
                                            className={cn("rounded-xl bg-[#072ac8] hover:bg-[#1e96fc] dark:bg-[#7037e4] dark:hover:bg-[#8ddeed] dark:hover:text-[#030318] text-white",
                                            channel.isJoined
                                            ? "bg-red-700 hover:bg-red-600 text-white"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                            )}
                                        >
                                            {channel.isJoined
                                            ? "Leave"
                                            : channel.isPrivate
                                            ? "Request"
                                            : "Join"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card> */}
          {filteredChannels.length > 6 && (
            <div className="text-center mt-6">
              <Button
                onClick={() => setShowMoreRecommended(!showMoreRecommended)}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                {showMoreRecommended ? "Show less" : "Show more"}
              </Button>
            </div>
          )}
        </div>

        {/* More like [Channel] Section */}
        {similarChannels.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              More like SpanishLearners
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarChannels.map((channel) => (
                <div
                  key={channel.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarImage src={channel.avatar} alt={channel.name} />
                      <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                        {channel.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-white font-semibold text-sm truncate">
                          {channel.name}
                        </h3>
                        {channel.isPrivate && (
                          <Lock className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mb-2">
                        {formatMemberCount(channel.members)}
                      </p>
                      <p className="text-gray-300 text-xs line-clamp-2 mb-3">
                        {channel.description}
                      </p>
                      <Button
                        onClick={() => handleChannelAction(channel.id)}
                        className={cn(
                          "w-full h-8 text-xs font-medium",
                          channel.isJoined
                            ? "bg-red-700 hover:bg-red-600 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        )}
                      >
                        {channel.isJoined
                          ? "Leave"
                          : channel.isPrivate
                            ? "Request"
                            : "Join"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredChannels.length > 9 && (
              <div className="text-center mt-6">
                <Button
                  onClick={() => setShowMoreSimilar(!showMoreSimilar)}
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  {showMoreSimilar ? "Show less" : "Show more"}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {filteredChannels.length === 0 && (
          <div className="text-center py-12">
            <Hash className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">
              No channels found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelsClient;
