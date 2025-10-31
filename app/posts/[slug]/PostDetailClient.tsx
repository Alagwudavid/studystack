"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, MessageCircle, Heart, Share, Bookmark, MoreHorizontal, Calendar, MapPin, Link as LinkIcon, Users, Award, Verified } from "lucide-react";
import { SocialPost, Comment } from "@/types/social-learning";
import PostCard from "@/components/PostCard";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PostDetailClientProps {
    post: SocialPost;
    comments: Comment[];
}

interface CommentComponentProps {
    comment: Comment;
    depth?: number;
}

const CommentComponent = ({ comment, depth = 0 }: CommentComponentProps) => {
    const [showReplies, setShowReplies] = useState(false);
    const [isLiked, setIsLiked] = useState(comment.isLiked || false);
    const [likes, setLikes] = useState(comment.engagement.likes);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);
    };

    return (
        <div className={cn("border-l border-transparent", depth > 0 && "ml-8 pl-2 border-muted")}>
            <div className="flex gap-3 py-3 group">
                <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.displayName} />
                    <AvatarFallback className="text-xs">
                        {comment.author.displayName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="bg-muted/50 rounded-2xl px-3 py-2 max-w-fit">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{comment.author.displayName}</span>
                            {comment.author.verified && (
                                <Verified className="w-3 h-3 text-blue-500" />
                            )}
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-2 ml-3">
                        <button
                            onClick={handleLike}
                            className={cn(
                                "flex items-center gap-1 text-xs hover:text-red-500 transition-colors",
                                isLiked && "text-red-500"
                            )}
                        >
                            <Heart className={cn("w-3 h-3", isLiked && "fill-current")} />
                            {likes > 0 && <span>{likes}</span>}
                        </button>

                        <button className="text-xs text-muted-foreground hover:text-blue-500 transition-colors">
                            Reply
                        </button>

                        {comment.replies && comment.replies.length > 0 && (
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-xs text-muted-foreground hover:text-blue-500 transition-colors"
                            >
                                {showReplies ? "Hide" : "View"} {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showReplies && comment.replies && (
                <div className="ml-3">
                    {comment.replies.map((reply) => (
                        <CommentComponent key={reply.id} comment={reply} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Post Author Sidebar Component
const PostAuthorSidebar = ({ post }: { post: SocialPost }) => {
    return (
        <div className="w-80 shrink-0 py-6 space-y-6 hidden lg:block">
            {/* Author Info */}
            <Card className="p-6 space-y-4 border bg-background">
                <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src={post.author.avatar} alt={post.author.displayName} />
                        <AvatarFallback className="text-lg font-semibold">
                            {post.author.displayName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{post.author.displayName}</h3>
                            {post.author.verified && (
                                <Verified className="w-5 h-5 text-blue-500" />
                            )}
                        </div>
                        <p className="text-muted-foreground">@{post.author.username}</p>
                        {/* <Badge variant="secondary" className="mt-1 capitalize">
                            {post.author.type}
                        </Badge> */}
                    </div>
                </div>

                {post.author.bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {post.author.bio}
                    </p>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {post.author.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{post.author.location}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(post.author.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                    <div>
                        <span className="font-semibold">{post.author.followers.toLocaleString()}</span>
                        <span className="text-muted-foreground ml-1">Followers</span>
                    </div>
                    <div>
                        <span className="font-semibold">{post.author.following.toLocaleString()}</span>
                        <span className="text-muted-foreground ml-1">Following</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Button className="w-full" size="sm">
                        Follow
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                        Message
                    </Button>
                </div>
            </Card>

            {/* Community Info */}
            {post.community && (
                <Card className="p-6 space-y-4 border bg-background">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: post.community.color }}>
                                <span className="text-white font-semibold text-sm">
                                    {post.community.name.slice(0, 2).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium">{post.community.name}</p>
                                <p className="text-xs text-muted-foreground">Community</p>
                            </div>
                        </div>

                        <Button variant="outline" size="sm" className="w-full">
                            Join Community
                        </Button>
                    </div>
                </Card>
            )}

            {/* Post Meta */}
            <Card className="p-6 space-y-4 border bg-background">
                <h4 className="font-semibold flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Post Details
                </h4>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Posted</span>
                        <span>{post.timestamp} ago</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <Badge variant="outline" className="capitalize">
                            {post.category || 'General'}
                        </Badge>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Type</span>
                        <Badge variant="outline" className="capitalize">
                            {post.type}
                        </Badge>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Views</span>
                        <span>{post.engagement.views.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Engagement</span>
                        <span>{(post.engagement.likes + post.engagement.comments + post.engagement.shares).toLocaleString()}</span>
                    </div>
                </div>

                {post.tags && post.tags.length > 0 && (
                    <div>
                        <p className="font-medium mb-2">Tags</p>
                        <div className="flex flex-wrap gap-1">
                            {post.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs text-black">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

const PostDetailClient = ({ post, comments }: PostDetailClientProps) => {
    const router = useRouter();
    const [newComment, setNewComment] = useState("");

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        // In a real app, you'd submit this to your API
        console.log("Adding comment:", newComment);
        setNewComment("");
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="flex">
                {/* Main Content */}
                <div className="flex-1 max-w-2xl mx-auto my-6">
                    <div className="border rounded-3xl overflow-clip relative">
                        {/* Header */}
                        <div className="w-full bg-background mx-auto flex items-center justify-between pt-4 p-2 mb-4 sticky top-0 z-20 backdrop-blur-md">
                            <div className="flex-1 flex flex-row items-center gap-2 overflow-x-auto scrollbar-custom">
                                <button onClick={() => router.back()} className={cn("text-base text-foreground flex flex-row items-center gap-1 bg-muted/50 hover:bg-card rounded-lg p-1")}>
                                    <p className="sr-only">Back</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="m4 10l-.707.707L2.586 10l.707-.707zm17 8a1 1 0 1 1-2 0zM8.293 15.707l-5-5l1.414-1.414l5 5zm-5-6.414l5-5l1.414 1.414l-5 5zM4 9h10v2H4zm17 7v2h-2v-2zm-7-7a7 7 0 0 1 7 7h-2a5 5 0 0 0-5-5z"></path></svg>
                                </button>
                            </div>
                            <div className="w-fit flex flex-row items-center gap-2">
                                <Link href="/#feed-setting" className={cn("text-base text-foreground flex flex-row items-center gap-1 hover:bg-muted/50 rounded-lg p-1")}>
                                <p className="sr-only">Feed setting</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M16 15c1.306 0 2.418.835 2.83 2H20a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 1 1 0-2h9.17A3 3 0 0 1 16 15m0 2a1 1 0 1 0 0 2a1 1 0 0 0 0-2M8 9a3 3 0 0 1 2.762 1.828l.067.172H20a1 1 0 0 1 .117 1.993L20 13h-9.17a3.001 3.001 0 0 1-5.592.172L5.17 13H4a1 1 0 0 1-.117-1.993L4 11h1.17A3 3 0 0 1 8 9m0 2a1 1 0 1 0 0 2a1 1 0 0 0 0-2m8-8c1.306 0 2.418.835 2.83 2H20a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 0 1 0-2h9.17A3 3 0 0 1 16 3m0 2a1 1 0 1 0 0 2a1 1 0 0 0 0-2"></path></g></svg>
                                </Link>
                            </div>
                        </div>
                        {/* Post Content */}
                        <div className="border-b">
                            <PostCard post={post} isDetailView={true} />
                        </div>

                        {/* Comments Section */}
                        <div className="p-6">
                            <h2 className="font-semibold text-lg mb-6">
                                Comments ({comments.reduce((total, comment) => {
                                    return total + 1 + (comment.replies?.length || 0);
                                }, 0)})
                            </h2>

                            {/* Add Comment Form */}
                            <div className="mb-8">
                                <div className="flex gap-3 items-start">
                                    <Avatar className="w-10 h-10 flex-shrink-0">
                                        <AvatarImage src="/user-placeholder.png" alt="Your avatar" />
                                        <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                                            You
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 relative">
                                        <div className="bg-muted/30 rounded-full px-3 py-2 flex items-center gap-3">
                                            <input
                                                type="text"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Add a comment, @ to mention..."
                                                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/70"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleAddComment(e);
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={handleAddComment}
                                                disabled={!newComment.trim()}
                                                className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                                    newComment.trim()
                                                        ? "bg-blue-500 text-white hover:bg-blue-600"
                                                        : "bg-muted text-muted-foreground cursor-not-allowed"
                                                )}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-1">
                                {comments.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p>No comments yet</p>
                                        <p className="text-sm">Be the first to start the conversation!</p>
                                    </div>
                                ) : (
                                    comments.map((comment) => (
                                        <CommentComponent key={comment.id} comment={comment} />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <PostAuthorSidebar post={post} />
            </div>
        </div>
    );
};

export default PostDetailClient;