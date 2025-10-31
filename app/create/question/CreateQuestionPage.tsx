"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Target, Tag, Info } from "lucide-react";

interface CreateQuestionPageProps {
    user?: {
        name: string;
        profile_image?: string | null;
    };
}

export default function CreateQuestionPage({ user }: CreateQuestionPageProps) {
    const router = useRouter();
    const [questionTitle, setQuestionTitle] = useState("");
    const [questionContent, setQuestionContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = () => {
        console.log("=== QUESTION SUBMISSION ===");
        console.log("Title:", questionTitle);
        console.log("Content:", questionContent);
        console.log("Tags:", tags);
        console.log("User:", user);
        console.log("=== END QUESTION SUBMISSION ===");

        router.back();
    };

    const hasValidContent = questionTitle.trim().length > 0 && questionContent.trim().length > 0;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                        <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Ask a Question</h2>
                        <p className="text-sm text-muted-foreground">Get help from the community</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.profile_image || ""} alt={user?.name || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground">{user?.name}</span>
                </div>

                <div className="space-y-4">
                    <div>
                        <Input
                            value={questionTitle}
                            onChange={(e) => setQuestionTitle(e.target.value)}
                            placeholder="What's your question?"
                            className="w-full focus-within:bg-transparent border-0 text-lg font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-0 rounded-lg bg-card/50 px-2"
                        />
                    </div>

                    <div>
                        <Textarea
                            value={questionContent}
                            onChange={(e) => setQuestionContent(e.target.value)}
                            placeholder="Provide more details about your question..."
                            className="w-full bg-transparent resize-y ring-0 outline-none border-2 rounded-xl p-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-none transition-all duration-200"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Tag className="h-4 w-4" />
                            <span className="text-sm font-medium">Tags</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                placeholder="Add a tag..."
                                className="flex-1"
                            />
                            <Button onClick={handleAddTag} size="sm" variant="outline">
                                Add
                            </Button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                                        {tag} ×
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                        
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={!hasValidContent}>
                            Ask Question
                        </Button>
                    </div>
                </div>
                <div className="mt-4">
                    <span
                        className="p-2 rounded-lg text-sm bg-card justify-start text-foreground flex items-center gap-1 w-full cursor-default"
                    >
                        <Info className="inline ml-1 !size-5" />
                        Be specific and provide context to get better answers
                    </span>
                </div>
            </div>
        </div>
    );
}