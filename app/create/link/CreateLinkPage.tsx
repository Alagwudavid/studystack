"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Info, Link as LinkIcon } from "lucide-react";

interface CreateLinkPageProps {
    user?: {
        name: string;
        profile_image?: string | null;
    };
}

export default function CreateLinkPage({ user }: CreateLinkPageProps) {
    const router = useRouter();
    const [linkUrl, setLinkUrl] = useState("");
    const [linkTitle, setLinkTitle] = useState("");
    const [linkDescription, setLinkDescription] = useState("");

    const handleSubmit = () => {
        console.log("=== LINK SUBMISSION ===");
        console.log("URL:", linkUrl);
        console.log("Title:", linkTitle);
        console.log("Description:", linkDescription);
        console.log("User:", user);
        console.log("=== END LINK SUBMISSION ===");

        router.back();
    };

    const hasValidContent = linkUrl.trim().length > 0;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                        <LinkIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Share a Link</h2>
                        <p className="text-sm text-muted-foreground">Share educational resources or interesting content</p>
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
                        <label className="text-sm font-medium mb-2 block">URL *</label>
                        <Input
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="https://example.com"
                            type="url"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Title (Optional)</label>
                        <Input
                            value={linkTitle}
                            onChange={(e) => setLinkTitle(e.target.value)}
                            placeholder="Resource title"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
                        <Textarea
                            value={linkDescription}
                            onChange={(e) => setLinkDescription(e.target.value)}
                            placeholder="Brief description of the resource..."
                            className="min-h-[100px] resize-none"
                        />
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
                            Share Link
                        </Button>
                    </div>
                </div>

                <div className="mt-4">
                    <span
                        className="p-2 rounded-lg text-sm bg-card justify-start text-foreground flex items-center gap-1 w-full cursor-default"
                    >
                        <Info className="inline ml-1 !size-5" />
                        Share helpful resources with the community
                    </span>
                </div>
            </div>
        </div>
    );
}