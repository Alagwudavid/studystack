"use client"
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share, ChartNoAxesColumn, Play, Flag, Volume2 } from "lucide-react";
import { VerifiedBadge } from "@/components/verified-badge";
import { Dot } from "@/components/ui/dot";

interface LanguagePostProps {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    level: string;
    type: "user" | "creator" | "instructor";
    verified?: boolean;
  };
  content: string;
  language: {
    name: string;
    flag: string;
    color: string;
  };
  community?: {
    name: string;
    flag: string;
    color: string;
  };
  media: {
    type: "image" | "video";
    url: string;
    thumbnail?: string;
    duration?: string;
  };
  caption?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
  tags: string[];
  liked?: boolean;
}

export function LanguagePost({
  id,
  author,
  content,
  language,
  community,
  media,
  caption,
  timestamp,
  likes,
  comments,
  shares,
  impressions,
  tags,
  liked = false,
}: LanguagePostProps) {
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="border border-border rounded-3xl bg-card hover:bg-threads-surface transition-all duration-300 animate-fade-in">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-threads-primary/20">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className="bg-threads-primary text-primary-foreground">
                {author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-foreground">{author.name}</span>
                {author.verified && (
                  <VerifiedBadge accountType={author.type} />
                )}
                {community && (
                  <div
                    className="text-foreground text-sm flex items-center space-x-2"
                  >
                    <span>in</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 rounded-full mr-1 overflow-hidden bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-center">
                        <img
                          src={`/flag/${community.flag}.png`}
                          alt={`${community.name} flag`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-foreground text-sm font-medium">{community.name}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {author.level}
                </Badge>
                <Badge
                  className="text-xs p-0.5 pr-1 text-white"
                  style={{ backgroundColor: language.color }}
                >
                  <div className="size-4 rounded-full mr-1 overflow-hidden bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-center">
                    <img
                      src={`/flag/${language.flag}.png`}
                      alt={`${language.name} flag`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {language.name}
                </Badge>
                <Dot />
                <span>{timestamp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-3">
          <p className="text-foreground leading-relaxed">{content}</p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <span key={tag} className="text-threads-primary text-sm hover:underline cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Media */}
        <div className="relative rounded-lg overflow-hidden border border-border mb-4 group">
          {media.type === "video" ? (
            <div className="relative">
              <img
                src={media.thumbnail || media.url}
                alt="Video thumbnail"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Button
                  onClick={handlePlay}
                  size="lg"
                  className="bg-black/60 hover:bg-black/80 text-white rounded-full h-16 w-16 p-0 backdrop-blur-sm transition-all duration-300 group-hover:scale-110"
                >
                  <Play className="h-6 w-6 ml-1" fill="currentColor" />
                </Button>
              </div>
              {media.duration && (
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {media.duration}
                </div>
              )}
              <div className="absolute top-2 left-2">
                <Badge className="bg-red-500 text-white text-xs">
                  <Volume2 className="h-3 w-3 mr-1" />
                  VLOG
                </Badge>
              </div>
            </div>
          ) : (
            <img
              src={media.url}
              alt="Post image"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>

        {caption && (
          <p className="text-muted-foreground text-sm mb-2 italic">"{caption}"</p>
        )}
        {/* Engagement */}
        <div className="flex items-center space-x-1 mb-4 text-muted-foreground">
          <ChartNoAxesColumn className="h-4 w-4" />
          <span className="text-sm">{impressions.toLocaleString()}</span>
        </div>

        {/* Engagement */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`p-2 h-auto hover:bg-red-50 group transition-all duration-200 ${isLiked ? 'text-red-500' : 'text-muted-foreground'
                }`}
            >
              <Heart
                className={`h-5 w-5 ${isLiked ? 'fill-current' : ''} group-hover:text-red-500 transition-colors duration-200 ${isLiked ? 'animate-scale-in' : ''
                  }`}
              />
              <span className="ml-2 text-sm font-medium">{likeCount}</span>
            </Button>

            <Button variant="ghost" size="sm" className="p-2 h-auto text-muted-foreground hover:bg-blue-50 hover:text-blue-500 group transition-all duration-200">
              <MessageCircle className="h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
              <span className="ml-2 text-sm font-medium">{comments}</span>
            </Button>

            <Button variant="ghost" size="sm" className="p-2 h-auto text-muted-foreground hover:bg-green-50 hover:text-green-500 group transition-all duration-200">
              <Share className="h-5 w-5 group-hover:text-green-500 transition-colors duration-200" />
              <span className="ml-2 text-sm font-medium">{shares}</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Button variant="ghost" size="sm" className="p-2 h-auto text-muted-foreground group transition-all duration-200">
              <Flag className="size-5 transition-colors duration-200" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}