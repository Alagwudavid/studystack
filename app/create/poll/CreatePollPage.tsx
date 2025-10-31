"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart3, Plus, X } from "lucide-react";

interface CreatePollPageProps {
    user?: {
        name: string;
        profile_image?: string | null;
    };
}

export default function CreatePollPage({ user }: CreatePollPageProps) {
    const router = useRouter();
    const [pollQuestion, setPollQuestion] = useState("");
    const [pollOptions, setPollOptions] = useState(["", ""]);

    const handleAddOption = () => {
        if (pollOptions.length < 5) {
            setPollOptions([...pollOptions, ""]);
        }
    };

    const handleRemoveOption = (index: number) => {
        if (pollOptions.length > 2) {
            setPollOptions(pollOptions.filter((_, i) => i !== index));
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const handleSubmit = () => {
        const validOptions = pollOptions.filter(option => option.trim() !== "");

        console.log("=== POLL SUBMISSION ===");
        console.log("Question:", pollQuestion);
        console.log("Options:", validOptions);
        console.log("User:", user);
        console.log("=== END POLL SUBMISSION ===");

        router.back();
    };

    const validOptions = pollOptions.filter(option => option.trim() !== "");
    const hasValidContent = pollQuestion.trim().length > 0 && validOptions.length >= 2;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Create Poll</h2>
                        <p className="text-sm text-muted-foreground">Ask the community for their opinions</p>
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
                        <label className="text-sm font-medium mb-2 block">Poll Question *</label>
                        <Input
                            value={pollQuestion}
                            onChange={(e) => setPollQuestion(e.target.value)}
                            placeholder="What do you want to ask?"
                            className="text-lg"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Options</label>
                        <div className="space-y-2">
                            {pollOptions.map((option, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                        {index + 1}
                                    </div>
                                    <Input
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                        className="flex-1"
                                    />
                                    {pollOptions.length > 2 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveOption(index)}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {pollOptions.length < 5 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAddOption}
                                className="mt-2 flex items-center gap-1"
                            >
                                <Plus className="h-4 w-4" />
                                Add Option
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                        Polls help gather community opinions and insights
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={!hasValidContent}>
                            Create Poll
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}