"use client"
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share, Bookmark, Eye, Clock, Users, Trophy, Brain, Target, BookOpen, Lightbulb } from "lucide-react";
import { VerifiedBadge } from "@/components/verified-badge";
import { Dot } from "@/components/ui/dot";
import { SocialPost, PostType } from "@/types/social-learning";

interface SocialLearningPostProps extends SocialPost { }

const postTypeIcons: Record<PostType, any> = {
    achievement: Trophy,
    tip: Lightbulb,
    question: MessageCircle,
    resource: BookOpen,
    milestone: Target,
    project: Brain,
    "study-note": BookOpen,
    collaboration: Users,
};

const postTypeColors: Record<PostType, string> = {
    achievement: "bg-yellow-500",
    tip: "bg-blue-500",
    question: "bg-purple-500",
    resource: "bg-green-500",
    milestone: "bg-orange-500",
    project: "bg-pink-500",
    "study-note": "bg-indigo-500",
    collaboration: "bg-teal-500",
};

export function SocialLearningPost({
    id,
    author,
    type,
    content,
    category,
    language,
    community,
    media,
    tags,
    timestamp,
    engagement,
    studyData,
    collaboration,
    isLiked = false,
    isSaved = false,
}: SocialLearningPostProps) {
    const [liked, setLiked] = useState(isLiked);
    const [saved, setSaved] = useState(isSaved);
    const [likeCount, setLikeCount] = useState(engagement.likes);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    };

    const handleSave = () => {
        setSaved(!saved);
    };

    const PostTypeIcon = postTypeIcons[type];

    return (
        <Card className="border border-border rounded-3xl bg-card hover:bg-threads-surface transition-all duration-300 animate-fade-in">
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 ring-2 ring-threads-primary/20">
                            <AvatarImage src={author.avatar} alt={author.displayName} />
                            <AvatarFallback className="bg-threads-primary text-primary-foreground">
                                {author.displayName.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center space-x-1">
                                <span className="font-semibold text-foreground">{author.displayName}</span>
                                {author.verified && (
                                    <VerifiedBadge accountType={author.type} />
                                )}
                                {community && (
                                    <div className="text-foreground text-sm flex items-center space-x-2">
                                        <span>in</span>
                                        <div className="flex items-center space-x-1">
                                            {community.flag && (
                                                <div className="w-4 h-4 rounded-full mr-1 overflow-hidden">
                                                    <img
                                                        src={`/flag/${community.flag}.png`}
                                                        alt={`${community.name} flag`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <span className="text-foreground text-sm font-medium">{community.name}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Badge
                                    variant="secondary"
                                    className={`text-xs px-2 py-0.5 text-white ${postTypeColors[type]}`}
                                >
                                    <PostTypeIcon className="h-3 w-3 mr-1" />
                                    {type.replace("-", " ").toUpperCase()}
                                </Badge>

                                {author.level && (
                                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                                        Level {author.level}
                                    </Badge>
                                )}

                                {language && (
                                    <Badge
                                        className="text-xs p-0.5 pr-1 text-white"
                                        style={{ backgroundColor: language.color }}
                                    >
                                        <div className="size-4 rounded-full mr-1 overflow-hidden flex items-center justify-center">
                                            <img
                                                src={`/flag/${language.flag}.png`}
                                                alt={`${language.name} flag`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {language.name}
                                    </Badge>
                                )}

                                {category && category !== "language" && (
                                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                                        {category}
                                    </Badge>
                                )}

                                <Dot />
                                <span>{timestamp}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-3">
                    <p className="text-foreground leading-relaxed">{content}</p>

                    {/* Study Data */}
                    {studyData && (
                        <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-muted">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold text-foreground">Study Session</h4>
                                {studyData.difficulty && (
                                    <Badge variant="outline" className="text-xs">
                                        {studyData.difficulty}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                {studyData.timeSpent && (
                                    <div className="flex items-center space-x-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{studyData.timeSpent} min</span>
                                    </div>
                                )}
                                {studyData.skills && (
                                    <div className="flex items-center space-x-1">
                                        <Brain className="h-4 w-4" />
                                        <span>{studyData.skills.join(", ")}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Collaboration Info */}
                    {collaboration?.isCollaborative && (
                        <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-600">Looking for study partners</span>
                                {collaboration.maxParticipants && (
                                    <Badge variant="outline" className="text-xs">
                                        {collaboration.currentParticipants?.length || 0}/{collaboration.maxParticipants}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

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
                {media && media.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 mb-4">
                        {media.map((item, index) => (
                            <div key={index} className="relative rounded-lg overflow-hidden border border-border group">
                                {item.type === "video" ? (
                                    <video
                                        src={item.url}
                                        poster={item.thumbnail}
                                        className="w-full h-64 object-cover"
                                        controls
                                    />
                                ) : item.type === "audio" ? (
                                    <div className="p-4 bg-muted">
                                        <audio src={item.url} controls className="w-full" />
                                        {item.title && <p className="text-sm mt-2 text-muted-foreground">{item.title}</p>}
                                    </div>
                                ) : (
                                    <img
                                        src={item.url}
                                        alt="Post media"
                                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Engagement Stats */}
                <div className="flex items-center space-x-4 mb-4 text-muted-foreground text-sm">
                    <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{engagement.views.toLocaleString()}</span>
                    </div>
                    {engagement.shares > 0 && (
                        <div className="flex items-center space-x-1">
                            <Bookmark className="h-4 w-4" />
                            <span>{engagement.shares}</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLike}
                            className={`p-2 h-auto hover:bg-red-50 group transition-all duration-200 ${liked ? 'text-red-500' : 'text-muted-foreground'
                                }`}
                        >
                            <Heart
                                className={`h-5 w-5 ${liked ? 'fill-current' : ''} group-hover:text-red-500 transition-colors duration-200`}
                            />
                            <span className="ml-2 text-sm font-medium">{likeCount}</span>
                        </Button>

                        <Button variant="ghost" size="sm" className="p-2 h-auto text-muted-foreground hover:bg-blue-50 hover:text-blue-500 group transition-all duration-200">
                            <MessageCircle className="h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
                            <span className="ml-2 text-sm font-medium">{engagement.comments}</span>
                        </Button>

                        <Button variant="ghost" size="sm" className="p-2 h-auto text-muted-foreground hover:bg-green-50 hover:text-green-500 group transition-all duration-200">
                            <Share className="h-5 w-5 group-hover:text-green-500 transition-colors duration-200" />
                            <span className="ml-2 text-sm font-medium">{engagement.shares}</span>
                        </Button>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSave}
                        className={`p-2 h-auto transition-all duration-200 ${saved ? 'text-blue-500' : 'text-muted-foreground hover:text-blue-500'
                            }`}
                    >
                        <Bookmark className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
