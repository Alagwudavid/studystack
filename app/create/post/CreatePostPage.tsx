"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TipTapEditor } from "@/components/TipTapEditor";
import {
    Globe,
    Archive,
    ChevronDown,
    ChevronRight,
    Info,
    UsersRound,
    Link,
    Plus,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface CreatePostPageProps {
    user?: {
        name: string;
        profile_image?: string | null;
    };
}

const privacyOptions = [
    { value: "public", label: "Public", icon: Globe },
    { value: "following", label: "Following", icon: UsersRound },
    { value: "draft", label: "Draft", icon: Archive },
];

export default function CreatePostPage({ user }: CreatePostPageProps) {
    const router = useRouter();
    const [postContent, setPostContent] = useState("");
    const [textareaContent, setTextareaContent] = useState("");
    const [privacy, setPrivacy] = useState("public");
    const [selectedCommunities, setSelectedCommunities] = useState<string[]>(["everyone"]);
    const [postTitle, setPostTitle] = useState("");
    const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);

    const communityOptions = [
        { id: "everyone", name: "Everyone", avatar: "👥", color: "bg-purple-500" },
        { id: "laravel-developers", name: "Laravel Developers", handle: "@laraveldeveloper", avatar: "🔥", color: "bg-red-500" },
        { id: "nextjs", name: "NextJS", handle: "@nextjs", avatar: "N", color: "bg-black" },
        { id: "php-dev", name: "PHP Dev", handle: "@phpdev", avatar: "🐘", color: "bg-blue-500" },
    ];

    const toggleCommunity = (communityId: string) => {
        if (communityId === "everyone") {
            setSelectedCommunities(["everyone"]);
        } else {
            setSelectedCommunities(prev => {
                const filtered = prev.filter(id => id !== "everyone");
                if (filtered.includes(communityId)) {
                    const updated = filtered.filter(id => id !== communityId);
                    return updated.length === 0 ? ["everyone"] : updated;
                } else {
                    return [...filtered, communityId];
                }
            });
        }
    };

    const getDisplayText = () => {
        if (selectedCommunities.includes("everyone")) {
            return "Everyone";
        }
        if (selectedCommunities.length === 1) {
            const community = communityOptions.find(c => c.id === selectedCommunities[0]);
            return community?.name || "Everyone";
        }
        return `${selectedCommunities.length} communities`;
    };

    const currentPrivacy = privacyOptions.find(option => option.value === privacy);

    // Sync textarea content with TipTapEditor
    useEffect(() => {
        // Convert plain text to HTML for TipTapEditor
        const htmlContent = textareaContent.replace(/\n/g, '<br>');
        setPostContent(htmlContent);
    }, [textareaContent]);

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextareaContent(e.target.value);
    };

    const handlePost = () => {
        // Handle post submission here - use the HTML content from TipTapEditor
        console.log("=== POST SUBMISSION TEST ===");
        console.log("Original textarea content:", textareaContent);
        console.log("Processed HTML content:", postContent);
        console.log("Privacy setting:", privacy);
        console.log("User info:", user);
        console.log("Content length (chars):", textareaContent.length);
        console.log("Has valid content:", hasValidContent(textareaContent));
        console.log("=== END POST TEST ===");

        // Navigate back after successful submission
        router.back();
    };

    // Helper function to check if content has meaningful text
    const hasValidContent = (content: string): boolean => {
        return content.trim().length > 0;
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="">
                <div className="flex-1">
                    <div className="relative">
                        <button
                            onClick={() => setShowCommunityDropdown(!showCommunityDropdown)}
                            className="w-fit flex items-start gap-3 p-2 rounded-lg bg-card hover:bg-muted transition-colors cursor-pointer"
                        >
                            <Avatar className="w-8 h-8 flex-shrink-0">
                                <AvatarImage
                                    src={user?.profile_image || ""}
                                    alt={user?.name || "User"}
                                />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {user?.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-foreground flex items-center gap-1 py-1">
                                <span>{getDisplayText()}</span>
                                <ChevronDown className="h-4 w-4 ml-1" />
                            </div>
                        </button>

                        {/* Community Selection Dropdown */}
                        {showCommunityDropdown && (
                            <div className="absolute top-full left-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50">
                                <div className="p-4">
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-foreground mb-2">Public</h3>
                                        <div className="space-y-2">
                                            {communityOptions.map((community) => {
                                                const isSelected = selectedCommunities.includes(community.id);
                                                const isEveryone = community.id === "everyone";

                                                return (
                                                    <div
                                                        key={community.id}
                                                        onClick={() => toggleCommunity(community.id)}
                                                        className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer"
                                                    >
                                                        <div className={cn(
                                                            "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
                                                            community.color
                                                        )}>
                                                            {community.avatar}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-medium text-foreground">{community.name}</div>
                                                            {community.handle && (
                                                                <div className="text-sm text-muted-foreground">{community.handle}</div>
                                                            )}
                                                        </div>
                                                        <div className={cn(
                                                            "w-5 h-5 rounded border-2 flex items-center justify-center",
                                                            isSelected
                                                                ? "bg-purple-500 border-purple-500"
                                                                : "border-muted-foreground"
                                                        )}>
                                                            {isSelected && (
                                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {/* {!selectedCommunities.includes("everyone") && selectedCommunities.length > 0 && ( */}
                                            <div className="mt-3 pt-3 border-t border-border">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                                        <Plus className="w-3 h-3 text-white" />
                                                    </div>
                                                    <span className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                                                        Create a new squad
                                                    </span>
                                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                            </div>
                                        {/* )} */}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowCommunityDropdown(false)}
                                            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            onClick={() => setShowCommunityDropdown(false)}
                                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Title Input */}
                    <div className="mt-4">
                        <Input
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            placeholder="Add a title..."
                            className="w-full focus-within:bg-transparent border-0 text-lg font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-0 rounded-lg bg-card/50 px-2"
                        />
                    </div>

                    <div className="flex-1 mt-4 relative">
                        {/* Visible textarea */}
                        <textarea
                            value={textareaContent}
                            onChange={handleTextareaChange}
                            placeholder={`What's on your mind, ${user?.name?.split(' ')[0] || 'User'}?`}
                            className="w-full bg-transparent resize-y ring-0 outline-none border-2 rounded-xl p-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-none transition-all duration-200"
                            rows={8}
                            style={{ minHeight: "100px" }}
                            autoFocus
                        />

                        {/* Hidden TipTapEditor for rich content processing */}
                        <div className="hidden">
                            <TipTapEditor
                                content={postContent}
                                onChange={(content) => setPostContent(content)}
                                placeholder=""
                                className="hidden"
                            />
                        </div>
                    </div>

                    <div className="space-y-3 mt-4">
                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    className="flex items-center justify-center p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                >
                                    <svg className="shrink-0 !size-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.46814 17.5319C5.62291 19.7154 7.92876 20.5 12 20.5C17.6255 20.5 19.8804 19.002 20.3853 14.3853M4.46814 17.5319C3.77924 16.2292 3.5 14.4288 3.5 12C3.5 5.5 5.5 3.5 12 3.5C18.5 3.5 20.5 5.5 20.5 12C20.5 12.8745 20.4638 13.6676 20.3853 14.3853M4.46814 17.5319L7.58579 14.4142C8.36684 13.6332 9.63317 13.6332 10.4142 14.4142L10.5858 14.5858C11.3668 15.3668 12.6332 15.3668 13.4142 14.5858L15.5858 12.4142C16.3668 11.6332 17.6332 11.6332 18.4142 12.4142L20.3853 14.3853M10.691 8.846C10.691 9.865 9.864 10.692 8.845 10.692C7.827 10.692 7 9.865 7 8.846C7 7.827 7.827 7 8.845 7C9.864 7 10.691 7.827 10.691 8.846Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="flex items-center justify-center p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                >
                                    <Link className="!size-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="flex items-center justify-center p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 !size-6">
                                        <path fillRule="evenodd" d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm9 4.5a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0v-7.5Zm1.5 0a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5H16.5v2.25H18a.75.75 0 0 1 0 1.5h-1.5v3a.75.75 0 0 1-1.5 0v-7.5ZM6.636 9.78c.404-.575.867-.78 1.25-.78s.846.205 1.25.78a.75.75 0 0 0 1.228-.863C9.738 8.027 8.853 7.5 7.886 7.5c-.966 0-1.852.527-2.478 1.417-.62.882-.908 2-.908 3.083 0 1.083.288 2.201.909 3.083.625.89 1.51 1.417 2.477 1.417.967 0 1.852-.527 2.478-1.417a.75.75 0 0 0 .136-.431V12a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0 0 1.5H9v1.648c-.37.44-.774.602-1.114.602-.383 0-.846-.205-1.25-.78C6.226 13.638 6 12.837 6 12c0-.837.226-1.638.636-2.22Z" clipRule="evenodd" />
                                    </svg>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="flex items-center justify-center p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 !size-6">
                                        <path fill="currentColor" d="M17.75 20.25q-1.575 0-2.662-1.088T14 16.5t1.088-2.662t2.662-1.088t2.663 1.088T21.5 16.5t-1.088 2.663t-2.662 1.087m0-2q.725 0 1.238-.513T19.5 16.5t-.513-1.237t-1.237-.513t-1.237.513T16 16.5t.513 1.238t1.237.512M11 17.5H5q-.425 0-.712-.288T4 16.5t.288-.712T5 15.5h6q.425 0 .713.288T12 16.5t-.288.713T11 17.5m-4.75-6.25q-1.575 0-2.662-1.088T2.5 7.5t1.088-2.662T6.25 3.75t2.663 1.088T10 7.5t-1.088 2.663T6.25 11.25m0-2q.725 0 1.238-.513T8 7.5t-.513-1.237T6.25 5.75t-1.237.513T4.5 7.5t.513 1.238t1.237.512M19 8.5h-6q-.425 0-.712-.288T12 7.5t.288-.712T13 6.5h6q.425 0 .713.288T20 7.5t-.288.713T19 8.5m-12.75-1"></path>
                                    </svg>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="flex items-center justify-center p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-6" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M9 20H6a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h11a4 4 0 0 1 4 4v3M8 2v2m7-2v2M2 8h19m-2.5 7.643l-1.5 1.5"></path><circle cx={17} cy={17} r={5}></circle></g></svg>
                                </Button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.back()}
                                    className="h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-muted"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handlePost}
                                    disabled={!hasValidContent(textareaContent)}
                                    size="sm"
                                    className="h-8 px-6 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Post
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <span
                        className="p-2 rounded-lg text-sm bg-card justify-start text-foreground flex items-center gap-1 w-full cursor-default"
                    >
                        <Info className="inline ml-1 !size-5" />
                        Posting to {getDisplayText()} as {user?.name}
                    </span>
                </div>
            </div>
        </div>
    );
}