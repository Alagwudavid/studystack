"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface QuickPostProps {
    user?: {
        name: string;
        profile_image?: string | null;
    };
    className?: string;
    onCreatePost?: () => void;
}

export const QuickPost = ({ user, className, onCreatePost }: QuickPostProps) => {
    const handleTextareaClick = () => {
        onCreatePost?.();
    };

    return (
        <Card className={cn("bg-card/30 dark:bg-card/70 hover:bg-card rounded-none rounded-t-2xl md:rounded-2xl shadow-sm border-none flex gap-3 p-4", className)}>
            <div className="space-y-3 flex-1">
                {/* Top section with avatar and input */}
                <div className="flex items-center justify-between gap-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage
                            src={user?.profile_image || ""}
                            alt={user?.name || "User"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 relative">
                        <textarea
                            onClick={handleTextareaClick}
                            placeholder={`What do you want to share?`}
                            className="w-full bg-transparent resize-none ring-0 outline-none border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-none transition-all duration-200 cursor-pointer"
                            rows={1}
                            // style={{ minHeight: "44px" }}
                            readOnly
                        />
                    </div>
                    <Button
                        variant="ghost"
                        className="w-10 h-10 p-2 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        onClick={handleTextareaClick}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="shrink-0 !size-6" viewBox="0 0 24 24"><path fill="currentColor" d="M20.04 2.323c1.016-.355 1.992.621 1.637 1.637l-5.925 16.93c-.385 1.098-1.915 1.16-2.387.097l-2.859-6.432l4.024-4.025a.75.75 0 0 0-1.06-1.06l-4.025 4.024l-6.432-2.859c-1.063-.473-1-2.002.097-2.387z"></path></svg>
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default QuickPost;